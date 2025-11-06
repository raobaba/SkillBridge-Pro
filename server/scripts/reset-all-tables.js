/**
 * Comprehensive script to drop all tables and reset database
 * This script will:
 * 1. Create a full database backup
 * 2. Drop all tables (except drizzle system tables)
 * 3. Drop all enum types
 * 4. Clear migration records
 * 5. Recreate all enum types
 * 
 * Usage: node scripts/reset-all-tables.js
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../services/user-service/.env') });
const { Pool } = require('pg');
const fs = require('fs').promises;

const dbConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
};

const pool = new Pool(dbConfig);

async function createFullBackup() {
  try {
    console.log('💾 Creating full database backup...\n');
    
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
    
    if (tablesResult.rows.length === 0) {
      console.log('   ℹ️  No tables to backup\n');
      client.release();
      return null;
    }
    
    const backupDir = path.join(__dirname, '../backups');
    await fs.mkdir(backupDir, { recursive: true });
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(backupDir, `full-backup-${timestamp}.sql`);
    
    let backupContent = `-- Full Database Backup\n-- Created: ${new Date().toISOString()}\n\n`;
    
    // Backup all tables
    for (const row of tablesResult.rows) {
      const tableName = row.table_name;
      try {
        const dataResult = await client.query(`SELECT * FROM "${tableName}"`);
        if (dataResult.rows.length > 0) {
          backupContent += `-- Table: ${tableName}\n`;
          dataResult.rows.forEach((record, idx) => {
            const columns = Object.keys(record);
            const values = columns.map(col => {
              const val = record[col];
              if (val === null) return 'NULL';
              if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
              if (val instanceof Date) return `'${val.toISOString()}'`;
              return val;
            });
            backupContent += `INSERT INTO "${tableName}" (${columns.map(c => `"${c}"`).join(', ')}) VALUES (${values.join(', ')});\n`;
          });
          backupContent += '\n';
        }
      } catch (error) {
        console.log(`   ⚠️  Could not backup ${tableName}: ${error.message}`);
      }
    }
    
    await fs.writeFile(backupFile, backupContent);
    console.log(`   ✅ Backup saved to: ${backupFile}\n`);
    
    client.release();
    return backupFile;
  } catch (error) {
    console.error('   ❌ Backup failed:', error.message);
    return null;
  }
}

async function resetAllTables() {
  try {
    console.log('🧹 Starting complete database reset...\n');
    
    // Step 1: Create backup
    await createFullBackup();
    
    const client = await pool.connect();
    
    // Step 2: Drop all custom enum types
    console.log('1️⃣ Dropping all custom enum types...');
    const enumTypes = [
      'role',
      'project_status',
      'priority',
      'experience_level',
      'applicant_status',
      'boost_plan',
      'filter_type',
      'conversation_type',
      'conversation_status',
      'notification_type',
      'notification_priority'
    ];
    
    for (const typeName of enumTypes) {
      try {
        await client.query(`DROP TYPE IF EXISTS ${typeName} CASCADE;`);
        console.log(`   ✅ Dropped enum: ${typeName}`);
      } catch (error) {
        console.log(`   ⚠️  ${typeName}: ${error.message}`);
      }
    }
    
    // Step 3: Drop all tables
    console.log('\n2️⃣ Dropping all tables...');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      AND table_name NOT LIKE 'pg_%'
      AND table_name NOT LIKE 'drizzle%'
      ORDER BY table_name
    `);
    
    if (tablesResult.rows.length === 0) {
      console.log('   ℹ️  No tables to drop\n');
    } else {
      for (const row of tablesResult.rows) {
        try {
          await client.query(`DROP TABLE IF EXISTS "${row.table_name}" CASCADE;`);
          console.log(`   ✅ Dropped table: ${row.table_name}`);
        } catch (error) {
          console.log(`   ⚠️  ${row.table_name}: ${error.message}`);
        }
      }
    }
    
    // Step 4: Clear migration records
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
    
    // Step 5: Recreate enum types (for fresh migration)
    console.log('\n4️⃣ Recreating enum types for fresh migration...');
    const enums = [
      {
        name: 'role',
        values: ['developer', 'project-owner', 'admin']
      },
      {
        name: 'project_status',
        values: ['draft', 'active', 'paused', 'completed', 'cancelled', 'upcoming']
      },
      {
        name: 'priority',
        values: ['low', 'medium', 'high', 'urgent']
      },
      {
        name: 'experience_level',
        values: ['entry', 'junior', 'mid', 'senior', 'expert']
      },
      {
        name: 'applicant_status',
        values: ['applied', 'reviewed', 'shortlisted', 'interviewed', 'accepted', 'rejected', 'withdrawn']
      },
      {
        name: 'boost_plan',
        values: ['basic', 'premium', 'enterprise']
      }
    ];
    
    for (const enumDef of enums) {
      try {
        const values = enumDef.values.map(v => `'${v}'`).join(', ');
        await client.query(`CREATE TYPE "${enumDef.name}" AS ENUM(${values});`);
        console.log(`   ✅ Created enum: ${enumDef.name}`);
      } catch (error) {
        if (error.code === '42710') {
          console.log(`   ⚠️  Enum ${enumDef.name} already exists (should not happen)`);
        } else {
          console.log(`   ❌ Error creating ${enumDef.name}: ${error.message}`);
        }
      }
    }
    
    console.log('\n✅ Database reset complete!');
    console.log('💡 Next steps:');
    console.log('   1. Run: npm run db:migrate');
    console.log('   2. (Optional) Run: npm run db:seed\n');
    
    client.release();
    
  } catch (error) {
    console.error('\n❌ Error resetting database:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the reset
resetAllTables();

