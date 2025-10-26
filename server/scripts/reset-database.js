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

async function resetDatabase() {
  try {
    console.log('🧹 Resetting database for fresh migration...\n');
    
    const client = await pool.connect();
    
    // Drop all custom types
    console.log('1️⃣ Dropping all custom types...');
    const types = ['role', 'project_status', 'priority', 'experience_level', 'applicant_status', 'boost_plan', 'filter_type'];
    for (const typeName of types) {
      try {
        await client.query(`DROP TYPE IF EXISTS ${typeName} CASCADE;`);
        console.log(`   ✅ Dropped ${typeName}`);
      } catch (error) {
        console.log(`   ⚠️  ${typeName}: ${error.message}`);
      }
    }
    
    // Drop all tables
    console.log('\n2️⃣ Dropping all tables...');
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      AND table_name NOT LIKE 'pg_%'
      AND table_name NOT LIKE 'drizzle%'
    `);
    
    for (const row of tables.rows) {
      try {
        await client.query(`DROP TABLE IF EXISTS ${row.table_name} CASCADE;`);
        console.log(`   ✅ Dropped ${row.table_name}`);
      } catch (error) {
        console.log(`   ⚠️  ${row.table_name}: ${error.message}`);
      }
    }
    
    // Clear migration records
    console.log('\n3️⃣ Clearing migration records...');
    await client.query('DELETE FROM drizzle.__drizzle_migrations');
    console.log('   ✅ Migration records cleared');
    
    console.log('\n✅ Database reset complete!');
    
    client.release();
    
  } catch (error) {
    console.error('\n❌ Error resetting database:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

resetDatabase();
