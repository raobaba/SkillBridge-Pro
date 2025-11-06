/**
 * Seed script for notifications table
 * This script adds sample notifications for existing developers and project owners
 * 
 * Run with: node src/db/seed-notifications.js
 */

require("dotenv").config();
const { db } = require("../config/database");
const { notificationsTable } = require("../models/notifications.model");
const { userTable } = require("../models/user.model");
const { eq, and, isNull } = require("drizzle-orm");

async function seedNotifications() {
  try {
    console.log("🌱 Starting notification seeding...\n");

    // First, check if users table exists and has any users
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

    // Get all developers and project owners (excluding deleted users)
    const developers = allUsers.filter(user => user.role === "developer");
    const projectOwners = allUsers.filter(user => user.role === "project-owner");

    console.log(`   - Developers: ${developers.length}`);
    console.log(`   - Project Owners: ${projectOwners.length}\n`);

    if (developers.length === 0 && projectOwners.length === 0) {
      console.log("⚠️  No developers or project owners found. Only found users with other roles.");
      console.log("💡 The script will create notifications only for users with 'developer' or 'project-owner' roles.\n");
      process.exit(0);
    }

    const notifications = [];

    // Create notifications for developers
    developers.forEach((developer, index) => {
      // Notification 1: Project Match
      notifications.push({
        userId: developer.id,
        type: "Project Match",
        title: "New Project Match Found",
        message: `We found a project that matches your skills! Check out the opportunities in your dashboard.`,
        category: "project",
        priority: "high",
        read: index % 2 === 0 ? false : true, // Alternate read/unread
        action: "View Projects",
        actionUrl: "/project?tab=discover",
      });

      // Notification 2: Application Update
      notifications.push({
        userId: developer.id,
        type: "Application Update",
        title: "Application Status Updated",
        message: `Your application has been reviewed. The project owner is interested in your profile.`,
        category: "application",
        priority: "medium",
        read: false,
        action: "View Application",
        actionUrl: "/project?tab=applications",
      });
    });

    // Create notifications for project owners
    projectOwners.forEach((owner, index) => {
      // Notification 1: New Applicant
      notifications.push({
        userId: owner.id,
        type: "New Applicant",
        title: "New Application Received",
        message: `A developer has applied to your project. Review their profile and skills to see if they're a good fit.`,
        category: "application",
        priority: "high",
        read: index % 2 === 0 ? false : true, // Alternate read/unread
        action: "Review Application",
        actionUrl: "/project?tab=applications",
      });

      // Notification 2: Recommended Developer
      notifications.push({
        userId: owner.id,
        type: "Recommended Developer",
        title: "Developer Recommendation",
        message: `We found a developer with excellent skills that match your project requirements. Consider reaching out!`,
        category: "recommendation",
        priority: "medium",
        read: false,
        action: "View Profile",
        actionUrl: "/developers",
      });
    });

    // Insert notifications
    if (notifications.length > 0) {
      console.log(`📝 Inserting ${notifications.length} notifications...\n`);
      
      // Insert in batches to avoid overwhelming the database
      const batchSize = 10;
      for (let i = 0; i < notifications.length; i += batchSize) {
        const batch = notifications.slice(i, i + batchSize);
        await db.insert(notificationsTable).values(batch);
        console.log(`  ✅ Inserted batch ${Math.floor(i / batchSize) + 1} (${batch.length} notifications)`);
      }

      console.log(`\n✅ Successfully seeded ${notifications.length} notifications!`);
      console.log(`   - ${developers.length * 2} notifications for developers`);
      console.log(`   - ${projectOwners.length * 2} notifications for project owners\n`);
    } else {
      console.log("⚠️  No notifications to insert.\n");
    }

    console.log("✅ Seeding completed successfully!\n");
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

