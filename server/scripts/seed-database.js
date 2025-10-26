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
    
    // 1. Create skills data
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
    
    // 2. Create tags data
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
    
    // 3. Create users with multiple roles
    console.log('\n3️⃣ Creating users...');
    const users = [
      {
        name: 'Rajan Kumar',
        email: 'raorajan9576@gmail.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // 123123
        roles: ['developer', 'project-owner', 'admin'],
        bio: 'Full-stack developer with expertise in React, Node.js, and cloud technologies. Also experienced in project management and system administration.',
        location: 'India',
        github_url: 'https://github.com/raorajan',
        linkedin_url: 'https://linkedin.com/in/raorajan',
        portfolio_url: 'https://raorajan.dev'
      }
    ];
    
    const userIds = [];
    for (const user of users) {
      const result = await client.query(
        `INSERT INTO users (name, email, password, roles, bio, location, github_url, linkedin_url, portfolio_url, is_email_verified) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
         ON CONFLICT (email) DO UPDATE SET 
         name = EXCLUDED.name, roles = EXCLUDED.roles, bio = EXCLUDED.bio, location = EXCLUDED.location,
         github_url = EXCLUDED.github_url, linkedin_url = EXCLUDED.linkedin_url, portfolio_url = EXCLUDED.portfolio_url
         RETURNING id`,
        [user.name, user.email, user.password, JSON.stringify(user.roles), user.bio, user.location, user.github_url, user.linkedin_url, user.portfolio_url, true]
      );
      userIds.push(result.rows[0].id);
      console.log(`   ✅ Created user: ${user.name} (${user.email}) with roles: ${user.roles.join(', ')}`);
    }
    
    // 4. Create projects (10 projects)
    console.log('\n4️⃣ Creating projects...');
    const projects = [
      {
        title: 'E-commerce Platform',
        description: 'A modern e-commerce platform built with React, Node.js, and PostgreSQL. Features include user authentication, product catalog, shopping cart, payment integration, and admin dashboard.',
        role_needed: 'Full-stack Developer',
        status: 'active',
        priority: 'high',
        category: 'Web Development',
        experience_level: 'senior',
        budget_min: 5000,
        budget_max: 15000,
        currency: 'USD',
        is_remote: true,
        location: 'Remote',
        duration: '3-6 months',
        requirements: 'React, Node.js, PostgreSQL, Stripe API, AWS',
        benefits: 'Competitive salary, flexible hours, remote work',
        company: 'TechCorp Inc',
        website: 'https://techcorp.com',
        owner_id: userIds[0] // Rao Rajan as project owner
      },
      {
        title: 'Mobile Banking App',
        description: 'Secure mobile banking application for iOS and Android with features like account management, money transfers, bill payments, and transaction history.',
        role_needed: 'Mobile Developer',
        status: 'active',
        priority: 'urgent',
        category: 'Mobile Development',
        experience_level: 'senior',
        budget_min: 8000,
        budget_max: 20000,
        currency: 'USD',
        is_remote: false,
        location: 'New York, NY',
        duration: '6-12 months',
        requirements: 'React Native, Node.js, MongoDB, Security protocols',
        benefits: 'Health insurance, 401k, stock options',
        company: 'FinanceApp Ltd',
        owner_id: userIds[0]
      },
      {
        title: 'AI-Powered Analytics Dashboard',
        description: 'Dashboard for analyzing business data with AI-powered insights, predictive analytics, and real-time reporting capabilities.',
        role_needed: 'Data Scientist',
        status: 'draft',
        priority: 'medium',
        category: 'AI/ML',
        experience_level: 'expert',
        budget_min: 10000,
        budget_max: 25000,
        currency: 'USD',
        is_remote: true,
        location: 'Remote',
        duration: '4-8 months',
        requirements: 'Python, TensorFlow, React, PostgreSQL, AWS',
        benefits: 'Remote work, learning budget, conference attendance',
        company: 'DataInsights Corp',
        owner_id: userIds[0]
      },
      {
        title: 'Social Media Management Tool',
        description: 'Comprehensive tool for managing multiple social media accounts with scheduling, analytics, and content creation features.',
        role_needed: 'Full-stack Developer',
        status: 'active',
        priority: 'medium',
        category: 'Web Development',
        experience_level: 'mid',
        budget_min: 3000,
        budget_max: 8000,
        currency: 'USD',
        is_remote: true,
        location: 'Remote',
        duration: '2-4 months',
        requirements: 'Vue.js, Node.js, MongoDB, Social Media APIs',
        benefits: 'Flexible schedule, remote work',
        company: 'SocialTools Inc',
        owner_id: userIds[0]
      },
      {
        title: 'Blockchain Voting System',
        description: 'Secure and transparent voting system built on blockchain technology with smart contracts and decentralized architecture.',
        role_needed: 'Blockchain Developer',
        status: 'active',
        priority: 'high',
        category: 'Blockchain',
        experience_level: 'senior',
        budget_min: 12000,
        budget_max: 30000,
        currency: 'USD',
        is_remote: true,
        location: 'Remote',
        duration: '6-10 months',
        requirements: 'Solidity, Web3.js, React, Ethereum, Security',
        benefits: 'High compensation, equity, cutting-edge technology',
        company: 'VoteChain Solutions',
        owner_id: userIds[0]
      },
      {
        title: 'IoT Home Automation System',
        description: 'Smart home automation system with IoT devices, mobile app control, and AI-powered energy optimization.',
        role_needed: 'IoT Developer',
        status: 'paused',
        priority: 'low',
        category: 'IoT',
        experience_level: 'senior',
        budget_min: 6000,
        budget_max: 15000,
        currency: 'USD',
        is_remote: false,
        location: 'San Francisco, CA',
        duration: '4-6 months',
        requirements: 'Arduino, Raspberry Pi, React Native, MQTT, AWS IoT',
        benefits: 'Innovation lab access, hardware budget',
        company: 'SmartHome Tech',
        owner_id: userIds[0]
      },
      {
        title: 'Healthcare Management Platform',
        description: 'Comprehensive platform for healthcare providers with patient management, appointment scheduling, and telemedicine features.',
        role_needed: 'Full-stack Developer',
        status: 'active',
        priority: 'high',
        category: 'Healthcare',
        experience_level: 'senior',
        budget_min: 15000,
        budget_max: 35000,
        currency: 'USD',
        is_remote: true,
        location: 'Remote',
        duration: '8-12 months',
        requirements: 'React, Node.js, PostgreSQL, HIPAA compliance, WebRTC',
        benefits: 'Mission-driven work, competitive benefits',
        company: 'HealthTech Solutions',
        owner_id: userIds[0]
      },
      {
        title: 'Gaming Platform Backend',
        description: 'Scalable backend infrastructure for online gaming platform with real-time multiplayer support, matchmaking, and leaderboards.',
        role_needed: 'Backend Developer',
        status: 'active',
        priority: 'medium',
        category: 'Gaming',
        experience_level: 'senior',
        budget_min: 7000,
        budget_max: 18000,
        currency: 'USD',
        is_remote: true,
        location: 'Remote',
        duration: '3-5 months',
        requirements: 'Node.js, Redis, WebSocket, AWS, Game development',
        benefits: 'Gaming industry experience, flexible hours',
        company: 'GameStudio Pro',
        owner_id: userIds[0]
      },
      {
        title: 'EdTech Learning Platform',
        description: 'Interactive learning platform with video streaming, quizzes, progress tracking, and AI-powered personalized learning paths.',
        role_needed: 'Full-stack Developer',
        status: 'draft',
        priority: 'medium',
        category: 'Education',
        experience_level: 'mid',
        budget_min: 5000,
        budget_max: 12000,
        currency: 'USD',
        is_remote: true,
        location: 'Remote',
        duration: '4-6 months',
        requirements: 'React, Node.js, MongoDB, Video streaming, AI/ML',
        benefits: 'Education impact, remote work, learning opportunities',
        company: 'EduTech Innovations',
        owner_id: userIds[0]
      },
      {
        title: 'Fintech Trading Platform',
        description: 'Advanced trading platform with real-time market data, algorithmic trading, portfolio management, and risk analysis tools.',
        role_needed: 'Senior Developer',
        status: 'active',
        priority: 'urgent',
        category: 'Fintech',
        experience_level: 'expert',
        budget_min: 20000,
        budget_max: 50000,
        currency: 'USD',
        is_remote: false,
        location: 'London, UK',
        duration: '6-12 months',
        requirements: 'Python, React, PostgreSQL, Financial APIs, High-frequency trading',
        benefits: 'High compensation, bonus structure, financial industry experience',
        company: 'TradeMaster Capital',
        owner_id: userIds[0]
      }
    ];
    
    const projectIds = [];
    for (const project of projects) {
      const result = await client.query(
        `INSERT INTO projects (owner_id, title, description, role_needed, status, priority, category, experience_level, 
         budget_min, budget_max, currency, is_remote, location, duration, requirements, benefits, company, website) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) 
         RETURNING id`,
        [project.owner_id, project.title, project.description, project.role_needed, project.status, project.priority, 
         project.category, project.experience_level, project.budget_min, project.budget_max, project.currency, 
         project.is_remote, project.location, project.duration, project.requirements, project.benefits, project.company, project.website]
      );
      projectIds.push(result.rows[0].id);
      console.log(`   ✅ Created project: ${project.title}`);
    }
    
    // 5. Create project skills relationships
    console.log('\n5️⃣ Creating project skills...');
    const projectSkills = [
      { project_id: projectIds[0], skills: ['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'AWS', 'Express', 'Docker', 'JavaScript', 'HTML', 'CSS', 'Bootstrap', 'Git', 'CI/CD'] },
      { project_id: projectIds[1], skills: ['React Native', 'Node.js', 'MongoDB', 'JavaScript', 'TypeScript', 'Firebase', 'iOS', 'Android', 'Git', 'Express'] },
      { project_id: projectIds[2], skills: ['Python', 'TensorFlow', 'React', 'PostgreSQL', 'AWS', 'Machine Learning', 'Data Science', 'Docker', 'Jupyter', 'Pandas', 'NumPy', 'Scikit-learn'] },
      { project_id: projectIds[3], skills: ['Vue.js', 'Node.js', 'MongoDB', 'JavaScript', 'Express', 'Git', 'REST API', 'HTML', 'CSS', 'Bootstrap'] },
      { project_id: projectIds[4], skills: ['Solidity', 'Ethereum', 'Web3.js', 'Blockchain', 'JavaScript', 'React', 'Node.js', 'Git', 'Docker', 'Linux'] },
      { project_id: projectIds[5], skills: ['Python', 'JavaScript', 'React', 'PostgreSQL', 'Docker', 'AWS', 'Git', 'HTML', 'CSS', 'Express'] },
      { project_id: projectIds[6], skills: ['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'Express', 'Docker', 'AWS', 'Git', 'HTML', 'CSS', 'Bootstrap'] },
      { project_id: projectIds[7], skills: ['Node.js', 'Redis', 'JavaScript', 'AWS', 'Express', 'Docker', 'Git', 'MongoDB', 'REST API', 'Linux'] },
      { project_id: projectIds[8], skills: ['React', 'Node.js', 'MongoDB', 'JavaScript', 'Express', 'Git', 'HTML', 'CSS', 'Bootstrap', 'REST API'] },
      { project_id: projectIds[9], skills: ['Python', 'React', 'PostgreSQL', 'JavaScript', 'Express', 'Docker', 'AWS', 'Git', 'Machine Learning', 'Data Science'] }
    ];
    
    for (const ps of projectSkills) {
      const skillIds = await client.query(
        'SELECT id FROM skills WHERE name = ANY($1)',
        [ps.skills]
      );
      
      for (const skillId of skillIds.rows) {
        await client.query(
          'INSERT INTO project_skills (project_id, skill_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [ps.project_id, skillId.id]
        );
      }
      console.log(`   ✅ Added skills to project ${ps.project_id}`);
    }
    
    // 6. Create project tags relationships
    console.log('\n6️⃣ Creating project tags...');
    const projectTags = [
      { project_id: projectIds[0], tags: ['E-commerce', 'Full Stack', 'API', 'Database', 'Cloud', 'Frontend', 'Backend', 'Scalable', 'Modern', 'User-friendly'] },
      { project_id: projectIds[1], tags: ['Mobile App', 'Fintech', 'Enterprise', 'Mobile', 'API', 'Database', 'Secure', 'High Performance', 'Real-time'] },
      { project_id: projectIds[2], tags: ['AI', 'Machine Learning', 'SaaS', 'Enterprise', 'Dashboard', 'Cloud', 'High Performance', 'Scalable', 'Modern'] },
      { project_id: projectIds[3], tags: ['Web App', 'Social Media', 'Startup', 'Frontend', 'Backend', 'API', 'Database', 'User-friendly', 'Responsive'] },
      { project_id: projectIds[4], tags: ['Blockchain', 'Open Source', 'Startup', 'Platform', 'Secure', 'Modern', 'High Performance', 'API'] },
      { project_id: projectIds[5], tags: ['IoT', 'Open Source', 'Startup', 'Platform', 'API', 'Database', 'Cloud', 'Real-time', 'Modern'] },
      { project_id: projectIds[6], tags: ['Web App', 'Healthcare', 'Enterprise', 'Full Stack', 'API', 'Database', 'Cloud', 'Secure', 'Scalable'] },
      { project_id: projectIds[7], tags: ['Game', 'Gaming', 'Startup', 'Backend', 'API', 'Database', 'Cloud', 'Real-time', 'High Performance'] },
      { project_id: projectIds[8], tags: ['Web App', 'Education', 'SaaS', 'Full Stack', 'API', 'Database', 'User-friendly', 'Responsive', 'Modern'] },
      { project_id: projectIds[9], tags: ['Web App', 'Fintech', 'Enterprise', 'Full Stack', 'API', 'Database', 'Cloud', 'Secure', 'High Performance'] }
    ];
    
    for (const pt of projectTags) {
      const tagIds = await client.query(
        'SELECT id FROM tags WHERE name = ANY($1)',
        [pt.tags]
      );
      
      for (const tagId of tagIds.rows) {
        await client.query(
          'INSERT INTO project_tags (project_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [pt.project_id, tagId.id]
        );
      }
      console.log(`   ✅ Added tags to project ${pt.project_id}`);
    }
    
    // 7. Create user notification settings
    console.log('\n7️⃣ Creating user notification settings...');
    for (const userId of userIds) {
      await client.query(
        `INSERT INTO user_notification_settings (user_id, email, push, reminders, project_updates, xp_notifications, ai_suggestions, security_alerts) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT DO NOTHING`,
        [userId, true, true, true, true, true, true, true]
      );
    }
    console.log(`   ✅ Created notification settings for ${userIds.length} users`);
    
    // 8. Create user privacy settings
    console.log('\n8️⃣ Creating user privacy settings...');
    for (const userId of userIds) {
      await client.query(
        `INSERT INTO user_privacy_settings (user_id, profile_public, data_sharing, search_visibility, personalized_ads) 
         VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING`,
        [userId, true, false, true, false]
      );
    }
    console.log(`   ✅ Created privacy settings for ${userIds.length} users`);
    
    // 9. Create user integrations
    console.log('\n9️⃣ Creating user integrations...');
    for (const userId of userIds) {
      await client.query(
        `INSERT INTO user_integrations (user_id, github, linkedin, google_calendar) 
         VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`,
        [userId, true, true, true]
      );
    }
    console.log(`   ✅ Created integrations for ${userIds.length} users`);
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   - ${skills.length} skills created`);
    console.log(`   - ${tags.length} tags created`);
    console.log(`   - ${users.length} users created`);
    console.log(`   - ${projects.length} projects created`);
    console.log(`   - Project skills and tags relationships created`);
    console.log(`   - User settings and integrations created`);
    
    client.release();
    
  } catch (error) {
    console.error('\n❌ Error seeding database:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seedDatabase();
