const { pgTable, serial, integer, boolean, timestamp } = require("drizzle-orm/pg-core");
const { eq } = require("drizzle-orm");
const { db } = require("../config/database");

const userPrivacySettingsTable = pgTable("user_privacy_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  profilePublic: boolean("profile_public").notNull().default(true),
  dataSharing: boolean("data_sharing").notNull().default(false),
  searchVisibility: boolean("search_visibility").notNull().default(true),
  personalizedAds: boolean("personalized_ads").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
});

class UserPrivacySettingsModel {
  static async upsertByUserId(userId, data) {
    const existing = await db.select().from(userPrivacySettingsTable).where(eq(userPrivacySettingsTable.userId, userId));
    if (existing && existing.length > 0) {
      const [row] = await db
        .update(userPrivacySettingsTable)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(userPrivacySettingsTable.userId, userId))
        .returning();
      return row;
    }
    const [row] = await db.insert(userPrivacySettingsTable).values({ userId, ...data }).returning();
    return row;
  }

  static async getByUserId(userId) {
    const [row] = await db
      .select()
      .from(userPrivacySettingsTable)
      .where(eq(userPrivacySettingsTable.userId, userId));
    return row;
  }
}

module.exports = { userPrivacySettingsTable, UserPrivacySettingsModel };


