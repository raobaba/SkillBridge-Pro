/**
 * Seed script for notifications table
 * This script adds comprehensive sample notifications for all existing users
 * Creates role-specific notifications for developers, project owners, and admins
 * 
 * Run with: node src/db/seed-notifications.js
 */

require("dotenv").config();
const { db } = require("../config/database");
const { notificationsTable } = require("../models/notifications.model");
const { userTable } = require("../models/user.model");
const { eq } = require("drizzle-orm");

// Helper function to get random date within last 30 days
function getRandomDate(daysAgo = 30) {
  const now = new Date();
  const randomDays = Math.floor(Math.random() * daysAgo);
  const randomHours = Math.floor(Math.random() * 24);
  const randomMinutes = Math.floor(Math.random() * 60);
  const date = new Date(now);
  date.setDate(date.getDate() - randomDays);
  date.setHours(randomHours);
  date.setMinutes(randomMinutes);
  return date;
}

async function seedNotifications() {
  try {
    console.log("🌱 Starting notification seeding...\n");

    // Fetch all active users
    const allUsers = await db
      .select()
      .from(userTable)
      .where(eq(userTable.isDeleted, false));

    console.log(`📊 Total active users found: ${allUsers.length}\n`);

    if (allUsers.length === 0) {
      console.log("⚠️  No active users found. Please create users first.");
      console.log("💡 Tip: Create users through the registration API or directly in the database.\n");
      process.exit(0);
    }

    // Group users by role
    const developers = allUsers.filter(user => user.role === "developer");
    const projectOwners = allUsers.filter(user => user.role === "project-owner");
    const admins = allUsers.filter(user => user.role === "admin");

    console.log(`   👨‍💻 Developers: ${developers.length}`);
    console.log(`   🏢 Project Owners: ${projectOwners.length}`);
    console.log(`   🔐 Admins: ${admins.length}\n`);

    const notifications = [];

    // ============================================
    // NOTIFICATIONS FOR DEVELOPERS
    // ============================================
    developers.forEach((developer, index) => {
      // 1. Project Match (High Priority)
      notifications.push({
        userId: developer.id,
        type: "Project Match",
        title: "🎯 New Project Match Found!",
        message: `We found a project that matches your skills in ${developer.domainPreferences || "your preferred domain"}! Check it out now.`,
        category: "project",
        priority: "high",
        read: index % 3 === 0 ? false : true,
        action: "View Project",
        actionUrl: "/project?tab=discover",
        relatedEntityId: Math.floor(Math.random() * 100) + 1,
        relatedEntityType: "project",
        metadata: JSON.stringify({ projectId: Math.floor(Math.random() * 100) + 1, matchScore: 85 }),
        createdAt: getRandomDate(5),
      });

      // 2. Application Update (Medium Priority)
      notifications.push({
        userId: developer.id,
        type: "Application Update",
        title: "📋 Application Status Updated",
        message: `Your application for "Full-Stack E-commerce Platform" has been reviewed. The project owner is interested in your profile!`,
        category: "application",
        priority: "medium",
        read: index % 2 === 0 ? false : true,
        action: "View Application",
        actionUrl: "/project?tab=applications",
        relatedEntityId: Math.floor(Math.random() * 50) + 1,
        relatedEntityType: "application",
        metadata: JSON.stringify({ applicationId: Math.floor(Math.random() * 50) + 1, status: "reviewed" }),
        createdAt: getRandomDate(3),
      });

      // 3. Invitation (High Priority)
      notifications.push({
        userId: developer.id,
        type: "Invitation",
        title: "✨ You've Been Invited!",
        message: `A project owner has invited you to join their team for "React Native Mobile App Development". Check out the invitation!`,
        category: "invitation",
        priority: "high",
        read: false,
        action: "View Invitation",
        actionUrl: "/project?tab=invitations",
        relatedEntityId: Math.floor(Math.random() * 30) + 1,
        relatedEntityType: "invitation",
        createdAt: getRandomDate(2),
      });

      // 4. Career Opportunity (Medium Priority)
      notifications.push({
        userId: developer.id,
        type: "Career Opportunity",
        title: "🚀 New Career Opportunity",
        message: `Based on your profile, we found a long-term contract opportunity that matches your experience level.`,
        category: "career",
        priority: "medium",
        read: index % 4 === 0 ? false : true,
        action: "Explore Opportunity",
        actionUrl: "/career",
        createdAt: getRandomDate(7),
      });

      // 5. Task Deadline (High Priority)
      if (index % 2 === 0) {
        notifications.push({
          userId: developer.id,
          type: "Task Deadline",
          title: "⏰ Deadline Approaching",
          message: `Your task "Implement User Authentication" is due in 2 days. Make sure to complete it on time!`,
          category: "deadline",
          priority: "high",
          read: false,
          action: "View Task",
          actionUrl: "/project/tasks",
          relatedEntityId: Math.floor(Math.random() * 20) + 1,
          relatedEntityType: "task",
          metadata: JSON.stringify({ taskId: Math.floor(Math.random() * 20) + 1, daysRemaining: 2 }),
          createdAt: getRandomDate(1),
        });
      }

      // 6. Chat Message (Low Priority)
      notifications.push({
        userId: developer.id,
        type: "Chat Message",
        title: "💬 New Message",
        message: `You have 3 new messages from project owners. Check your inbox to stay connected!`,
        category: "chat",
        priority: "low",
        read: index % 3 === 0 ? false : true,
        action: "View Messages",
        actionUrl: "/chat",
        createdAt: getRandomDate(1),
      });

      // 7. Endorsement (Medium Priority)
      if (index % 3 === 0) {
        notifications.push({
          userId: developer.id,
          type: "Endorsement",
          title: "⭐ You Received an Endorsement!",
          message: `A project owner has endorsed your skills in React and Node.js. This boosts your profile visibility!`,
          category: "endorsement",
          priority: "medium",
          read: false,
          action: "View Profile",
          actionUrl: "/profile",
          createdAt: getRandomDate(10),
        });
      }

      // 8. Review (Low Priority)
      if (index % 4 === 0) {
        notifications.push({
          userId: developer.id,
          type: "Review",
          title: "📝 New Review Received",
          message: `You received a 5-star review from a project owner. Great work!`,
          category: "review",
          priority: "low",
          read: true,
          action: "View Review",
          actionUrl: "/profile?tab=reviews",
          relatedEntityId: Math.floor(Math.random() * 15) + 1,
          relatedEntityType: "review",
          createdAt: getRandomDate(15),
        });
      }
    });

    // ============================================
    // NOTIFICATIONS FOR PROJECT OWNERS
    // ============================================
    projectOwners.forEach((owner, index) => {
      // 1. New Applicant (High Priority)
      notifications.push({
        userId: owner.id,
        type: "New Applicant",
        title: "👤 New Application Received",
        message: `A developer has applied to your project "${owner.company || 'Your Project'}". Review their profile and skills!`,
        category: "application",
        priority: "high",
        read: index % 3 === 0 ? false : true,
        action: "Review Application",
        actionUrl: "/project?tab=applications",
        relatedEntityId: Math.floor(Math.random() * 50) + 1,
        relatedEntityType: "application",
        metadata: JSON.stringify({ applicationId: Math.floor(Math.random() * 50) + 1, applicantName: "Developer" }),
        createdAt: getRandomDate(2),
      });

      // 2. Recommended Developer (Medium Priority)
      notifications.push({
        userId: owner.id,
        type: "Recommended Developer",
        title: "🌟 Developer Recommendation",
        message: `We found a developer with excellent skills that match your project requirements. Consider reaching out!`,
        category: "recommendation",
        priority: "medium",
        read: index % 2 === 0 ? false : true,
        action: "View Profile",
        actionUrl: "/developers",
        relatedEntityId: Math.floor(Math.random() * 100) + 1,
        relatedEntityType: "developer",
        metadata: JSON.stringify({ developerId: Math.floor(Math.random() * 100) + 1, matchScore: 92 }),
        createdAt: getRandomDate(5),
      });

      // 3. Project Update (Medium Priority)
      notifications.push({
        userId: owner.id,
        type: "Project Update",
        title: "📊 Project Status Update",
        message: `Your project "E-commerce Platform" has been updated. Check the latest changes and milestones.`,
        category: "project",
        priority: "medium",
        read: false,
        action: "View Project",
        actionUrl: "/project",
        relatedEntityId: Math.floor(Math.random() * 30) + 1,
        relatedEntityType: "project",
        createdAt: getRandomDate(1),
      });

      // 4. Project Milestone (High Priority)
      if (index % 2 === 0) {
        notifications.push({
          userId: owner.id,
          type: "Project Milestone",
          title: "🎉 Milestone Achieved!",
          message: `Congratulations! Your project has reached a major milestone. The development phase is 75% complete.`,
          category: "milestone",
          priority: "high",
          read: false,
          action: "View Progress",
          actionUrl: "/project?tab=milestones",
          relatedEntityId: Math.floor(Math.random() * 20) + 1,
          relatedEntityType: "milestone",
          metadata: JSON.stringify({ milestoneId: Math.floor(Math.random() * 20) + 1, progress: 75 }),
          createdAt: getRandomDate(1),
        });
      }

      // 5. Budget Alert (High Priority)
      if (index % 3 === 0) {
        notifications.push({
          userId: owner.id,
          type: "Budget Alert",
          title: "💰 Budget Alert",
          message: `Your project budget is at 80% utilization. Consider reviewing your spending.`,
          category: "billing",
          priority: "high",
          read: false,
          action: "View Budget",
          actionUrl: "/project?tab=billing",
          relatedEntityId: Math.floor(Math.random() * 10) + 1,
          relatedEntityType: "budget",
          metadata: JSON.stringify({ budgetUsed: 80, budgetTotal: 10000 }),
          createdAt: getRandomDate(1),
        });
      }

      // 6. Team Invitation (Medium Priority)
      notifications.push({
        userId: owner.id,
        type: "Team Invitation",
        title: "👥 Team Collaboration",
        message: `A developer has accepted your team invitation. Your project team is growing!`,
        category: "team",
        priority: "medium",
        read: index % 4 === 0 ? false : true,
        action: "View Team",
        actionUrl: "/project?tab=team",
        createdAt: getRandomDate(3),
      });

      // 7. Billing Reminder (Low Priority)
      if (index % 5 === 0) {
        notifications.push({
          userId: owner.id,
          type: "Billing Reminder",
          title: "💳 Billing Reminder",
          message: `Your subscription will renew in 5 days. Update your payment method if needed.`,
          category: "billing",
          priority: "low",
          read: true,
          action: "Manage Billing",
          actionUrl: "/billing",
          createdAt: getRandomDate(5),
        });
      }
    });

    // ============================================
    // NOTIFICATIONS FOR ADMINS
    // ============================================
    admins.forEach((admin, index) => {
      // 1. Flagged User (High Priority)
      notifications.push({
        userId: admin.id,
        type: "Flagged User",
        title: "🚩 User Flagged for Review",
        message: `A user has been flagged for violating platform guidelines. Please review and take appropriate action.`,
        category: "moderation",
        priority: "high",
        read: index % 2 === 0 ? false : true,
        action: "Review User",
        actionUrl: "/admin/users?filter=flagged",
        relatedEntityId: Math.floor(Math.random() * 50) + 1,
        relatedEntityType: "user",
        metadata: JSON.stringify({ userId: Math.floor(Math.random() * 50) + 1, reason: "Inappropriate content" }),
        createdAt: getRandomDate(1),
      });

      // 2. System Alert (High Priority)
      notifications.push({
        userId: admin.id,
        type: "System Alert",
        title: "⚠️ System Alert",
        message: `High server load detected. Current CPU usage is at 85%. Consider scaling up resources.`,
        category: "system",
        priority: "high",
        read: false,
        action: "View System Health",
        actionUrl: "/admin/system",
        metadata: JSON.stringify({ cpuUsage: 85, memoryUsage: 72 }),
        createdAt: getRandomDate(1),
      });

      // 3. Platform Health (Medium Priority)
      notifications.push({
        userId: admin.id,
        type: "Platform Health",
        title: "📈 Platform Health Report",
        message: `Weekly platform health report is ready. Active users increased by 12% this week.`,
        category: "analytics",
        priority: "medium",
        read: index % 3 === 0 ? false : true,
        action: "View Report",
        actionUrl: "/admin/analytics",
        createdAt: getRandomDate(7),
      });

      // 4. User Verification (Medium Priority)
      notifications.push({
        userId: admin.id,
        type: "User Verification",
        title: "✅ Verification Pending",
        message: `5 new users are pending email verification. All have completed profile setup.`,
        category: "verification",
        priority: "medium",
        read: false,
        action: "View Users",
        actionUrl: "/admin/users?filter=pending",
        createdAt: getRandomDate(2),
      });

      // 5. Dispute Report (High Priority)
      if (index % 2 === 0) {
        notifications.push({
          userId: admin.id,
          type: "Dispute Report",
          title: "⚖️ New Dispute Reported",
          message: `A dispute has been reported between a project owner and developer. Immediate attention required.`,
          category: "dispute",
          priority: "high",
          read: false,
          action: "Review Dispute",
          actionUrl: "/admin/disputes",
          relatedEntityId: Math.floor(Math.random() * 10) + 1,
          relatedEntityType: "dispute",
          metadata: JSON.stringify({ disputeId: Math.floor(Math.random() * 10) + 1, severity: "high" }),
          createdAt: getRandomDate(1),
        });
      }

      // 6. Moderation Task (Medium Priority)
      notifications.push({
        userId: admin.id,
        type: "Moderation Task",
        title: "🔍 Moderation Queue",
        message: `3 projects are waiting for moderation review. Please review them to maintain platform quality.`,
        category: "moderation",
        priority: "medium",
        read: index % 4 === 0 ? false : true,
        action: "Review Queue",
        actionUrl: "/admin/moderation",
        createdAt: getRandomDate(1),
      });

      // 7. Security Alert (High Priority)
      if (index % 3 === 0) {
        notifications.push({
          userId: admin.id,
          type: "Security Alert",
          title: "🔒 Security Alert",
          message: `Unusual login activity detected from multiple IP addresses. Review security logs.`,
          category: "security",
          priority: "high",
          read: false,
          action: "View Security Logs",
          actionUrl: "/admin/security",
          metadata: JSON.stringify({ alertType: "suspicious_login", ipCount: 5 }),
          createdAt: getRandomDate(1),
        });
      }

      // 8. Compliance Alert (Medium Priority)
      if (index % 4 === 0) {
        notifications.push({
          userId: admin.id,
          type: "Compliance Alert",
          title: "📋 Compliance Check",
          message: `Monthly compliance review is due. Ensure all user data handling policies are up to date.`,
          category: "compliance",
          priority: "medium",
          read: true,
          action: "Review Compliance",
          actionUrl: "/admin/compliance",
          createdAt: getRandomDate(30),
        });
      }
    });

    // ============================================
    // INSERT NOTIFICATIONS
    // ============================================
    if (notifications.length > 0) {
      console.log(`📝 Creating ${notifications.length} notifications...\n`);
      
      // Insert in batches to avoid overwhelming the database
      const batchSize = 20;
      let insertedCount = 0;
      
      for (let i = 0; i < notifications.length; i += batchSize) {
        const batch = notifications.slice(i, i + batchSize);
        await db.insert(notificationsTable).values(batch);
        insertedCount += batch.length;
        console.log(`  ✅ Inserted batch ${Math.floor(i / batchSize) + 1} (${batch.length} notifications)`);
      }

      console.log(`\n✅ Successfully seeded ${insertedCount} notifications!`);
      console.log(`   👨‍💻 ${developers.length} developers × ~8 notifications each`);
      console.log(`   🏢 ${projectOwners.length} project owners × ~7 notifications each`);
      console.log(`   🔐 ${admins.length} admins × ~8 notifications each\n`);
      
      // Summary by role
      const devNotifications = notifications.filter(n => developers.some(d => d.id === n.userId)).length;
      const ownerNotifications = notifications.filter(n => projectOwners.some(o => o.id === n.userId)).length;
      const adminNotifications = notifications.filter(n => admins.some(a => a.id === n.userId)).length;
      
      console.log(`📊 Notification Breakdown:`);
      console.log(`   - Developer notifications: ${devNotifications}`);
      console.log(`   - Project Owner notifications: ${ownerNotifications}`);
      console.log(`   - Admin notifications: ${adminNotifications}\n`);

      // Count by read status
      const unreadCount = notifications.filter(n => !n.read).length;
      const readCount = notifications.filter(n => n.read).length;
      console.log(`📬 Read Status:`);
      console.log(`   - Unread: ${unreadCount}`);
      console.log(`   - Read: ${readCount}\n`);
    } else {
      console.log("⚠️  No notifications to insert.\n");
    }

    console.log("✅ Seeding completed successfully!\n");
    console.log("💡 You can now test notification APIs with these sample notifications.\n");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding notifications:", error);
    console.error("Error details:", error.message);
    if (error.stack) {
      console.error("Stack trace:", error.stack);
    }
    process.exit(1);
  }
}

// Run the seed function
seedNotifications().catch(error => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});

