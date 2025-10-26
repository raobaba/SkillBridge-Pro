const { pgTable, serial, integer, text, timestamp } = require("drizzle-orm/pg-core");
const { eq } = require("drizzle-orm");
const { db } = require("../config/database");

const userNotificationFrequencyTable = pgTable("user_notification_frequency", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  email: text("email_frequency").notNull().default("daily"),
  push: text("push_frequency").notNull().default("immediate"),
  reminders: text("reminders_frequency").notNull().default("weekly"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
});

class UserNotificationFrequencyModel {
  static async upsertByUserId(userId, data) {
    const existing = await db.select().from(userNotificationFrequencyTable).where(eq(userNotificationFrequencyTable.userId, userId));
    if (existing && existing.length > 0) {
      const [row] = await db
        .update(userNotificationFrequencyTable)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(userNotificationFrequencyTable.userId, userId))
        .returning();
      return row;
    }
    const [row] = await db.insert(userNotificationFrequencyTable).values({ userId, ...data }).returning();
    return row;
  }

  static async getByUserId(userId) {
    const [row] = await db
      .select()
      .from(userNotificationFrequencyTable)
      .where(eq(userNotificationFrequencyTable.userId, userId));
    return row;
  }
}

module.exports = { userNotificationFrequencyTable, UserNotificationFrequencyModel };


