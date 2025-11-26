/**
 * Script to create the endorsements table
 * Run this script to set up the endorsements table in the database
 * 
 * Usage: node scripts/create-endorsements-table.js
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

async function createEndorsementsTable() {
  const client = await pool.connect();
  
  try {
    console.log('📋 Creating endorsements table...');
    
    // Create the table
    await client.query(`
      CREATE TABLE IF NOT EXISTS endorsements (
        id SERIAL PRIMARY KEY,
        developer_id INTEGER NOT NULL,
        endorser_id INTEGER NOT NULL,
        project_id INTEGER,
        skill TEXT NOT NULL,
        rating INTEGER DEFAULT 5,
        message TEXT,
        categories JSONB,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
        CONSTRAINT fk_developer FOREIGN KEY (developer_id) REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT fk_endorser FOREIGN KEY (endorser_id) REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
      );
    `);
    
    // Create indexes for better query performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_endorsements_developer_id ON endorsements(developer_id);
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_endorsements_endorser_id ON endorsements(endorser_id);
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_endorsements_project_id ON endorsements(project_id);
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_endorsements_skill ON endorsements(skill);
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_endorsements_created_at ON endorsements(created_at DESC);
    `);
    
    console.log('✅ Endorsements table created successfully!');
    console.log('✅ Indexes created successfully!');
    
  } catch (error) {
    console.error('❌ Error creating endorsements table:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

createEndorsementsTable()
  .then(() => {
    console.log('🎉 Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });

