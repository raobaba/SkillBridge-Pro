const {
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
  boolean,
  integer,
  json,
  uuid,
} = require("drizzle-orm/pg-core");

const { eq } = require("drizzle-orm");

const { db } = require("../config/database");

const userTable = pgTable("users", {
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom().unique().notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: varchar("password", { length: 255 }),
  oauthProvider: text("oauth_provider"),
  oauthId: text("oauth_id"),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  domainPreferences: text("domain_preferences"),
  skills: json("skills"),
  experience: text("experience"),
  location: text("location"),
  availability: text("availability"),
  resumeUrl: text("resume_url"),
  xp: integer("xp").default(0),
  badges: json("badges").default([]),
  level: integer("level").default(1),
  githubUrl: text("github_url"),
  linkedinUrl: text("linkedin_url"),
  stackoverflowUrl: text("stackoverflow_url"),
  portfolioScore: integer("portfolio_score"),
  isEmailVerified: boolean("is_email_verified").default(false),
  notificationPrefs: json("notification_prefs").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

class UserModel {
  static async createUser(userObject) {
    const [user] = await db.insert(userTable).values(userObject).returning();
    return user;
  }

  static async getUserById(id) {
    const [user] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, id));
    return user;
  }

  static async getUserByUUID(uuid) {
    const [user] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.uuid, uuid));
    return user;
  }

  static async getUserByEmail(email) {
    const [user] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email));
    return user;
  }

  static async updateUser(id, userObject) {
    const [user] = await db
      .update(userTable)
      .set(userObject)
      .where(eq(userTable.id, id))
      .returning();
    return user;
  }

  static async deleteUser(id) {
    const [user] = await db
      .delete(userTable)
      .where(eq(userTable.id, id))
      .returning();
    return user;
  }

  static async getAllUsers() {
    const users = await db.select().from(userTable);
    return users;
  }

  static async verifyEmail(id) {
    const [user] = await db
      .update(userTable)
      .set({ isEmailVerified: true })
      .where(eq(userTable.id, id))
      .returning();
    return user;
  }

  static async updateOAuthDetails(id, oauthDetails) {
    const [user] = await db
      .update(userTable)
      .set(oauthDetails)
      .where(eq(userTable.id, id))
      .returning();
    return user;
  }

  static async updatePassword(id, newPassword) {
    const [user] = await db
      .update(userTable)
      .set({ password: newPassword })
      .where(eq(userTable.id, id))
      .returning();
    return user;
  }

  static async updateResumeUrl(id, url) {
    const [user] = await db
      .update(userTable)
      .set({ resumeUrl: url })
      .where(eq(userTable.id, id))
      .returning();
    return user;
  }

  static async updateProfile(id, profile) {
    const [user] = await db
      .update(userTable)
      .set(profile)
      .where(eq(userTable.id, id))
      .returning();
    return user;
  }
}

module.exports = {
  userTable,
  UserModel,
};
