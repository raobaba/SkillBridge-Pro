const { pgTable, serial, integer, boolean, timestamp } = require("drizzle-orm/pg-core");
const { eq } = require("drizzle-orm");
const { db } = require("../config/database");

const userNotificationSettingsTable = pgTable("user_notification_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  email: boolean("email").notNull().default(true),
  sms: boolean("sms").notNull().default(false),
  push: boolean("push").notNull().default(true),
  reminders: boolean("reminders").notNull().default(true),
  projectUpdates: boolean("project_updates").notNull().default(true),
  xpNotifications: boolean("xp_notifications").notNull().default(true),
  aiSuggestions: boolean("ai_suggestions").notNull().default(true),
  profileReminders: boolean("profile_reminders").notNull().default(false),
  securityAlerts: boolean("security_alerts").notNull().default(true),
  soundEnabled: boolean("sound_enabled").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
});

class UserNotificationSettingsModel {
  static async upsertByUserId(userId, data) {
    const existing = await db.select().from(userNotificationSettingsTable).where(eq(userNotificationSettingsTable.userId, userId));
    if (existing && existing.length > 0) {
      const [row] = await db
        .update(userNotificationSettingsTable)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(userNotificationSettingsTable.userId, userId))
        .returning();
      return row;
    }
    const [row] = await db.insert(userNotificationSettingsTable).values({ userId, ...data }).returning();
    return row;
  }

  static async getByUserId(userId) {
    const [row] = await db
      .select()
      .from(userNotificationSettingsTable)
      .where(eq(userNotificationSettingsTable.userId, userId));
    return row;
  }
}

module.exports = { userNotificationSettingsTable, UserNotificationSettingsModel };


