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
      // User Service Enums
      {
        name: 'role',
        values: ['developer', 'project-owner', 'admin']
      },
      {
        name: 'notification_type',
        values: [
          'Project Match',
          'Application Update',
          'Invitation',
          'Task Deadline',
          'Chat Message',
          'Endorsement',
          'Review',
          'Career Opportunity',
          'New Applicant',
          'Recommended Developer',
          'Project Update',
          'Billing Reminder',
          'Project Milestone',
          'Team Invitation',
          'Budget Alert',
          'Flagged User',
          'Dispute Report',
          'System Alert',
          'Billing Alert',
          'Moderation Task',
          'Security Alert',
          'Platform Health',
          'User Verification',
          'Feature Request',
          'Compliance Alert',
          'Other'
        ]
      },
      {
        name: 'notification_priority',
        values: ['high', 'medium', 'low']
      },
      
      // Project Service Enums
      {
        name: 'project_status',
        values: ['draft', 'upcoming', 'active', 'paused', 'completed', 'cancelled']
      },
      {
        name: 'priority',
        values: ['low', 'medium', 'high', 'urgent']
      },
      {
        name: 'experience_level',
        values: ['entry', 'junior', 'mid', 'senior', 'expert', 'lead']
      },
      {
        name: 'applicant_status',
        values: ['applied', 'reviewed', 'shortlisted', 'interviewed', 'interviewing', 'accepted', 'rejected', 'withdrawn']
      },
      {
        name: 'boost_plan',
        values: ['basic', 'premium', 'spotlight', 'enterprise']
      },
      {
        name: 'filter_type',
        values: ['status', 'priority', 'experience_level', 'work_arrangement', 'payment_term', 'currency', 'sort_option', 'skill', 'location', 'category', 'tag']
      },
      
      // Chat Service Enums
      {
        name: 'conversation_type',
        values: ['direct', 'group', 'system', 'moderation']
      },
      {
        name: 'conversation_status',
        values: ['active', 'archived', 'deleted']
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
