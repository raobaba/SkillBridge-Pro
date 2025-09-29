const { pgTable, serial, integer, text, timestamp } = require("drizzle-orm/pg-core");
const { eq } = require("drizzle-orm");
const { db } = require("../config/database");

const userSubscriptionsTable = pgTable("user_subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  plan: text("plan").notNull().default("Free"),
  status: text("status").notNull().default("active"),
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
});

class UserSubscriptionsModel {
  static async upsertByUserId(userId, data) {
    const existing = await db.select().from(userSubscriptionsTable).where(eq(userSubscriptionsTable.userId, userId));
    if (existing && existing.length > 0) {
      const [row] = await db
        .update(userSubscriptionsTable)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(userSubscriptionsTable.userId, userId))
        .returning();
      return row;
    }
    const [row] = await db.insert(userSubscriptionsTable).values({ userId, ...data }).returning();
    return row;
  }

  static async getByUserId(userId) {
    const [row] = await db
      .select()
      .from(userSubscriptionsTable)
      .where(eq(userSubscriptionsTable.userId, userId));
    return row;
  }
}

module.exports = { userSubscriptionsTable, UserSubscriptionsModel };


