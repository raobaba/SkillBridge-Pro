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

const { eq, and, or, ne, ilike, desc } = require("drizzle-orm");

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

  /**
   * Get users by roles (for chat purposes - developers and project-owners)
   */
  static async getUsersByRoles(roles = ['developer', 'project-owner'], filters = {}) {
    const { 
      search,
      limit = 200,
      excludeUserId = null
    } = filters;

    // Build base conditions
    const baseConditions = [
      eq(userTable.isDeleted, false),
      or(...roles.map(role => eq(userTable.role, role)))
    ];

    // Add exclude user condition if provided
    if (excludeUserId) {
      baseConditions.push(ne(userTable.id, parseInt(excludeUserId)));
    }

    // Add search conditions if provided
    if (search) {
      baseConditions.push(
        or(
          ilike(userTable.name, `%${search}%`),
          ilike(userTable.email, `%${search}%`),
          ilike(userTable.bio, `%${search}%`)
        )
      );
    }

    // Build query with all conditions
    let query = db
      .select()
      .from(userTable)
      .where(and(...baseConditions))
      .limit(parseInt(limit))
      .orderBy(desc(userTable.createdAt));

    const users = await query;
    return users;
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

  // ============================================
  // DEVELOPER DASHBOARD / GAMIFICATION
  // ============================================

  /**
   * Get comprehensive developer stats for dashboard
   * Includes: XP, level, reputation, streak, badges, achievements, endorsements, completed projects, ratings
   */
  static async getDeveloperStats(userId) {
    const { sql } = require("drizzle-orm");
    
    // Get user basic info
    const user = await this.getUserById(userId);
    if (!user) {
      return null;
    }

    // Get completed projects count (projects where user was accepted)
    const completedProjectsResult = await db.execute(sql`
      SELECT COUNT(DISTINCT pa.project_id) as count
      FROM project_applicants pa
      WHERE pa.user_id = ${userId} AND pa.status = 'accepted'
    `);
    const completedProjects = Number(completedProjectsResult.rows[0]?.count || 0);

    // Get average rating and total ratings from project reviews
    // Note: This assumes reviews are about projects, not developers directly
    // If you have developer reviews, adjust this query
    const ratingsResult = await db.execute(sql`
      SELECT 
        COALESCE(AVG(pr.rating), 0) as average_rating,
        COUNT(pr.id) as total_ratings
      FROM project_reviews pr
      INNER JOIN project_applicants pa ON pr.project_id = pa.project_id
      WHERE pa.user_id = ${userId} AND pa.status = 'accepted'
    `);
    const averageRating = Number(ratingsResult.rows[0]?.average_rating || 0);
    const totalRatings = Number(ratingsResult.rows[0]?.total_ratings || 0);

    // Calculate weekly XP (XP earned in last 7 days)
    // For now, we'll use a simple calculation - you might want to track XP history
    const weeklyXP = 0; // TODO: Implement XP history tracking

    // Calculate daily XP (XP earned today)
    const dailyXP = 0; // TODO: Implement XP history tracking

    // Calculate streak (consecutive days with activity)
    // For now, we'll use a simple calculation based on recent activity
    const streak = 0; // TODO: Implement activity streak tracking

    // Get badges count
    const badgesCount = Array.isArray(user.badges) ? user.badges.length : 0;

    // Get achievements count (based on badges)
    const achievementsCount = badgesCount;

    // Get endorsements count
    // Assuming endorsements are stored somewhere - for now using a placeholder
    const endorsementsCount = 0; // TODO: Implement endorsements table/query

    // Calculate reputation (based on XP, ratings, completed projects)
    const reputation = Math.round(
      (user.xp / 100) * 0.4 +
      (averageRating * 10) * 0.4 +
      (completedProjects * 5) * 0.2
    );

    // Calculate total XP (cumulative XP earned)
    const totalXP = user.xp || 0;

    return {
      xp: user.xp || 0,
      level: user.level || 1,
      totalXP,
      weeklyXP,
      dailyXP,
      streak,
      reputation: Math.max(0, Math.min(100, reputation)), // Clamp between 0-100
      badges: badgesCount,
      achievements: achievementsCount,
      endorsements: endorsementsCount,
      completedProjects,
      averageRating: Number(averageRating.toFixed(1)),
      totalRatings,
    };
  }

  /**
   * Get reviews received by a developer
   * Currently returns reviews for projects where developer was accepted
   * Note: This requires access to project-service tables, which may need to be accessed via a different approach
   */
  static async getDeveloperReviews(userId, limit = 10) {
    // TODO: This requires cross-service database access
    // For now, return empty array - this should be implemented via an API call to project-service
    // or via a shared database connection
    return [];
  }

  /**
   * Get endorsements for a developer
   * TODO: Create endorsements table if it doesn't exist
   */
  static async getDeveloperEndorsements(userId, limit = 10) {
    // TODO: Implement endorsements table and query
    // For now, return empty array
    return [];
  }

  /**
   * Get leaderboard (top developers by XP)
   */
  static async getLeaderboard(limit = 10) {
    const developers = await db
      .select({
        id: userTable.id,
        name: userTable.name,
        email: userTable.email,
        avatarUrl: userTable.avatarUrl,
        xp: userTable.xp,
        level: userTable.level,
      })
      .from(userTable)
      .where(and(eq(userTable.isDeleted, false), eq(userTable.role, 'developer')))
      .orderBy(desc(userTable.xp))
      .limit(limit);
    
    return developers;
  }

  /**
   * Get developer achievements
   * Based on stats, calculates which achievements are unlocked
   */
  static async getDeveloperAchievements(userId) {
    const stats = await this.getDeveloperStats(userId);
    if (!stats) return [];

    const achievements = [
      {
        id: 1,
        name: "First Project",
        description: "Complete your first project",
        icon: "Star",
        unlocked: stats.completedProjects >= 1,
        xp: 100,
      },
      {
        id: 2,
        name: "Streak Master",
        description: "Maintain a 7-day streak",
        icon: "Flame",
        unlocked: stats.streak >= 7,
        xp: 200,
      },
      {
        id: 3,
        name: "Level Up",
        description: "Reach level 10",
        icon: "Target",
        unlocked: stats.level >= 10,
        xp: 500,
      },
      {
        id: 4,
        name: "XP Collector",
        description: "Earn 10,000 total XP",
        icon: "Zap",
        unlocked: stats.totalXP >= 10000,
        xp: 1000,
      },
      {
        id: 5,
        name: "Quality Expert",
        description: "Maintain 4.5+ average rating",
        icon: "Award",
        unlocked: stats.averageRating >= 4.5,
        xp: 800,
      },
      {
        id: 6,
        name: "Endorsement Magnet",
        description: "Receive 10+ endorsements",
        icon: "ThumbsUp",
        unlocked: stats.endorsements >= 10,
        xp: 600,
      },
    ];

    return achievements;
  }
}

module.exports = {
  userTable,
  developerFavoritesTable,
  developerSavesTable,
  developerApplicationsTable,
  UserModel,
};
