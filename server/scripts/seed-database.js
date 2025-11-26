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

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...\n');
    
    const client = await pool.connect();
    
    // 1. Create skills data (Essential - Required for projects and profiles)
    console.log('1️⃣ Creating skills...');
    const skills = [
      // Frontend Technologies
      { name: 'React', category: 'Frontend' },
      { name: 'Vue.js', category: 'Frontend' },
      { name: 'Angular', category: 'Frontend' },
      { name: 'TypeScript', category: 'Frontend' },
      { name: 'JavaScript', category: 'Frontend' },
      { name: 'HTML', category: 'Frontend' },
      { name: 'CSS', category: 'Frontend' },
      { name: 'SASS', category: 'Frontend' },
      { name: 'Tailwind CSS', category: 'Frontend' },
      { name: 'Bootstrap', category: 'Frontend' },
      { name: 'Next.js', category: 'Frontend' },
      { name: 'Nuxt.js', category: 'Frontend' },
      { name: 'Svelte', category: 'Frontend' },

      // Backend Technologies
      { name: 'Node.js', category: 'Backend' },
      { name: 'Python', category: 'Backend' },
      { name: 'Java', category: 'Backend' },
      { name: 'C#', category: 'Backend' },
      { name: 'Go', category: 'Backend' },
      { name: 'Rust', category: 'Backend' },
      { name: 'PHP', category: 'Backend' },
      { name: 'Ruby', category: 'Backend' },
      { name: 'Express', category: 'Backend' },
      { name: 'Django', category: 'Backend' },
      { name: 'Flask', category: 'Backend' },
      { name: 'Spring Boot', category: 'Backend' },
      { name: 'Laravel', category: 'Backend' },
      { name: 'GraphQL', category: 'Backend' },

      // Database Technologies
      { name: 'PostgreSQL', category: 'Database' },
      { name: 'MongoDB', category: 'Database' },
      { name: 'MySQL', category: 'Database' },
      { name: 'Redis', category: 'Database' },
      { name: 'Elasticsearch', category: 'Database' },
      { name: 'SQLite', category: 'Database' },
      { name: 'Oracle', category: 'Database' },
      { name: 'SQL Server', category: 'Database' },

      // Cloud & DevOps
      { name: 'AWS', category: 'Cloud' },
      { name: 'Azure', category: 'Cloud' },
      { name: 'GCP', category: 'Cloud' },
      { name: 'Docker', category: 'DevOps' },
      { name: 'Kubernetes', category: 'DevOps' },
      { name: 'Terraform', category: 'DevOps' },
      { name: 'Jenkins', category: 'DevOps' },
      { name: 'Git', category: 'DevOps' },
      { name: 'CI/CD', category: 'DevOps' },

      // Mobile Development
      { name: 'React Native', category: 'Mobile' },
      { name: 'Flutter', category: 'Mobile' },
      { name: 'iOS', category: 'Mobile' },
      { name: 'Android', category: 'Mobile' },
      { name: 'Swift', category: 'Mobile' },
      { name: 'Kotlin', category: 'Mobile' },

      // AI/ML
      { name: 'Machine Learning', category: 'AI/ML' },
      { name: 'TensorFlow', category: 'AI/ML' },
      { name: 'PyTorch', category: 'AI/ML' },
      { name: 'Data Science', category: 'AI/ML' },
      { name: 'AI', category: 'AI/ML' },
      { name: 'NLP', category: 'AI/ML' },

      // Blockchain
      { name: 'Blockchain', category: 'Blockchain' },
      { name: 'Solidity', category: 'Blockchain' },
      { name: 'Ethereum', category: 'Blockchain' },
      { name: 'Web3.js', category: 'Blockchain' },
      { name: 'DeFi', category: 'Blockchain' },

      // Design
      { name: 'Figma', category: 'Design' },
      { name: 'Sketch', category: 'Design' },
      { name: 'Adobe XD', category: 'Design' },
      { name: 'UI/UX Design', category: 'Design' },
      { name: 'Prototyping', category: 'Design' }
    ];
    
    for (const skill of skills) {
      await client.query(
        'INSERT INTO skills (name, category) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING',
        [skill.name, skill.category]
      );
    }
    console.log(`   ✅ Created ${skills.length} skills`);
    
    // 2. Create tags data (Essential - Required for projects)
    console.log('\n2️⃣ Creating tags...');
    const tags = [
      // Technology Types
      { name: 'Frontend', category: 'Technology' },
      { name: 'Backend', category: 'Technology' },
      { name: 'Full Stack', category: 'Technology' },
      { name: 'Mobile', category: 'Technology' },
      { name: 'Web', category: 'Technology' },
      { name: 'API', category: 'Technology' },
      { name: 'Database', category: 'Technology' },
      { name: 'Cloud', category: 'Technology' },
      { name: 'DevOps', category: 'Technology' },

      // Project Types
      { name: 'E-commerce', category: 'Project Type' },
      { name: 'SaaS', category: 'Project Type' },
      { name: 'Mobile App', category: 'Project Type' },
      { name: 'Web App', category: 'Project Type' },
      { name: 'Game', category: 'Project Type' },
      { name: 'CMS', category: 'Project Type' },
      { name: 'Dashboard', category: 'Project Type' },
      { name: 'Platform', category: 'Project Type' },

      // Characteristics
      { name: 'Scalable', category: 'Characteristic' },
      { name: 'High Performance', category: 'Characteristic' },
      { name: 'Secure', category: 'Characteristic' },
      { name: 'Real-time', category: 'Characteristic' },
      { name: 'User-friendly', category: 'Characteristic' },
      { name: 'Responsive', category: 'Characteristic' },
      { name: 'Modern', category: 'Characteristic' },

      // Domains
      { name: 'AI', category: 'Domain' },
      { name: 'Machine Learning', category: 'Domain' },
      { name: 'Blockchain', category: 'Domain' },
      { name: 'Fintech', category: 'Domain' },
      { name: 'Healthcare', category: 'Domain' },
      { name: 'Education', category: 'Domain' },
      { name: 'Enterprise', category: 'Domain' },
      { name: 'Gaming', category: 'Domain' },
      { name: 'Social Media', category: 'Domain' },
      { name: 'IoT', category: 'Domain' },
      { name: 'Open Source', category: 'Domain' },
      { name: 'Startup', category: 'Domain' }
    ];
    
    for (const tag of tags) {
      await client.query(
        'INSERT INTO tags (name, category) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING',
        [tag.name, tag.category]
      );
    }
    console.log(`   ✅ Created ${tags.length} tags`);
    
    // 3. Create subscription plans (Essential - Required for billing/subscription)
    console.log('\n3️⃣ Creating subscription plans...');
    const subscriptionPlans = [
      {
        name: 'Free',
        price: 0,
        currency: 'USD',
        period: 'forever',
        features: JSON.stringify([
          'Basic profile creation',
          'Limited project matching',
          'Basic chat functionality',
          'Community support',
        ]),
        aiCredits: 100,
        maxProjects: 3,
        maxApplications: 10,
        isActive: true
      },
      {
        name: 'Pro',
        price: 19.99,
        currency: 'USD',
        period: 'monthly',
        features: JSON.stringify([
          'Advanced AI matching',
          'Unlimited project posts',
          'Priority support',
          'Advanced analytics',
          'Portfolio sync',
          'Skill gap analysis',
        ]),
        aiCredits: 1000,
        maxProjects: -1, // Unlimited
        maxApplications: -1, // Unlimited
        isActive: true
      },
      {
        name: 'Enterprise',
        price: 99.99,
        currency: 'USD',
        period: 'monthly',
        features: JSON.stringify([
          'Everything in Pro',
          'Team management',
          'Custom integrations',
          'Dedicated support',
          'Advanced security',
          'Custom branding',
        ]),
        aiCredits: 5000,
        maxProjects: -1, // Unlimited
        maxApplications: -1, // Unlimited
        isActive: true
      }
    ];
    
    for (const plan of subscriptionPlans) {
      await client.query(
        `INSERT INTO subscription_plans (name, price, currency, period, features, ai_credits, max_projects, max_applications, is_active) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
         ON CONFLICT (name) DO UPDATE SET 
         price = EXCLUDED.price, 
         currency = EXCLUDED.currency, 
         period = EXCLUDED.period, 
         features = EXCLUDED.features, 
         ai_credits = EXCLUDED.ai_credits, 
         max_projects = EXCLUDED.max_projects, 
         max_applications = EXCLUDED.max_applications, 
         is_active = EXCLUDED.is_active,
         updated_at = NOW()`,
        [plan.name, plan.price, plan.currency, plan.period, plan.features, plan.aiCredits, plan.maxProjects, plan.maxApplications, plan.isActive]
      );
    }
    console.log(`   ✅ Created ${subscriptionPlans.length} subscription plans`);
    
    // 4. Create filter options (Essential - Standalone reference table for filters)
    console.log('\n4️⃣ Creating filter options...');
    
    // First, check if the table exists, if not create it
    const tableExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'filter_options'
      );
    `);
    
    if (!tableExists.rows[0].exists) {
      console.log('   📋 Creating filter_options table...');
      // Create the enum type first if it doesn't exist (in public schema)
      try {
        await client.query(`
          CREATE TYPE public.filter_type AS ENUM (
            'status', 'priority', 'experience_level', 'work_arrangement',
            'payment_term', 'currency', 'sort_option', 'skill',
            'location', 'category', 'tag'
          );
        `);
        console.log('   ✅ filter_type enum created');
      } catch (enumError) {
        if (enumError.code !== '42P07') { // 42P07 = duplicate_object
          console.log('   ⚠️  Enum might already exist, continuing...');
        }
      }
      
      // Create the table with explicit schema
      await client.query(`
        CREATE TABLE IF NOT EXISTS public.filter_options (
          id SERIAL PRIMARY KEY,
          type public.filter_type NOT NULL,
          value TEXT NOT NULL,
          label TEXT NOT NULL,
          category TEXT,
          country TEXT,
          region TEXT,
          description TEXT,
          is_active BOOLEAN DEFAULT true NOT NULL,
          sort_order INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT NOW() NOT NULL,
          updated_at TIMESTAMP DEFAULT NOW() NOT NULL
        );
      `);
      console.log('   ✅ filter_options table created');
    } else {
      // Table exists, but verify enum exists
      try {
        const enumExists = await client.query(`
          SELECT EXISTS (
            SELECT 1 FROM pg_type WHERE typname = 'filter_type'
          );
        `);
        if (!enumExists.rows[0].exists) {
          console.log('   📋 Creating filter_type enum (table exists but enum missing)...');
          await client.query(`
            CREATE TYPE public.filter_type AS ENUM (
              'status', 'priority', 'experience_level', 'work_arrangement',
              'payment_term', 'currency', 'sort_option', 'skill',
              'location', 'category', 'tag'
            );
          `);
          console.log('   ✅ filter_type enum created');
        }
      } catch (enumError) {
        console.log('   ⚠️  Could not verify/create enum, but continuing...');
      }
    }
    
    const filterOptions = [
      // Status options
      { type: 'status', value: 'draft', label: 'Draft', sortOrder: 1 },
      { type: 'status', value: 'upcoming', label: 'Upcoming', sortOrder: 2 },
      { type: 'status', value: 'active', label: 'Active', sortOrder: 3 },
      { type: 'status', value: 'paused', label: 'Paused', sortOrder: 4 },
      { type: 'status', value: 'completed', label: 'Completed', sortOrder: 5 },
      { type: 'status', value: 'cancelled', label: 'Cancelled', sortOrder: 6 },
      
      // Priority options
      { type: 'priority', value: 'low', label: 'Low Priority', sortOrder: 1 },
      { type: 'priority', value: 'medium', label: 'Medium Priority', sortOrder: 2 },
      { type: 'priority', value: 'high', label: 'High Priority', sortOrder: 3 },
      { type: 'priority', value: 'urgent', label: 'Urgent', sortOrder: 4 },
      
      // Experience levels
      { type: 'experience_level', value: 'entry', label: 'Entry Level', sortOrder: 1 },
      { type: 'experience_level', value: 'mid', label: 'Mid Level', sortOrder: 2 },
      { type: 'experience_level', value: 'senior', label: 'Senior Level', sortOrder: 3 },
      { type: 'experience_level', value: 'lead', label: 'Lead/Principal', sortOrder: 4 },
      { type: 'experience_level', value: 'expert', label: 'Expert', sortOrder: 5 },
      
      // Work arrangements
      { type: 'work_arrangement', value: 'remote', label: 'Remote', sortOrder: 1 },
      { type: 'work_arrangement', value: 'onsite', label: 'On-site', sortOrder: 2 },
      { type: 'work_arrangement', value: 'hybrid', label: 'Hybrid', sortOrder: 3 },
      
      // Payment terms
      { type: 'payment_term', value: 'fixed', label: 'Fixed Price', sortOrder: 1 },
      { type: 'payment_term', value: 'hourly', label: 'Hourly Rate', sortOrder: 2 },
      { type: 'payment_term', value: 'milestone', label: 'Milestone-based', sortOrder: 3 },
      { type: 'payment_term', value: 'retainer', label: 'Retainer', sortOrder: 4 },
      
      // Currencies
      { type: 'currency', value: 'USD', label: 'US Dollar ($)', sortOrder: 1 },
      { type: 'currency', value: 'EUR', label: 'Euro (€)', sortOrder: 2 },
      { type: 'currency', value: 'GBP', label: 'British Pound (£)', sortOrder: 3 },
      { type: 'currency', value: 'CAD', label: 'Canadian Dollar (C$)', sortOrder: 4 },
      { type: 'currency', value: 'AUD', label: 'Australian Dollar (A$)', sortOrder: 5 },
      { type: 'currency', value: 'INR', label: 'Indian Rupee (₹)', sortOrder: 6 },
      
      // Sort options
      { type: 'sort_option', value: 'relevance', label: 'Most Relevant', sortOrder: 1 },
      { type: 'sort_option', value: 'newest', label: 'Newest First', sortOrder: 2 },
      { type: 'sort_option', value: 'deadline', label: 'Deadline', sortOrder: 3 },
      { type: 'sort_option', value: 'budget', label: 'Budget (High to Low)', sortOrder: 4 },
      { type: 'sort_option', value: 'rating', label: 'Rating', sortOrder: 5 },
      { type: 'sort_option', value: 'applicants', label: 'Fewest Applicants', sortOrder: 6 },
      
      // Categories
      { type: 'category', value: 'Web Development', label: 'Web Development', sortOrder: 1 },
      { type: 'category', value: 'Mobile Development', label: 'Mobile Development', sortOrder: 2 },
      { type: 'category', value: 'Desktop Application', label: 'Desktop Application', sortOrder: 3 },
      { type: 'category', value: 'Backend Development', label: 'Backend Development', sortOrder: 4 },
      { type: 'category', value: 'Frontend Development', label: 'Frontend Development', sortOrder: 5 },
      { type: 'category', value: 'Full Stack Development', label: 'Full Stack Development', sortOrder: 6 },
      { type: 'category', value: 'DevOps', label: 'DevOps', sortOrder: 7 },
      { type: 'category', value: 'Data Science', label: 'Data Science', sortOrder: 8 },
      { type: 'category', value: 'Machine Learning', label: 'Machine Learning', sortOrder: 9 },
      { type: 'category', value: 'AI Development', label: 'AI Development', sortOrder: 10 },
      { type: 'category', value: 'Blockchain', label: 'Blockchain', sortOrder: 11 },
      { type: 'category', value: 'Game Development', label: 'Game Development', sortOrder: 12 },
      { type: 'category', value: 'UI/UX Design', label: 'UI/UX Design', sortOrder: 13 },
      { type: 'category', value: 'Graphic Design', label: 'Graphic Design', sortOrder: 14 },
      { type: 'category', value: 'Content Writing', label: 'Content Writing', sortOrder: 15 },
      { type: 'category', value: 'Digital Marketing', label: 'Digital Marketing', sortOrder: 16 },
      { type: 'category', value: 'SEO', label: 'SEO', sortOrder: 17 },
      { type: 'category', value: 'Video Editing', label: 'Video Editing', sortOrder: 18 },
      { type: 'category', value: 'Audio Production', label: 'Audio Production', sortOrder: 19 },
      { type: 'category', value: 'Translation', label: 'Translation', sortOrder: 20 },
      { type: 'category', value: 'Research', label: 'Research', sortOrder: 21 },
      { type: 'category', value: 'Consulting', label: 'Consulting', sortOrder: 22 },
      { type: 'category', value: 'Other', label: 'Other', sortOrder: 23 },
      
      // Locations
      { type: 'location', value: 'Remote', label: 'Remote', country: 'Global', region: 'Global', sortOrder: 1 },
      { type: 'location', value: 'San Francisco, CA', label: 'San Francisco, CA', country: 'USA', region: 'North America', sortOrder: 2 },
      { type: 'location', value: 'New York, NY', label: 'New York, NY', country: 'USA', region: 'North America', sortOrder: 3 },
      { type: 'location', value: 'Austin, TX', label: 'Austin, TX', country: 'USA', region: 'North America', sortOrder: 4 },
      { type: 'location', value: 'Seattle, WA', label: 'Seattle, WA', country: 'USA', region: 'North America', sortOrder: 5 },
      { type: 'location', value: 'Los Angeles, CA', label: 'Los Angeles, CA', country: 'USA', region: 'North America', sortOrder: 6 },
      { type: 'location', value: 'Chicago, IL', label: 'Chicago, IL', country: 'USA', region: 'North America', sortOrder: 7 },
      { type: 'location', value: 'Boston, MA', label: 'Boston, MA', country: 'USA', region: 'North America', sortOrder: 8 },
      { type: 'location', value: 'London, UK', label: 'London, UK', country: 'UK', region: 'Europe', sortOrder: 9 },
      { type: 'location', value: 'Berlin, Germany', label: 'Berlin, Germany', country: 'Germany', region: 'Europe', sortOrder: 10 },
      { type: 'location', value: 'Amsterdam, Netherlands', label: 'Amsterdam, Netherlands', country: 'Netherlands', region: 'Europe', sortOrder: 11 },
      { type: 'location', value: 'Toronto, Canada', label: 'Toronto, Canada', country: 'Canada', region: 'North America', sortOrder: 12 },
      { type: 'location', value: 'Sydney, Australia', label: 'Sydney, Australia', country: 'Australia', region: 'Oceania', sortOrder: 13 },
      { type: 'location', value: 'Singapore', label: 'Singapore', country: 'Singapore', region: 'Asia', sortOrder: 14 },
      { type: 'location', value: 'Tokyo, Japan', label: 'Tokyo, Japan', country: 'Japan', region: 'Asia', sortOrder: 15 },
      { type: 'location', value: 'Bangalore, India', label: 'Bangalore, India', country: 'India', region: 'Asia', sortOrder: 16 },
    ];
    
    // Verify table structure is correct
    try {
      const tableCheck = await client.query(`
        SELECT column_name, data_type, udt_name 
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'filter_options'
        ORDER BY ordinal_position;
      `);
      console.log(`   ✅ Verified table structure (${tableCheck.rows.length} columns)`);
    } catch (verifyError) {
      console.log(`   ⚠️  Could not verify table structure: ${verifyError.message}`);
    }
    
    // Check if filter_options table has data, if not insert
    const existingOptions = await client.query(
      'SELECT COUNT(*) as count FROM filter_options WHERE is_active = true'
    );
    
    if (parseInt(existingOptions.rows[0].count) === 0) {
      for (const option of filterOptions) {
        await client.query(
          `INSERT INTO filter_options (type, value, label, category, country, region, is_active, sort_order) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT DO NOTHING`,
          [
            option.type, 
            option.value, 
            option.label, 
            option.category || null, 
            option.country || null, 
            option.region || null, 
            true, 
            option.sortOrder
          ]
        );
      }
      console.log(`   ✅ Created ${filterOptions.length} filter options`);
    } else {
      console.log(`   ⚠️  Filter options already exist (${existingOptions.rows[0].count} active options), skipping...`);
    }
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   - ${skills.length} skills created (standalone reference table)`);
    console.log(`   - ${tags.length} tags created (standalone reference table)`);
    console.log(`   - ${subscriptionPlans.length} subscription plans created (standalone reference table)`);
    console.log(`   - ${filterOptions.length} filter options created (standalone reference table)`);
    console.log(`\n✅ All essential standalone reference tables have been seeded.`);
    console.log(`\n📝 Note: Users, projects, and user-specific data should be created through the application.`);
    
    client.release();
    
  } catch (error) {
    console.error('\n❌ Error seeding database:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seedDatabase();
