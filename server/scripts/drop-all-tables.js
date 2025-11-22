/**
 * Script to DROP all tables and enum types from the database
 * WARNING: This is a destructive operation - all data will be lost!
 * No backup is created automatically - use db:reset:all for safe reset with backup
 * 
 * Usage: node scripts/drop-all-tables.js
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

async function dropAllTables() {
  try {
    console.log('⚠️  DROPPING all tables and enum types...');
    console.log('⚠️  WARNING: This will delete ALL data!\n');
    
    const client = await pool.connect();
    
    // Step 1: Drop all custom enum types
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
      'notification_priority',
      'recommendation_type',
      'priority_level',
      'impact_level'
    ];
    
    for (const typeName of enumTypes) {
      try {
        await client.query(`DROP TYPE IF EXISTS ${typeName} CASCADE;`);
        console.log(`   ✅ Dropped enum: ${typeName}`);
      } catch (error) {
        console.log(`   ⚠️  ${typeName}: ${error.message}`);
      }
    }
    
    // Step 2: Drop all tables
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
    
    // Step 3: Clear migration records
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
    
    console.log('\n✅ All tables and enums dropped!');
    console.log('💡 Database is now empty. Run migrations to recreate tables.\n');
    
    client.release();
    
  } catch (error) {
    console.error('\n❌ Error dropping tables:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the drop
dropAllTables();

