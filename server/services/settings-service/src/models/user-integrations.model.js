const { pgTable, serial, integer, boolean, timestamp } = require("drizzle-orm/pg-core");
const { eq } = require("drizzle-orm");
const { db } = require("../config/database");

const userIntegrationsTable = pgTable("user_integrations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  github: boolean("github").notNull().default(false),
  linkedin: boolean("linkedin").notNull().default(false),
  googleCalendar: boolean("google_calendar").notNull().default(true),
  githubConnectedAt: timestamp("github_connected_at"),
  linkedinConnectedAt: timestamp("linkedin_connected_at"),
  googleCalendarConnectedAt: timestamp("google_calendar_connected_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
});

class UserIntegrationsModel {
  static async upsertByUserId(userId, data) {
    const existing = await db.select().from(userIntegrationsTable).where(eq(userIntegrationsTable.userId, userId));
    if (existing && existing.length > 0) {
      const [row] = await db
        .update(userIntegrationsTable)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(userIntegrationsTable.userId, userId))
        .returning();
      return row;
    }
    const [row] = await db.insert(userIntegrationsTable).values({ userId, ...data }).returning();
    return row;
  }

  static async getByUserId(userId) {
    const [row] = await db
      .select()
      .from(userIntegrationsTable)
      .where(eq(userIntegrationsTable.userId, userId));
    return row;
  }
}

module.exports = { userIntegrationsTable, UserIntegrationsModel };


