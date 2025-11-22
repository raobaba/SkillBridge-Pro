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

async function checkEmptyTables() {
  try {
    console.log('🔍 Checking all tables for empty ones...\n');
    
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
    
    const emptyTables = [];
    const tablesWithData = [];
    
    console.log(`📊 Found ${tablesResult.rows.length} tables\n`);
    
    for (const row of tablesResult.rows) {
      const tableName = row.table_name;
      
      try {
        const countResult = await client.query(`SELECT COUNT(*) as count FROM "${tableName}"`);
        const count = parseInt(countResult.rows[0].count);
        
        if (count === 0) {
          emptyTables.push(tableName);
          console.log(`   ❌ ${tableName}: EMPTY (0 rows)`);
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
    console.log(`   ❌ Empty tables: ${emptyTables.length}\n`);
    
    if (emptyTables.length > 0) {
      console.log('📝 Empty tables that need seeding:');
      emptyTables.forEach((table, idx) => {
        console.log(`   ${idx + 1}. ${table}`);
      });
    }
    
    client.release();
    
    return { emptyTables, tablesWithData };
    
  } catch (error) {
    console.error('\n❌ Error checking tables:', error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

checkEmptyTables().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

