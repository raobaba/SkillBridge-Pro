const path = require('path');
const fs = require('fs').promises;
require('dotenv').config({ path: path.join(__dirname, '../services/user-service/.env') });
const { Pool } = require('pg');

const dbConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
};

const pool = new Pool(dbConfig);

// Backup files to restore from (most recent backups with data)
const backupFiles = {
  'user-service': path.join(__dirname, '../services/user-service/src/db/backups/backup-user-service-2025-11-22T05-43-53-322Z.sql'),
  'chat-service': path.join(__dirname, '../services/chat-service/src/db/backups/backup-chat-service-2025-11-22T05-43-53-137Z.sql'),
  'project-service': path.join(__dirname, '../services/project-service/src/db/backups/backup-project-service-2025-11-22T05-43-53-332Z.sql'),
  'settings-service': path.join(__dirname, '../services/settings-service/src/db/backups/backup-settings-service-2025-11-22T05-43-52-905Z.sql'),
};

async function restoreFromBackup() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Starting database restore from backups...\n');
    
    // Step 1: Drop all existing tables (to start fresh)
    console.log('1️⃣ Dropping existing tables...');
    const tablesResult = await client.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename NOT LIKE 'pg_%'
      AND tablename NOT LIKE 'drizzle%'
      ORDER BY tablename;
    `);
    
    for (const table of tablesResult.rows) {
      try {
        await client.query(`DROP TABLE IF EXISTS "${table.tablename}" CASCADE;`);
        console.log(`   ✅ Dropped table: ${table.tablename}`);
      } catch (error) {
        console.log(`   ⚠️  Error dropping ${table.tablename}: ${error.message}`);
      }
    }
    
    // Step 2: Restore from backup files
    console.log('\n2️⃣ Restoring data from backup files...');
    
    for (const [serviceName, backupFile] of Object.entries(backupFiles)) {
      try {
        // Check if backup file exists
        await fs.access(backupFile);
        
        console.log(`\n   📦 Restoring ${serviceName}...`);
        const backupSQL = await fs.readFile(backupFile, 'utf8');
        
        // Split by semicolons and execute each statement
        const statements = backupSQL
          .split(';')
          .map(s => s.trim())
          .filter(s => s.length > 0 && !s.startsWith('--'));
        
        let successCount = 0;
        let errorCount = 0;
        
        for (const statement of statements) {
          try {
            if (statement.trim()) {
              await client.query(statement + ';');
              successCount++;
            }
          } catch (error) {
            // Ignore errors for CREATE TABLE IF NOT EXISTS (table might already exist)
            if (!error.message.includes('already exists') && !error.message.includes('does not exist')) {
              console.log(`      ⚠️  Statement error: ${error.message.substring(0, 100)}`);
              errorCount++;
            }
          }
        }
        
        console.log(`      ✅ Restored ${serviceName}: ${successCount} statements executed`);
        if (errorCount > 0) {
          console.log(`      ⚠️  ${errorCount} statements had errors (likely harmless)`);
        }
      } catch (error) {
        if (error.code === 'ENOENT') {
          console.log(`   ⚠️  Backup file not found for ${serviceName}: ${backupFile}`);
        } else {
          console.log(`   ❌ Error restoring ${serviceName}: ${error.message}`);
        }
      }
    }
    
    console.log('\n✅ Database restore completed!');
    console.log('💡 Note: You may need to re-run migrations to ensure schema is up to date.');
    
  } catch (error) {
    console.error('\n❌ Error during restore:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

restoreFromBackup().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

