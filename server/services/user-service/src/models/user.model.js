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

// Developer Favorites table
const developerFavoritesTable = pgTable("developer_favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // Project owner who is favoriting
  developerId: integer("developer_id").notNull(), // Developer being favorited
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Developer Saves table
const developerSavesTable = pgTable("developer_saves", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // Project owner who is saving
  developerId: integer("developer_id").notNull(), // Developer being saved
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Developer Applications table (Project owner reaching out to developer)
const developerApplicationsTable = pgTable("developer_applications", {
  id: serial("id").primaryKey(),
  projectOwnerId: integer("project_owner_id").notNull(), // Project owner who is reaching out
  developerId: integer("developer_id").notNull(), // Developer being contacted
  projectId: integer("project_id"), // Optional: associated project
  message: text("message"), // Message from project owner
  notes: text("notes"), // Internal notes
  status: text("status").default("pending"), // pending, accepted, rejected
  appliedAt: timestamp("applied_at").defaultNow().notNull(),
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

  // ============================================
  // DEVELOPER FAVORITES
  // ============================================
  
  static async addDeveloperFavorite(userId, developerId) {
    const [favorite] = await db
      .insert(developerFavoritesTable)
      .values({ userId, developerId })
      .returning();
    return favorite;
  }

  static async removeDeveloperFavorite(userId, developerId) {
    await db
      .delete(developerFavoritesTable)
      .where(
        and(
          eq(developerFavoritesTable.userId, userId),
          eq(developerFavoritesTable.developerId, developerId)
        )
      );
    return true;
  }

  static async getDeveloperFavorites(userId) {
    const { sql } = require("drizzle-orm");
    
    const favorites = await db.execute(sql`
      SELECT 
        df.id,
        df.user_id as "userId",
        df.developer_id as "developerId",
        df.created_at as "createdAt",
        u.id as "developer_id",
        u.name,
        u.email,
        u.bio,
        u.avatar_url as "avatarUrl",
        u.skills,
        u.experience,
        u.location,
        u.availability,
        u.github_url as "githubUrl",
        u.linkedin_url as "linkedinUrl",
        u.portfolio_url as "portfolioUrl",
        u.xp,
        u.level
      FROM developer_favorites df
      LEFT JOIN users u ON df.developer_id = u.id
      WHERE df.user_id = ${userId} AND u.is_deleted = false
      ORDER BY df.created_at DESC
    `);
    
    return favorites.rows || [];
  }

  // ============================================
  // DEVELOPER SAVES
  // ============================================
  
  static async addDeveloperSave(userId, developerId) {
    const [save] = await db
      .insert(developerSavesTable)
      .values({ userId, developerId })
      .returning();
    return save;
  }

  static async removeDeveloperSave(userId, developerId) {
    await db
      .delete(developerSavesTable)
      .where(
        and(
          eq(developerSavesTable.userId, userId),
          eq(developerSavesTable.developerId, developerId)
        )
      );
    return true;
  }

  static async getDeveloperSaves(userId) {
    const { sql } = require("drizzle-orm");
    
    const saves = await db.execute(sql`
      SELECT 
        ds.id,
        ds.user_id as "userId",
        ds.developer_id as "developerId",
        ds.created_at as "createdAt",
        u.id as "developer_id",
        u.name,
        u.email,
        u.bio,
        u.avatar_url as "avatarUrl",
        u.skills,
        u.experience,
        u.location,
        u.availability,
        u.github_url as "githubUrl",
        u.linkedin_url as "linkedinUrl",
        u.portfolio_url as "portfolioUrl",
        u.xp,
        u.level
      FROM developer_saves ds
      LEFT JOIN users u ON ds.developer_id = u.id
      WHERE ds.user_id = ${userId} AND u.is_deleted = false
      ORDER BY ds.created_at DESC
    `);
    
    return saves.rows || [];
  }

  // ============================================
  // DEVELOPER APPLICATIONS (Project Owner Outreach)
  // ============================================
  
  static async applyToDeveloper(applicationData) {
    const { projectOwnerId, developerId, projectId, message, notes } = applicationData;
    
    const [application] = await db
      .insert(developerApplicationsTable)
      .values({
        projectOwnerId,
        developerId,
        projectId,
        message,
        notes,
        status: 'pending'
      })
      .returning();
    
    return application;
  }

  static async withdrawDeveloperApplication(projectOwnerId, developerId) {
    const [result] = await db
      .delete(developerApplicationsTable)
      .where(
        and(
          eq(developerApplicationsTable.projectOwnerId, projectOwnerId),
          eq(developerApplicationsTable.developerId, developerId)
        )
      )
      .returning();
    
    return result;
  }

  static async getMyDeveloperApplications(projectOwnerId) {
    const { sql } = require("drizzle-orm");
    
    const applications = await db.execute(sql`
      SELECT 
        da.id as "applicationId",
        da.project_owner_id as "projectOwnerId",
        da.developer_id as "developerId",
        da.project_id as "projectId",
        da.message,
        da.notes,
        da.status,
        da.applied_at as "appliedAt",
        da.updated_at as "updatedAt",
        u.id as "developer_id",
        u.name,
        u.email,
        u.bio,
        u.avatar_url as "avatarUrl",
        u.skills,
        u.experience,
        u.location,
        u.availability,
        u.github_url as "githubUrl",
        u.linkedin_url as "linkedinUrl",
        u.portfolio_url as "portfolioUrl",
        u.xp,
        u.level
      FROM developer_applications da
      LEFT JOIN users u ON da.developer_id = u.id
      WHERE da.project_owner_id = ${projectOwnerId} AND u.is_deleted = false
      ORDER BY da.applied_at DESC
    `);
    
    return applications.rows || [];
  }

  static async getMyDeveloperApplicationsCount(projectOwnerId) {
    const { sql } = require("drizzle-orm");
    
    const result = await db.execute(sql`
      SELECT COUNT(*) as count
      FROM developer_applications da
      LEFT JOIN users u ON da.developer_id = u.id
      WHERE da.project_owner_id = ${projectOwnerId} AND u.is_deleted = false
    `);
    
    return result.rows[0]?.count || 0;
  }

  static async getAppliedDevelopers(projectOwnerId) {
    const { sql } = require("drizzle-orm");
    
    const appliedDevelopers = await db.execute(sql`
      SELECT 
        da.id as "applicationId",
        da.developer_id as "developerId",
        da.project_id as "projectId",
        da.status,
        da.applied_at as "appliedAt",
        da.message,
        da.notes,
        u.id as "developer_id",
        u.name,
        u.email,
        u.bio,
        u.avatar_url as "avatarUrl",
        u.skills,
        u.experience,
        u.location,
        u.availability,
        u.github_url as "githubUrl",
        u.linkedin_url as "linkedinUrl",
        u.portfolio_url as "portfolioUrl",
        u.xp,
        u.level
      FROM developer_applications da
      LEFT JOIN users u ON da.developer_id = u.id
      WHERE da.project_owner_id = ${projectOwnerId} AND u.is_deleted = false
      ORDER BY da.applied_at DESC
    `);
    
    return appliedDevelopers.rows || [];
  }
}

module.exports = {
  userTable,
  developerFavoritesTable,
  developerSavesTable,
  developerApplicationsTable,
  UserModel,
};
