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

// Master IDs
const PROJECT_OWNER_ID = 2;
const DEVELOPER_IDS = [1, 3];
const ADMIN_ID = 4;
const PROJECT_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

async function seedEmptyTables() {
  try {
    console.log('🌱 Seeding empty tables...\n');
    console.log('📋 Using IDs:');
    console.log(`   Project Owner: ${PROJECT_OWNER_ID}`);
    console.log(`   Developers: ${DEVELOPER_IDS.join(', ')}`);
    console.log(`   Admin: ${ADMIN_ID}`);
    console.log(`   Projects: ${PROJECT_IDS.join(', ')}\n`);
    
    const client = await pool.connect();
    
    // 1. Career Recommendations (for developers)
    console.log('1️⃣ Seeding career_recommendations...');
    for (const devId of DEVELOPER_IDS) {
      await client.query(`
        INSERT INTO career_recommendations (user_id, title, description, match_score, category, skills, growth, salary, icon, type, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT DO NOTHING
      `, [
        devId,
        'Senior Full-Stack Developer',
        'Advance to senior level with expertise in React, Node.js, and cloud technologies',
        92,
        'Career Path',
        JSON.stringify(['React', 'Node.js', 'TypeScript', 'AWS', 'Docker']),
        '+15%',
        '$90k - $130k',
        '💻',
        'career_path',
        true
      ]);
    }
    console.log('   ✅ Created career recommendations');
    
    // 2. Resume Suggestions (for developers)
    console.log('\n2️⃣ Seeding resume_suggestions...');
    for (const devId of DEVELOPER_IDS) {
      await client.query(`
        INSERT INTO resume_suggestions (user_id, text, category, priority, icon, is_applied)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT DO NOTHING
      `, [
        devId,
        'Add more specific metrics to your project descriptions (e.g., "Improved performance by 40%")',
        'Content',
        'high',
        '📝',
        false
      ]);
    }
    console.log('   ✅ Created resume suggestions');
    
    // 3. Skill Gaps (for developers)
    console.log('\n3️⃣ Seeding skill_gaps...');
    for (const devId of DEVELOPER_IDS) {
      await client.query(`
        INSERT INTO skill_gaps (user_id, skill, required_level, current_level, category, gap_level, progress, icon)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT DO NOTHING
      `, [
        devId,
        'Kubernetes',
        'Advanced',
        'Beginner',
        'DevOps',
        'High',
        25,
        '☸️'
      ]);
    }
    console.log('   ✅ Created skill gaps');
    
    // 4. Developer Matches (for project owner)
    console.log('\n4️⃣ Seeding developer_matches...');
    for (const devId of DEVELOPER_IDS) {
      await client.query(`
        INSERT INTO developer_matches (project_owner_id, project_id, developer_id, match_score, skills, experience, availability, rate, location, highlights, is_contacted)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT DO NOTHING
      `, [
        PROJECT_OWNER_ID,
        PROJECT_IDS[0],
        devId,
        88,
        JSON.stringify(['React', 'Node.js', 'TypeScript']),
        '5 years',
        'Available',
        '$75/hour',
        'Remote',
        JSON.stringify(['Perfect skill match', 'Available immediately', 'Strong portfolio']),
        false
      ]);
    }
    console.log('   ✅ Created developer matches');
    
    // 5. Project Optimizations (for project owner)
    console.log('\n5️⃣ Seeding project_optimizations...');
    await client.query(`
      INSERT INTO project_optimizations (project_id, project_owner_id, title, description, impact, category, suggestions, icon, is_applied)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT DO NOTHING
    `, [
      PROJECT_IDS[0],
      PROJECT_OWNER_ID,
      'Improve Project Description',
      'Add more specific requirements and benefits to attract better candidates',
      'high',
      'Content',
      JSON.stringify(['Add detailed technical requirements', 'Include project timeline', 'Mention team size']),
      '✨',
      false
    ]);
    console.log('   ✅ Created project optimizations');
    
    // 6. Skill Trends (for admin)
    console.log('\n6️⃣ Seeding skill_trends...');
    await client.query(`
      INSERT INTO skill_trends (skill, demand, growth, trend, category, projects_count, developers_count, icon, color)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (skill) DO NOTHING
    `, [
      'React',
      95,
      '+12%',
      'up',
      'Frontend',
      45,
      120,
      '⚛️',
      'text-blue-500'
    ]);
    console.log('   ✅ Created skill trends');
    
    // 7. Platform Insights (for admin)
    console.log('\n7️⃣ Seeding platform_insights...');
    await client.query(`
      INSERT INTO platform_insights (title, description, impact, recommendation, category, metrics, icon, is_resolved)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT DO NOTHING
    `, [
      'High Developer Demand',
      'Frontend developers are in high demand with 45 active projects seeking React expertise',
      'high',
      'Consider promoting React training programs to increase developer supply',
      'User Behavior',
      JSON.stringify({ activeProjects: 45, developersAvailable: 120, matchRate: 75 }),
      '📊',
      false
    ]);
    console.log('   ✅ Created platform insights');
    
    // 8. Team Analysis (for project owner)
    console.log('\n8️⃣ Seeding team_analysis...');
    await client.query(`
      INSERT INTO team_analysis (project_owner_id, project_id, skill, current_count, needed_count, gap, priority, category, suggestions, icon)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT DO NOTHING
    `, [
      PROJECT_OWNER_ID,
      PROJECT_IDS[0],
      'Full-Stack Developer',
      1,
      3,
      2,
      'high',
      'Development',
      JSON.stringify(['Hire 2 more full-stack developers with React and Node.js experience', 'Consider remote candidates to expand talent pool']),
      '👥'
    ]);
    console.log('   ✅ Created team analysis');
    
    // 9. Notifications
    console.log('\n9️⃣ Seeding notifications...');
    for (const userId of [PROJECT_OWNER_ID, ...DEVELOPER_IDS, ADMIN_ID]) {
      await client.query(`
        INSERT INTO notifications (user_id, type, title, message, category, priority, read, action, action_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT DO NOTHING
      `, [
        userId,
        'Project Match',
        'New Project Match Found',
        'We found a project that matches your skills and preferences',
        'match',
        'medium',
        false,
        'View Project',
        '/projects/1'
      ]);
    }
    console.log('   ✅ Created notifications');
    
    // 10. Integration Tokens
    console.log('\n🔟 Seeding integration_tokens...');
    for (const devId of DEVELOPER_IDS) {
      await client.query(`
        INSERT INTO integration_tokens (user_id, platform, platform_user_id, platform_username, token_type, is_active)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT DO NOTHING
      `, [
        devId,
        'github',
        `github_user_${devId}`,
        `dev${devId}_github`,
        'Bearer',
        true
      ]);
    }
    console.log('   ✅ Created integration tokens');
    
    // 11. Portfolio Sync Data
    console.log('\n1️⃣1️⃣ Seeding portfolio_sync_data...');
    for (const devId of DEVELOPER_IDS) {
      await client.query(`
        INSERT INTO portfolio_sync_data (user_id, platform, data_type, platform_item_id, title, description, url, metadata)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT DO NOTHING
      `, [
        devId,
        'github',
        'repository',
        `repo_${devId}_1`,
        'E-commerce Platform',
        'Full-stack e-commerce application built with React and Node.js',
        `https://github.com/dev${devId}/ecommerce-platform`,
        JSON.stringify({ language: 'JavaScript', stars: 25, forks: 5 })
      ]);
    }
    console.log('   ✅ Created portfolio sync data');
    
    // 12. Sync History
    console.log('\n1️⃣2️⃣ Seeding sync_history...');
    for (const devId of DEVELOPER_IDS) {
      await client.query(`
        INSERT INTO sync_history (user_id, platform, status, items_synced, items_updated, items_failed, started_at, completed_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW() + INTERVAL '5 minutes')
        ON CONFLICT DO NOTHING
      `, [
        devId,
        'github',
        'success',
        10,
        8,
        0
      ]);
    }
    console.log('   ✅ Created sync history');
    
    // 13. Skill Scores
    console.log('\n1️⃣3️⃣ Seeding skill_scores...');
    for (const devId of DEVELOPER_IDS) {
      await client.query(`
        INSERT INTO skill_scores (user_id, platform, skill_name, score, level, evidence_count)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT DO NOTHING
      `, [
        devId,
        'github',
        'React',
        85,
        'advanced',
        15
      ]);
    }
    console.log('   ✅ Created skill scores');
    
    // 14. Project Analytics
    console.log('\n1️⃣4️⃣ Seeding project_analytics...');
    const analyticsMetrics = [
      { name: 'view', value: 150 },
      { name: 'application', value: 12 },
      { name: 'favorite', value: 8 },
      { name: 'save', value: 5 },
      { name: 'share', value: 3 }
    ];
    for (const metric of analyticsMetrics) {
      await client.query(`
        INSERT INTO project_analytics (project_id, metric_name, metric_value, metric_date, created_at)
        VALUES ($1, $2, $3, CURRENT_DATE, NOW())
        ON CONFLICT DO NOTHING
      `, [
        PROJECT_IDS[0],
        metric.name,
        metric.value.toString()
      ]);
    }
    console.log('   ✅ Created project analytics');
    
    // 15. Project Boosts
    console.log('\n1️⃣5️⃣ Seeding project_boosts...');
    await client.query(`
      INSERT INTO project_boosts (project_id, purchased_by, plan, amount_cents, currency, start_at, end_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW() + INTERVAL '7 days')
      ON CONFLICT DO NOTHING
    `, [
      PROJECT_IDS[0],
      PROJECT_OWNER_ID,
      'premium',
      5000,
      'USD'
    ]);
    console.log('   ✅ Created project boosts');
    
    // 16. Project Collaborators
    console.log('\n1️⃣6️⃣ Seeding project_collaborators...');
    await client.query(`
      INSERT INTO project_collaborators (project_id, user_id, role, permissions, invited_by, invited_at, accepted_at, status)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW(), $6)
      ON CONFLICT DO NOTHING
    `, [
      PROJECT_IDS[0],
      DEVELOPER_IDS[0],
      'developer',
      ['read', 'write'],
      PROJECT_OWNER_ID,
      'accepted'
    ]);
    console.log('   ✅ Created project collaborators');
    
    // 17. Project Comments
    console.log('\n1️⃣7️⃣ Seeding project_comments...');
    await client.query(`
      INSERT INTO project_comments (project_id, user_id, content, created_at)
      VALUES ($1, $2, $3, NOW())
      ON CONFLICT DO NOTHING
    `, [
      PROJECT_IDS[0],
      DEVELOPER_IDS[0],
      'This project looks interesting! I have experience with React and Node.js.'
    ]);
    console.log('   ✅ Created project comments');
    
    // 18. Project Favorites
    console.log('\n1️⃣8️⃣ Seeding project_favorites...');
    await client.query(`
      INSERT INTO project_favorites (user_id, project_id, created_at, is_deleted)
      VALUES ($1, $2, NOW(), false)
      ON CONFLICT (user_id, project_id) DO UPDATE SET is_deleted = false
    `, [
      DEVELOPER_IDS[0],
      PROJECT_IDS[0]
    ]);
    console.log('   ✅ Created project favorites');
    
    // 19. Project Files
    console.log('\n1️⃣9️⃣ Seeding project_files...');
    await client.query(`
      INSERT INTO project_files (project_id, uploader_id, name, url, mime_type, size_kb, description, category, uploaded_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      ON CONFLICT DO NOTHING
    `, [
      PROJECT_IDS[0],
      PROJECT_OWNER_ID,
      'Project Requirements.pdf',
      'https://storage.example.com/files/requirements.pdf',
      'application/pdf',
      250,
      'Detailed project requirements document',
      'document'
    ]);
    console.log('   ✅ Created project files');
    
    // 20. Project Invites
    console.log('\n2️⃣0️⃣ Seeding project_invites...');
    // Get developer email for invite
    const devEmailResult = await client.query('SELECT email FROM users WHERE id = $1', [DEVELOPER_IDS[0]]);
    const devEmail = devEmailResult.rows[0]?.email || `dev${DEVELOPER_IDS[0]}@example.com`;
    
    await client.query(`
      INSERT INTO project_invites (project_id, invited_email, invited_user_id, role, message, status, sent_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      ON CONFLICT DO NOTHING
    `, [
      PROJECT_IDS[0],
      devEmail,
      DEVELOPER_IDS[0],
      'developer',
      'We would like to invite you to join our project team!',
      'pending'
    ]);
    console.log('   ✅ Created project invites');
    
    // 21. Project Milestones
    console.log('\n2️⃣1️⃣ Seeding project_milestones...');
    await client.query(`
      INSERT INTO project_milestones (project_id, title, description, due_date, is_completed, created_at)
      VALUES ($1, $2, $3, NOW() + INTERVAL '30 days', $4, NOW())
      ON CONFLICT DO NOTHING
    `, [
      PROJECT_IDS[0],
      'Phase 1: Setup & Authentication',
      'Complete project setup, database configuration, and user authentication system',
      false
    ]);
    console.log('   ✅ Created project milestones');
    
    // 22. Project Notifications
    console.log('\n2️⃣2️⃣ Seeding project_notifications...');
    await client.query(`
      INSERT INTO project_notifications (project_id, user_id, type, title, message, is_read, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      ON CONFLICT DO NOTHING
    `, [
      PROJECT_IDS[0],
      PROJECT_OWNER_ID,
      'application',
      'New Application Received',
      'New application received for your project',
      false
    ]);
    console.log('   ✅ Created project notifications');
    
    // 23. Project Reviews
    console.log('\n2️⃣3️⃣ Seeding project_reviews...');
    await client.query(`
      INSERT INTO project_reviews (project_id, reviewer_id, rating, comment, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      ON CONFLICT DO NOTHING
    `, [
      PROJECT_IDS[0],
      DEVELOPER_IDS[0],
      5,
      'Great project with clear requirements and good communication!'
    ]);
    console.log('   ✅ Created project reviews');
    
    // 24. Project Saves
    console.log('\n2️⃣4️⃣ Seeding project_saves...');
    await client.query(`
      INSERT INTO project_saves (user_id, project_id, created_at, is_deleted)
      VALUES ($1, $2, NOW(), false)
      ON CONFLICT (user_id, project_id) DO UPDATE SET is_deleted = false
    `, [
      DEVELOPER_IDS[0],
      PROJECT_IDS[0]
    ]);
    console.log('   ✅ Created project saves');
    
    // 25. Project Tasks
    console.log('\n2️⃣5️⃣ Seeding project_tasks...');
    await client.query(`
      INSERT INTO project_tasks (project_id, assigned_to, title, description, priority, status, due_date, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW() + INTERVAL '7 days', NOW())
      ON CONFLICT DO NOTHING
    `, [
      PROJECT_IDS[0],
      DEVELOPER_IDS[0],
      'Setup Authentication System',
      'Implement JWT-based authentication with login and registration',
      'high',
      'in_progress'
    ]);
    console.log('   ✅ Created project tasks');
    
    // 26. Project Team
    console.log('\n2️⃣6️⃣ Seeding project_team...');
    await client.query(`
      INSERT INTO project_team (project_id, user_id, role, joined_at)
      VALUES ($1, $2, $3, NOW())
      ON CONFLICT DO NOTHING
    `, [
      PROJECT_IDS[0],
      DEVELOPER_IDS[0],
      'developer'
    ]);
    console.log('   ✅ Created project team');
    
    // 27. Project Updates
    console.log('\n2️⃣7️⃣ Seeding project_updates...');
    await client.query(`
      INSERT INTO project_updates (project_id, author_id, type, message, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      ON CONFLICT DO NOTHING
    `, [
      PROJECT_IDS[0],
      PROJECT_OWNER_ID,
      'note',
      'Project Kickoff: We are excited to announce the start of this project. Looking forward to working with the team!'
    ]);
    console.log('   ✅ Created project updates');
    
    // 28. Task Comments
    console.log('\n2️⃣8️⃣ Seeding task_comments...');
    const taskResult = await client.query('SELECT id FROM project_tasks LIMIT 1');
    if (taskResult.rows.length > 0) {
      await client.query(`
        INSERT INTO task_comments (task_id, user_id, comment, created_at)
        VALUES ($1, $2, $3, NOW())
        ON CONFLICT DO NOTHING
      `, [
        taskResult.rows[0].id,
        DEVELOPER_IDS[0],
        'Working on this task. Will complete by end of week.'
      ]);
      console.log('   ✅ Created task comments');
    } else {
      console.log('   ⚠️  Skipped (no tasks found)');
    }
    
    // 29. Task Submissions
    console.log('\n2️⃣9️⃣ Seeding task_submissions...');
    if (taskResult.rows.length > 0) {
      await client.query(`
        INSERT INTO task_submissions (task_id, submitted_by, type, link, files, notes, status, submitted_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        ON CONFLICT DO NOTHING
      `, [
        taskResult.rows[0].id,
        DEVELOPER_IDS[0],
        'pull-request',
        'https://github.com/project/repo/pull/1',
        JSON.stringify([{ name: 'auth.js', url: 'https://github.com/project/repo/blob/main/auth.js', size: 1024 }]),
        'Completed authentication setup with JWT',
        'pending'
      ]);
      console.log('   ✅ Created task submissions');
    } else {
      console.log('   ⚠️  Skipped (no tasks found)');
    }
    
    // 30. Task Time Tracking
    console.log('\n3️⃣0️⃣ Seeding task_time_tracking...');
    if (taskResult.rows.length > 0) {
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + 4.5 * 60 * 60 * 1000); // 4.5 hours later
      const duration = endTime.getTime() - startTime.getTime();
      
      await client.query(`
        INSERT INTO task_time_tracking (task_id, user_id, start_time, end_time, duration, description, is_active, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        ON CONFLICT DO NOTHING
      `, [
        taskResult.rows[0].id,
        DEVELOPER_IDS[0],
        startTime,
        endTime,
        duration,
        'Worked on authentication implementation',
        false
      ]);
      console.log('   ✅ Created task time tracking');
    } else {
      console.log('   ⚠️  Skipped (no tasks found)');
    }
    
    // 31. User Notification Frequency
    console.log('\n3️⃣1️⃣ Seeding user_notification_frequency...');
    for (const userId of [PROJECT_OWNER_ID, ...DEVELOPER_IDS, ADMIN_ID]) {
      await client.query(`
        INSERT INTO user_notification_frequency (user_id, email_frequency, push_frequency, reminders_frequency)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT DO NOTHING
      `, [
        userId,
        'daily',
        'immediate',
        'weekly'
      ]);
    }
    console.log('   ✅ Created user notification frequency');
    
    // 32. User Quiet Hours
    console.log('\n3️⃣2️⃣ Seeding user_quiet_hours...');
    for (const userId of [PROJECT_OWNER_ID, ...DEVELOPER_IDS, ADMIN_ID]) {
      await client.query(`
        INSERT INTO user_quiet_hours (user_id, start, "end", enabled)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT DO NOTHING
      `, [
        userId,
        '22:00:00',
        '08:00:00',
        true
      ]);
    }
    console.log('   ✅ Created user quiet hours');
    
    // 33. User Subscriptions
    console.log('\n3️⃣3️⃣ Seeding user_subscriptions...');
    for (const userId of [PROJECT_OWNER_ID, ...DEVELOPER_IDS, ADMIN_ID]) {
      await client.query(`
        INSERT INTO user_subscriptions (user_id, plan, status, current_period_start, current_period_end)
        VALUES ($1, $2, $3, NOW(), NOW() + INTERVAL '30 days')
        ON CONFLICT DO NOTHING
      `, [
        userId,
        'Free',
        'active'
      ]);
    }
    console.log('   ✅ Created user subscriptions');
    
    console.log('\n🎉 All empty tables seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   ✅ Seeded 33 empty tables`);
    console.log(`   ✅ Used correct IDs (Project Owner: ${PROJECT_OWNER_ID}, Developers: ${DEVELOPER_IDS.join(', ')}, Admin: ${ADMIN_ID})`);
    console.log(`   ✅ Referenced projects 1-10`);
    
    client.release();
    
  } catch (error) {
    console.error('\n❌ Error seeding tables:', error.message);
    console.error(error.stack);
    throw error;
  } finally {
    await pool.end();
  }
}

seedEmptyTables().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

