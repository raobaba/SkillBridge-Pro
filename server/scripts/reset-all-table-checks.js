/**
 * Script to check all tables and reset them
 * This script will:
 * 1. Check all tables and display their row counts
 * 2. Reset all tables by truncating them (keeps structure, removes data)
 * 3. Reset sequences
 * 4. Clear migration records (optional)
 * 
 * Usage: node scripts/reset-all-table-checks.js
 */

const path = require('path');
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

async function checkAllTables() {
  try {
    console.log('🔍 Checking all tables...\n');
    
    const client = await pool.connect();
    
    // Get all tables
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      AND table_name NOT LIKE 'pg_%'
      AND table_name NOT LIKE 'drizzle%'
      ORDER BY table_name
    `);
    
    const tablesWithData = [];
    const emptyTables = [];
    
    console.log(`📊 Found ${tablesResult.rows.length} tables\n`);
    
    for (const row of tablesResult.rows) {
      const tableName = row.table_name;
      
      try {
        const countResult = await client.query(`SELECT COUNT(*) as count FROM "${tableName}"`);
        const count = parseInt(countResult.rows[0].count);
        
        if (count === 0) {
          emptyTables.push(tableName);
          console.log(`   ⚪ ${tableName}: EMPTY (0 rows)`);
        } else {
          tablesWithData.push({ name: tableName, count });
          console.log(`   ✅ ${tableName}: ${count} rows`);
        }
      } catch (error) {
        console.log(`   ⚠️  ${tableName}: Error checking - ${error.message}`);
      }
    }
    
    console.log('\n📋 Summary:');
    console.log(`   ✅ Tables with data: ${tablesWithData.length}`);
    console.log(`   ⚪ Empty tables: ${emptyTables.length}\n`);
    
    client.release();
    
    return { tablesWithData, emptyTables, allTables: tablesResult.rows.map(r => r.table_name) };
    
  } catch (error) {
    console.error('\n❌ Error checking tables:', error.message);
    throw error;
  }
}

async function resetAllTables() {
  try {
    console.log('🧹 Starting table reset...\n');
    
    // First, check all tables
    const { allTables } = await checkAllTables();
    
    if (allTables.length === 0) {
      console.log('ℹ️  No tables found to reset.\n');
      return;
    }
    
    const client = await pool.connect();
    
    // Disable foreign key checks temporarily (PostgreSQL doesn't have this, but we'll handle CASCADE)
    console.log('1️⃣ Truncating all tables...');
    
    // Get tables with foreign keys first to handle dependencies
    const tablesWithFK = await client.query(`
      SELECT DISTINCT tc.table_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'public'
        AND tc.table_name NOT LIKE 'pg_%'
        AND tc.table_name NOT LIKE 'drizzle%'
    `);
    
    const fkTableNames = tablesWithFK.rows.map(r => r.table_name);
    const tablesWithoutFK = allTables.filter(t => !fkTableNames.includes(t));
    
    // Truncate tables without foreign keys first
    for (const tableName of tablesWithoutFK) {
      try {
        await client.query(`TRUNCATE TABLE "${tableName}" RESTART IDENTITY CASCADE;`);
        console.log(`   ✅ Truncated: ${tableName}`);
      } catch (error) {
        console.log(`   ⚠️  ${tableName}: ${error.message}`);
      }
    }
    
    // Truncate tables with foreign keys (CASCADE should handle dependencies)
    for (const tableName of fkTableNames) {
      if (!tablesWithoutFK.includes(tableName)) {
        try {
          await client.query(`TRUNCATE TABLE "${tableName}" RESTART IDENTITY CASCADE;`);
          console.log(`   ✅ Truncated: ${tableName}`);
        } catch (error) {
          console.log(`   ⚠️  ${tableName}: ${error.message}`);
        }
      }
    }
    
    // Reset sequences for all tables
    console.log('\n2️⃣ Resetting sequences...');
    for (const tableName of allTables) {
      try {
        // Get the primary key column (usually 'id')
        const pkResult = await client.query(`
          SELECT column_name
          FROM information_schema.table_constraints tc
          JOIN information_schema.constraint_column_usage ccu 
            ON tc.constraint_name = ccu.constraint_name
          WHERE tc.table_name = $1
            AND tc.constraint_type = 'PRIMARY KEY'
            AND tc.table_schema = 'public'
          LIMIT 1
        `, [tableName]);
        
        if (pkResult.rows.length > 0) {
          const pkColumn = pkResult.rows[0].column_name;
          const sequenceName = `${tableName}_${pkColumn}_seq`;
          
          try {
            await client.query(`SELECT setval('${sequenceName}', 1, false);`);
            console.log(`   ✅ Reset sequence: ${sequenceName}`);
          } catch (error) {
            // Sequence might not exist or have different name, that's okay
          }
        }
      } catch (error) {
        // Ignore errors for sequence reset
      }
    }
    
    // Optional: Clear migration records
    console.log('\n3️⃣ Clearing migration records...');
    try {
      await client.query('DELETE FROM drizzle.__drizzle_migrations;');
      console.log('   ✅ Migration records cleared');
    } catch (error) {
      if (error.message.includes('does not exist')) {
        console.log('   ℹ️  Migration table does not exist yet');
      } else {
        console.log(`   ⚠️  Error clearing migrations: ${error.message}`);
      }
    }
    
    console.log('\n✅ All tables reset successfully!');
    console.log('💡 Next steps:');
    console.log('   - Run: npm run db:seed (to populate with initial data)');
    console.log('   - Or run: npm run db:migrate (if you need to re-run migrations)\n');
    
    client.release();
    
  } catch (error) {
    console.error('\n❌ Error resetting tables:', error.message);
    console.error('Stack:', error.stack);
    throw error;
  }
}

async function main() {
  try {
    await resetAllTables();
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the script
main();

