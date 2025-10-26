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
  pgEnum,
} = require("drizzle-orm/pg-core");

const { eq, and, or, ilike, desc } = require("drizzle-orm");

const { db } = require("../config/database");

// Define enum for roles
const roleEnum = pgEnum("role", ["developer", "project-owner", "admin"]);

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
  portfolioUrl: text("portfolio_url"),
  portfolioScore: integer("portfolio_score"),
  isEmailVerified: boolean("is_email_verified").default(false),
  resetPasswordToken: text("reset_password_token"),
  resetPasswordExpire: timestamp("reset_password_expire"),
  notificationPrefs: json("notification_prefs").default({}),
  role: roleEnum("role").default("developer").notNull(), // Keep for backward compatibility
  roles: json("roles").default([]), // New: array of roles
  isDeleted: boolean("is_deleted").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
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
      .where(and(eq(userTable.id, id), eq(userTable.isDeleted, false)));
    return user;
  }

  static async getUserByUUID(uuid) {
    const [user] = await db
      .select()
      .from(userTable)
      .where(and(eq(userTable.uuid, uuid), eq(userTable.isDeleted, false)));
    return user;
  }

  static async getUserByEmail(email) {
    const [user] = await db
      .select()
      .from(userTable)
      .where(and(eq(userTable.email, email), eq(userTable.isDeleted, false)));
    return user;
  }

  static async updateUser(id, userObject) {
    const [user] = await db
      .update(userTable)
      .set(userObject)
      .where(and(eq(userTable.id, id), eq(userTable.isDeleted, false)))
      .returning();
    return user;
  }

  static async deleteUser(id) {
    const [user] = await db
      .update(userTable)
      .set({ isDeleted: true })
      .where(eq(userTable.id, id))
      .returning();
    return user;
  }

  static async getAllUsers() {
    const users = await db
      .select()
      .from(userTable)
      .where(eq(userTable.isDeleted, false));
    return users;
  }

  static async getDevelopers(filters = {}) {
    const { 
      search,
      experience,
      location,
      skills,
      availability,
      limit = 20,
      page = 1
    } = filters;

    let query = db
      .select()
      .from(userTable)
      .where(
        and(
          eq(userTable.isDeleted, false),
          eq(userTable.role, 'developer')
        )
      );

    // Add search filter if provided
    if (search) {
      query = query.where(
        and(
          eq(userTable.isDeleted, false),
          eq(userTable.role, 'developer'),
          or(
            ilike(userTable.name, `%${search}%`),
            ilike(userTable.bio, `%${search}%`),
            ilike(userTable.domainPreferences, `%${search}%`)
          )
        )
      );
    }

    // Add experience filter if provided
    if (experience && experience !== 'all') {
      query = query.where(
        and(
          eq(userTable.isDeleted, false),
          eq(userTable.role, 'developer'),
          eq(userTable.experience, experience)
        )
      );
    }

    // Add location filter if provided
    if (location && location !== 'all') {
      if (location === 'remote') {
        query = query.where(
          and(
            eq(userTable.isDeleted, false),
            eq(userTable.role, 'developer'),
            or(
              ilike(userTable.location, '%remote%'),
              eq(userTable.location, 'Remote')
            )
          )
        );
      } else {
        query = query.where(
          and(
            eq(userTable.isDeleted, false),
            eq(userTable.role, 'developer'),
            ilike(userTable.location, `%${location}%`)
          )
        );
      }
    }

    // Add availability filter if provided
    if (availability && availability !== 'all') {
      query = query.where(
        and(
          eq(userTable.isDeleted, false),
          eq(userTable.role, 'developer'),
          eq(userTable.availability, availability)
        )
      );
    }

    // Add pagination
    const offset = (page - 1) * limit;
    query = query.limit(limit).offset(offset);

    // Order by XP (level) descending
    query = query.orderBy(desc(userTable.xp));

    const developers = await query;
    return developers;
  }

  static async verifyEmail(id) {
    const [user] = await db
      .update(userTable)
      .set({ isEmailVerified: true })
      .where(and(eq(userTable.id, id), eq(userTable.isDeleted, false)))
      .returning();
    return user;
  }

  static async getUserByResetToken(hashedToken) {
    const [user] = await db
      .select()
      .from(userTable)
      .where(
        and(
          eq(userTable.resetPasswordToken, hashedToken),
          eq(userTable.isDeleted, false)
        )
      );
    return user;
  }

  static async setResetPasswordToken(id, tokenHash, expireTime) {
    const [user] = await db
      .update(userTable)
      .set({
        resetPasswordToken: tokenHash,
        resetPasswordExpire: expireTime,
      })
      .where(and(eq(userTable.id, id), eq(userTable.isDeleted, false)))
      .returning();
    return user;
  }

  static async clearResetPasswordToken(id) {
    const [user] = await db
      .update(userTable)
      .set({
        resetPasswordToken: null,
        resetPasswordExpire: null,
      })
      .where(and(eq(userTable.id, id), eq(userTable.isDeleted, false)))
      .returning();
    return user;
  }

  static async updateOAuthDetails(id, oauthDetails) {
    const [user] = await db
      .update(userTable)
      .set(oauthDetails)
      .where(and(eq(userTable.id, id), eq(userTable.isDeleted, false)))
      .returning();
    return user;
  }

  static async updatePassword(id, newPassword) {
    const [user] = await db
      .update(userTable)
      .set({ password: newPassword })
      .where(and(eq(userTable.id, id), eq(userTable.isDeleted, false)))
      .returning();
    return user;
  }

  static async updateResumeUrl(id, url) {
    const [user] = await db
      .update(userTable)
      .set({ resumeUrl: url })
      .where(and(eq(userTable.id, id), eq(userTable.isDeleted, false)))
      .returning();
    return user;
  }

  static async updateProfile(id, profile) {
    const updateData = { ...profile };

    // 🔒 Never allow immutable fields
    delete updateData.id;
    delete updateData.uuid;
    delete updateData.createdAt;

    // ✅ Always let DB handle updatedAt
    updateData.updatedAt = new Date();

    // ✅ Ensure JSON fields are real objects/arrays, not strings
    if (typeof updateData.skills === "string") {
      try {
        updateData.skills = JSON.parse(updateData.skills);
      } catch {
        updateData.skills = {};
      }
    }

    if (typeof updateData.badges === "string") {
      try {
        updateData.badges = JSON.parse(updateData.badges);
      } catch {
        updateData.badges = [];
      }
    }

    if (typeof updateData.notificationPrefs === "string") {
      try {
        updateData.notificationPrefs = JSON.parse(updateData.notificationPrefs);
      } catch {
        updateData.notificationPrefs = {};
      }
    }

    // ✅ Normalize resetPasswordExpire if present
    if (updateData.resetPasswordExpire) {
      const date = new Date(updateData.resetPasswordExpire);
      updateData.resetPasswordExpire = isNaN(date) ? null : date;
    }

    const [user] = await db
      .update(userTable)
      .set(updateData)
      .where(and(eq(userTable.id, id), eq(userTable.isDeleted, false)))
      .returning();

    return user;
  }

  // Role management methods
  static async assignRole(userId, role, assignedBy = null) {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Get current roles
    let currentRoles = user.roles || [];
    
    // Check if user already has this role
    if (currentRoles.includes(role)) {
      throw new Error(`User already has the role: ${role}`);
    }

    // Add the new role
    currentRoles.push(role);

    // Update user with new roles
    const [updatedUser] = await db
      .update(userTable)
      .set({ 
        roles: currentRoles,
        updatedAt: new Date()
      })
      .where(and(eq(userTable.id, userId), eq(userTable.isDeleted, false)))
      .returning();

    return updatedUser;
  }

  static async removeRole(userId, role) {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Get current roles
    let currentRoles = user.roles || [];
    
    // Check if user has this role
    if (!currentRoles.includes(role)) {
      throw new Error(`User does not have the role: ${role}`);
    }

    // Remove the role
    currentRoles = currentRoles.filter(r => r !== role);

    // Update user with updated roles
    const [updatedUser] = await db
      .update(userTable)
      .set({ 
        roles: currentRoles,
        updatedAt: new Date()
      })
      .where(and(eq(userTable.id, userId), eq(userTable.isDeleted, false)))
      .returning();

    return updatedUser;
  }

  static async getUserRoles(userId) {
    const user = await this.getUserById(userId);
    if (!user) return [];

    return user.roles || [];
  }

  static async hasRole(userId, role) {
    const user = await this.getUserById(userId);
    if (!user) return false;

    const roles = user.roles || [];
    return roles.includes(role);
  }

  static async hasAnyRole(userId, roles) {
    const user = await this.getUserById(userId);
    if (!user) return false;

    const userRoles = user.roles || [];
    return roles.some(role => userRoles.includes(role));
  }

  // Get user with roles (roles are already included in user object)
  static async getUserWithRoles(id) {
    return await this.getUserById(id);
  }

  static async getUserByEmailWithRoles(email) {
    return await this.getUserByEmail(email);
  }

  static async getUserByUUIDWithRoles(uuid) {
    return await this.getUserByUUID(uuid);
  }
}

module.exports = {
  userTable,
  UserModel,
};
