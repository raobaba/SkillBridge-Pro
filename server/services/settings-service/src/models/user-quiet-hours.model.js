const { pgTable, serial, integer, boolean, time, timestamp } = require("drizzle-orm/pg-core");
const { eq } = require("drizzle-orm");
const { db } = require("../config/database");

const userQuietHoursTable = pgTable("user_quiet_hours", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  enabled: boolean("enabled").notNull().default(false),
  start: time("start"),
  end: time("end"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
});

class UserQuietHoursModel {
  static async upsertByUserId(userId, data) {
    const existing = await db.select().from(userQuietHoursTable).where(eq(userQuietHoursTable.userId, userId));
    if (existing && existing.length > 0) {
      const [row] = await db
        .update(userQuietHoursTable)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(userQuietHoursTable.userId, userId))
        .returning();
      return row;
    }
    const [row] = await db.insert(userQuietHoursTable).values({ userId, ...data }).returning();
    return row;
  }

  static async getByUserId(userId) {
    const [row] = await db
      .select()
      .from(userQuietHoursTable)
      .where(eq(userQuietHoursTable.userId, userId));
    return row;
  }
}

module.exports = { userQuietHoursTable, UserQuietHoursModel };


