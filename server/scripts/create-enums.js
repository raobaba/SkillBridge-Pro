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

async function createEnums() {
  try {
    console.log('🔧 Creating required enum types...\n');
    
    const client = await pool.connect();
    
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
          console.log(`   ⚠️  Enum ${enumDef.name} already exists`);
        } else {
          console.log(`   ❌ Error creating ${enumDef.name}: ${error.message}`);
        }
      }
    }
    
    console.log('\n✅ All enum types ready for migrations!');
    
    client.release();
    
  } catch (error) {
    console.error('\n❌ Error creating enums:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

createEnums();
