const { db } = require("../config/database");
const {
  userNotificationSettingsTable,
  userNotificationFrequencyTable,
  userQuietHoursTable,
  userPrivacySettingsTable,
  userIntegrationsTable,
  userSubscriptionsTable,
} = require("../models");

// Sample data for seeding
const sampleUsers = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" },
  { id: 3, name: "Mike Johnson", email: "mike@example.com" },
  { id: 4, name: "Sarah Wilson", email: "sarah@example.com" },
  { id: 5, name: "David Brown", email: "david@example.com" },
];

const notificationSettingsData = [
  {
    userId: 1,
    email: true,
    sms: false,
    push: true,
    reminders: true,
    projectUpdates: true,
    xpNotifications: true,
    aiSuggestions: true,
    profileReminders: false,
    securityAlerts: true,
    soundEnabled: true,
  },
  {
    userId: 2,
    email: true,
    sms: true,
    push: false,
    reminders: true,
    projectUpdates: false,
    xpNotifications: true,
    aiSuggestions: false,
    profileReminders: true,
    securityAlerts: true,
    soundEnabled: false,
  },
  {
    userId: 3,
    email: false,
    sms: false,
    push: true,
    reminders: false,
    projectUpdates: true,
    xpNotifications: false,
    aiSuggestions: true,
    profileReminders: false,
    securityAlerts: true,
    soundEnabled: true,
  },
  {
    userId: 4,
    email: true,
    sms: false,
    push: true,
    reminders: true,
    projectUpdates: true,
    xpNotifications: true,
    aiSuggestions: true,
    profileReminders: true,
    securityAlerts: true,
    soundEnabled: true,
  },
  {
    userId: 5,
    email: true,
    sms: true,
    push: true,
    reminders: false,
    projectUpdates: true,
    xpNotifications: true,
    aiSuggestions: false,
    profileReminders: false,
    securityAlerts: false,
    soundEnabled: true,
  },
];

const notificationFrequencyData = [
  { userId: 1, email: "daily", push: "immediate", reminders: "weekly" },
  { userId: 2, email: "immediate", push: "batched", reminders: "daily" },
  { userId: 3, email: "weekly", push: "immediate", reminders: "monthly" },
  { userId: 4, email: "daily", push: "immediate", reminders: "weekly" },
  { userId: 5, email: "immediate", push: "hourly", reminders: "daily" },
];

const quietHoursData = [
  { userId: 1, enabled: false, start: "22:00", end: "08:00" },
  { userId: 2, enabled: true, start: "23:00", end: "07:00" },
  { userId: 3, enabled: false, start: "22:00", end: "08:00" },
  { userId: 4, enabled: true, start: "21:00", end: "09:00" },
  { userId: 5, enabled: true, start: "00:00", end: "06:00" },
];

const privacySettingsData = [
  {
    userId: 1,
    profilePublic: true,
    dataSharing: false,
    showEmail: false,
    showPhone: false,
    allowMessages: true,
    showOnlineStatus: true,
    allowProjectInvites: true,
    allowJobOffers: true,
    searchVisibility: true,
    personalizedAds: false,
  },
  {
    userId: 2,
    profilePublic: false,
    dataSharing: true,
    showEmail: true,
    showPhone: false,
    allowMessages: false,
    showOnlineStatus: false,
    allowProjectInvites: false,
    allowJobOffers: true,
    searchVisibility: false,
    personalizedAds: true,
  },
  {
    userId: 3,
    profilePublic: true,
    dataSharing: false,
    showEmail: false,
    showPhone: true,
    allowMessages: true,
    showOnlineStatus: true,
    allowProjectInvites: true,
    allowJobOffers: false,
    searchVisibility: true,
    personalizedAds: false,
  },
  {
    userId: 4,
    profilePublic: true,
    dataSharing: true,
    showEmail: true,
    showPhone: true,
    allowMessages: true,
    showOnlineStatus: true,
    allowProjectInvites: true,
    allowJobOffers: true,
    searchVisibility: true,
    personalizedAds: true,
  },
  {
    userId: 5,
    profilePublic: false,
    dataSharing: false,
    showEmail: false,
    showPhone: false,
    allowMessages: false,
    showOnlineStatus: false,
    allowProjectInvites: false,
    allowJobOffers: false,
    searchVisibility: false,
    personalizedAds: false,
  },
];

const integrationsData = [
  {
    userId: 1,
    github: true,
    linkedin: true,
    googleCalendar: false,
    slack: false,
    discord: true,
    trello: false,
    asana: false,
    githubConnectedAt: new Date("2024-01-15T10:30:00Z"),
    linkedinConnectedAt: new Date("2024-01-20T14:15:00Z"),
    googleCalendarConnectedAt: null,
    slackConnectedAt: null,
    discordConnectedAt: new Date("2024-02-01T09:45:00Z"),
    trelloConnectedAt: null,
    asanaConnectedAt: null,
  },
  {
    userId: 2,
    github: false,
    linkedin: true,
    googleCalendar: true,
    slack: true,
    discord: false,
    trello: true,
    asana: false,
    githubConnectedAt: null,
    linkedinConnectedAt: new Date("2024-01-10T16:20:00Z"),
    googleCalendarConnectedAt: new Date("2024-01-25T11:30:00Z"),
    slackConnectedAt: new Date("2024-02-05T13:15:00Z"),
    discordConnectedAt: null,
    trelloConnectedAt: new Date("2024-02-10T08:45:00Z"),
    asanaConnectedAt: null,
  },
  {
    userId: 3,
    github: true,
    linkedin: false,
    googleCalendar: true,
    slack: false,
    discord: false,
    trello: false,
    asana: true,
    githubConnectedAt: new Date("2024-01-05T12:00:00Z"),
    linkedinConnectedAt: null,
    googleCalendarConnectedAt: new Date("2024-01-12T15:30:00Z"),
    slackConnectedAt: null,
    discordConnectedAt: null,
    trelloConnectedAt: null,
    asanaConnectedAt: new Date("2024-02-15T10:20:00Z"),
  },
  {
    userId: 4,
    github: true,
    linkedin: true,
    googleCalendar: true,
    slack: true,
    discord: true,
    trello: true,
    asana: true,
    githubConnectedAt: new Date("2024-01-01T09:00:00Z"),
    linkedinConnectedAt: new Date("2024-01-02T10:00:00Z"),
    googleCalendarConnectedAt: new Date("2024-01-03T11:00:00Z"),
    slackConnectedAt: new Date("2024-01-04T12:00:00Z"),
    discordConnectedAt: new Date("2024-01-05T13:00:00Z"),
    trelloConnectedAt: new Date("2024-01-06T14:00:00Z"),
    asanaConnectedAt: new Date("2024-01-07T15:00:00Z"),
  },
  {
    userId: 5,
    github: false,
    linkedin: false,
    googleCalendar: false,
    slack: false,
    discord: false,
    trello: false,
    asana: false,
    githubConnectedAt: null,
    linkedinConnectedAt: null,
    googleCalendarConnectedAt: null,
    slackConnectedAt: null,
    discordConnectedAt: null,
    trelloConnectedAt: null,
    asanaConnectedAt: null,
  },
];

const subscriptionsData = [
  {
    userId: 1,
    plan: "free",
    status: "active",
    billingCycle: "monthly",
    nextBillingDate: null,
    features: {
      maxProjects: 3,
      maxTeamMembers: 2,
      prioritySupport: false,
      advancedAnalytics: false,
      customBranding: false,
    },
    currentPeriodStart: null,
    currentPeriodEnd: null,
  },
  {
    userId: 2,
    plan: "pro",
    status: "active",
    billingCycle: "monthly",
    nextBillingDate: new Date("2024-03-15T00:00:00Z"),
    features: {
      maxProjects: 10,
      maxTeamMembers: 5,
      prioritySupport: true,
      advancedAnalytics: true,
      customBranding: false,
    },
    currentPeriodStart: new Date("2024-02-15T00:00:00Z"),
    currentPeriodEnd: new Date("2024-03-15T00:00:00Z"),
  },
  {
    userId: 3,
    plan: "enterprise",
    status: "active",
    billingCycle: "yearly",
    nextBillingDate: new Date("2025-01-01T00:00:00Z"),
    features: {
      maxProjects: -1, // unlimited
      maxTeamMembers: -1, // unlimited
      prioritySupport: true,
      advancedAnalytics: true,
      customBranding: true,
    },
    currentPeriodStart: new Date("2024-01-01T00:00:00Z"),
    currentPeriodEnd: new Date("2025-01-01T00:00:00Z"),
  },
  {
    userId: 4,
    plan: "pro",
    status: "cancelled",
    billingCycle: "monthly",
    nextBillingDate: null,
    features: {
      maxProjects: 10,
      maxTeamMembers: 5,
      prioritySupport: true,
      advancedAnalytics: true,
      customBranding: false,
    },
    currentPeriodStart: new Date("2024-01-01T00:00:00Z"),
    currentPeriodEnd: new Date("2024-02-01T00:00:00Z"),
  },
  {
    userId: 5,
    plan: "free",
    status: "active",
    billingCycle: "monthly",
    nextBillingDate: null,
    features: {
      maxProjects: 3,
      maxTeamMembers: 2,
      prioritySupport: false,
      advancedAnalytics: false,
      customBranding: false,
    },
    currentPeriodStart: null,
    currentPeriodEnd: null,
  },
];

// Seed functions
async function seedNotificationSettings() {
  console.log("🌱 Seeding notification settings...");
  try {
    for (const data of notificationSettingsData) {
      await db.insert(userNotificationSettingsTable).values(data).onConflictDoNothing();
    }
    console.log("✅ Notification settings seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding notification settings:", error);
    throw error;
  }
}

async function seedNotificationFrequency() {
  console.log("🌱 Seeding notification frequency...");
  try {
    for (const data of notificationFrequencyData) {
      await db.insert(userNotificationFrequencyTable).values(data).onConflictDoNothing();
    }
    console.log("✅ Notification frequency seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding notification frequency:", error);
    throw error;
  }
}

async function seedQuietHours() {
  console.log("🌱 Seeding quiet hours...");
  try {
    for (const data of quietHoursData) {
      await db.insert(userQuietHoursTable).values(data).onConflictDoNothing();
    }
    console.log("✅ Quiet hours seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding quiet hours:", error);
    throw error;
  }
}

async function seedPrivacySettings() {
  console.log("🌱 Seeding privacy settings...");
  try {
    for (const data of privacySettingsData) {
      await db.insert(userPrivacySettingsTable).values(data).onConflictDoNothing();
    }
    console.log("✅ Privacy settings seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding privacy settings:", error);
    throw error;
  }
}

async function seedIntegrations() {
  console.log("🌱 Seeding integrations...");
  try {
    for (const data of integrationsData) {
      await db.insert(userIntegrationsTable).values(data).onConflictDoNothing();
    }
    console.log("✅ Integrations seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding integrations:", error);
    throw error;
  }
}

async function seedSubscriptions() {
  console.log("🌱 Seeding subscriptions...");
  try {
    for (const data of subscriptionsData) {
      await db.insert(userSubscriptionsTable).values(data).onConflictDoNothing();
    }
    console.log("✅ Subscriptions seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding subscriptions:", error);
    throw error;
  }
}

// Main seed function
async function seedAll() {
  console.log("🚀 Starting settings service database seeding...");
  console.log("=" .repeat(50));
  
  try {
    await seedNotificationSettings();
    await seedNotificationFrequency();
    await seedQuietHours();
    await seedPrivacySettings();
    await seedIntegrations();
    await seedSubscriptions();
    
    console.log("=" .repeat(50));
    console.log("🎉 All settings data seeded successfully!");
    console.log(`📊 Seeded data for ${sampleUsers.length} users`);
    console.log("=" .repeat(50));
  } catch (error) {
    console.error("💥 Seeding failed:", error);
    process.exit(1);
  }
}

// Clear all data function
async function clearAll() {
  console.log("🧹 Clearing all settings data...");
  try {
    await db.delete(userSubscriptionsTable);
    await db.delete(userIntegrationsTable);
    await db.delete(userPrivacySettingsTable);
    await db.delete(userQuietHoursTable);
    await db.delete(userNotificationFrequencyTable);
    await db.delete(userNotificationSettingsTable);
    console.log("✅ All settings data cleared successfully");
  } catch (error) {
    console.error("❌ Error clearing data:", error);
    throw error;
  }
}

// Reset function (clear + seed)
async function reset() {
  console.log("🔄 Resetting settings database...");
  await clearAll();
  await seedAll();
}

// Export functions for use in package.json scripts
module.exports = {
  seedAll,
  clearAll,
  reset,
  seedNotificationSettings,
  seedNotificationFrequency,
  seedQuietHours,
  seedPrivacySettings,
  seedIntegrations,
  seedSubscriptions,
};

// Run seed if called directly
if (require.main === module) {
  const command = process.argv[2];
  
  switch (command) {
    case "seed":
      seedAll();
      break;
    case "clear":
      clearAll();
      break;
    case "reset":
      reset();
      break;
    default:
      console.log("Usage: node seed.js [seed|clear|reset]");
      console.log("  seed  - Seed the database with sample data");
      console.log("  clear - Clear all settings data");
      console.log("  reset - Clear and reseed the database");
      process.exit(1);
  }
}
