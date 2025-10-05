const {
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
  boolean,
  integer,
  uuid,
  pgEnum,
  numeric,
} = require("drizzle-orm/pg-core");
const { eq, and, desc, or, ilike, gte, lte, asc } = require("drizzle-orm");

const { db } = require("../config/database");

// Enums
const projectStatusEnum = pgEnum("project_status", [
  "draft",
  "upcoming",
  "active",
  "paused",
  "completed",
  "cancelled",
]);

const priorityEnum = pgEnum("priority", ["low", "medium", "high"]);
const experienceLevelEnum = pgEnum("experience_level", [
  "entry",
  "mid",
  "senior",
  "lead",
]);

// Main Projects table
const projectsTable = pgTable("projects", {
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom().unique().notNull(),
  ownerId: integer("owner_id").notNull(), // FK -> users.id
  title: text("title").notNull(),
  description: text("description").notNull(),
  roleNeeded: text("role_needed").notNull(),
  status: projectStatusEnum("status").default("draft").notNull(),
  priority: priorityEnum("priority").default("medium"),
  category: text("category"),
  experienceLevel: experienceLevelEnum("experience_level"),
  budgetMin: integer("budget_min"),
  budgetMax: integer("budget_max"),
  currency: varchar("currency", { length: 8 }).default("USD"),
  isRemote: boolean("is_remote").default(true),
  location: text("location"),
  duration: text("duration"),
  startDate: timestamp("start_date"),
  deadline: timestamp("deadline"),
  requirements: text("requirements"),
  benefits: text("benefits"),
  company: text("company"),
  website: text("website"),
  featuredUntil: timestamp("featured_until"),
  isUrgent: boolean("is_urgent").default(false),
  isFeatured: boolean("is_featured").default(false),
  maxApplicants: integer("max_applicants"),
  language: text("language").default("English"),
  timezone: text("timezone"),
  matchScoreAvg: integer("match_score_avg").default(0),
  ratingAvg: numeric("rating_avg").default("0"),
  ratingCount: integer("rating_count").default(0),
  applicantsCount: integer("applicants_count").default(0),
  newApplicantsCount: integer("new_applicants_count").default(0),
  // Missing fields from frontend components
  subcategory: text("subcategory"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  color: varchar("color", { length: 7 }).default("#7f00ff"),
  progress: integer("progress").default(0),
  workArrangement: text("work_arrangement").default("remote"),
  visibility: text("visibility").default("public"),
  paymentTerms: text("payment_terms").default("fixed"),
  activityCount: integer("activity_count").default(0),
  viewsCount: integer("views_count").default(0),
  favoritesCount: integer("favorites_count").default(0),
  sharesCount: integer("shares_count").default(0),
  disputesCount: integer("disputes_count").default(0),
  isFlagged: boolean("is_flagged").default(false),
  isVerified: boolean("is_verified").default(false),
  isSuspended: boolean("is_suspended").default(false),
  suspensionReason: text("suspension_reason"),
  verificationNotes: text("verification_notes"),
  lastActivityAt: timestamp("last_activity_at"),
  boostLevel: integer("boost_level").default(0),
  isDeleted: boolean("is_deleted").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Projects Model Class
class ProjectsModel {
  // Projects CRUD
  static async createProject(projectObject) {
    const [project] = await db.insert(projectsTable).values(projectObject).returning();
    return project;
  }

  static async getProjectById(id) {
    const [project] = await db
      .select()
      .from(projectsTable)
      .where(and(eq(projectsTable.id, id), eq(projectsTable.isDeleted, false)));
    return project;
  }

  static async getProjectByUUID(projectUuid) {
    const [project] = await db
      .select()
      .from(projectsTable)
      .where(and(eq(projectsTable.uuid, projectUuid), eq(projectsTable.isDeleted, false)));
    return project;
  }

  static async listProjects({ ownerId, status } = {}) {
    // Build conditions array
    const conditions = [eq(projectsTable.isDeleted, false)];
    
    if (ownerId) {
      conditions.push(eq(projectsTable.ownerId, ownerId));
    }
    if (status) {
      conditions.push(eq(projectsTable.status, status));
    }
    
    // Apply all conditions with AND
    const whereClause = conditions.length > 1 ? and(...conditions) : conditions[0];
    
    const rows = await db
      .select()
      .from(projectsTable)
      .where(whereClause)
      .orderBy(desc(projectsTable.createdAt));
    
    return rows;
  }

  static async updateProject(id, updateObject) {
    // guard against immutable fields
    const immutable = ["id", "uuid", "createdAt"];
    const clean = { ...updateObject };
    immutable.forEach((k) => delete clean[k]);
    clean.updatedAt = new Date();

    const [project] = await db
      .update(projectsTable)
      .set(clean)
      .where(and(eq(projectsTable.id, id), eq(projectsTable.isDeleted, false)))
      .returning();
    return project;
  }

  static async softDeleteProject(id) {
    const [project] = await db
      .update(projectsTable)
      .set({ isDeleted: true })
      .where(eq(projectsTable.id, id))
      .returning();
    return project;
  }

  // Update project counters
  static async updateApplicantsCount(projectId, increment = 1) {
    // Recompute authoritative count from applicants table to avoid drift
    const { projectApplicantsTable } = require("./project-applicants.model");
    const result = await db
      .select({ count: projectApplicantsTable.id })
      .from(projectApplicantsTable)
      .where(eq(projectApplicantsTable.projectId, projectId));
    const applicantsCount = Array.isArray(result) && result[0] && result[0].count != null ? Number(result[0].count) : 0;

    await db.update(projectsTable).set({
      applicantsCount,
      // newApplicantsCount left unchanged here; separate logic can recalc if needed
      updatedAt: new Date(),
    }).where(eq(projectsTable.id, projectId));
  }

  static async updateRatingStats(projectId, ratingAvg, ratingCount) {
    await db.update(projectsTable).set({
      ratingAvg: String(ratingAvg.toFixed(2)),
      ratingCount: ratingCount,
      updatedAt: new Date(),
    }).where(eq(projectsTable.id, projectId));
  }

  static async setFeatured(projectId, featuredUntil) {
    await db.update(projectsTable).set({
      isFeatured: true,
      featuredUntil: featuredUntil,
      updatedAt: new Date(),
    }).where(eq(projectsTable.id, projectId));
  }

  // Project Favorites methods
  static async addProjectFavorite(userId, projectId) {
    const { ProjectFavoritesModel } = require("./project-favorites.model");
    const favorite = await ProjectFavoritesModel.addProjectFavorite(userId, projectId);
    
    // Update favorites count
    await ProjectsModel.updateFavoritesCount(projectId);
    
    return favorite;
  }

  static async removeProjectFavorite(userId, projectId) {
    const { ProjectFavoritesModel } = require("./project-favorites.model");
    const result = await ProjectFavoritesModel.removeProjectFavorite(userId, projectId);
    
    // Update favorites count
    await ProjectsModel.updateFavoritesCount(projectId);
    
    return result;
  }

  static async getProjectFavorites(userId) {
    const { ProjectFavoritesModel } = require("./project-favorites.model");
    return await ProjectFavoritesModel.getUserFavoriteProjects(userId);
  }

  // Project Saves (Bookmarks)
  static async addProjectSave(userId, projectId) {
    const { ProjectSavesModel } = require("./project-saves.model");
    return await ProjectSavesModel.addProjectSave(userId, projectId);
  }

  static async removeProjectSave(userId, projectId) {
    const { ProjectSavesModel } = require("./project-saves.model");
    return await ProjectSavesModel.removeProjectSave(userId, projectId);
  }

  static async getProjectSaves(userId) {
    const { ProjectSavesModel } = require("./project-saves.model");
    return await ProjectSavesModel.getUserSavedProjects(userId);
  }

  static async updateFavoritesCount(projectId) {
    const { ProjectFavoritesModel } = require("./project-favorites.model");
    const count = await ProjectFavoritesModel.getProjectFavoritesCount(projectId);
    
    await db.update(projectsTable).set({
      favoritesCount: count,
      updatedAt: new Date(),
    }).where(eq(projectsTable.id, projectId));
  }

  // Search projects with filters
  static async searchProjects(filters = {}) {
    const {
      query,
      category,
      status,
      priority,
      experienceLevel,
      budgetMin,
      budgetMax,
      isRemote,
      location,
      skills,
      tags,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 20
    } = filters;

    // Build conditions array
    const conditions = [eq(projectsTable.isDeleted, false)];

    // Text search
    if (query) {
      conditions.push(
        or(
          ilike(projectsTable.title, `%${query}%`),
          ilike(projectsTable.description, `%${query}%`),
          ilike(projectsTable.roleNeeded, `%${query}%`),
          ilike(projectsTable.company, `%${query}%`)
        )
      );
    }

    // Category filter
    if (category) {
      conditions.push(eq(projectsTable.category, category));
    }

    // Status filter
    if (status) {
      conditions.push(eq(projectsTable.status, status));
    }

    // Priority filter
    if (priority) {
      conditions.push(eq(projectsTable.priority, priority));
    }

    // Experience level filter
    if (experienceLevel) {
      conditions.push(eq(projectsTable.experienceLevel, experienceLevel));
    }

    // Budget filters
    if (budgetMin !== undefined) {
      conditions.push(gte(projectsTable.budgetMin, budgetMin));
    }
    if (budgetMax !== undefined) {
      conditions.push(lte(projectsTable.budgetMax, budgetMax));
    }

    // Remote filter
    if (isRemote !== undefined) {
      conditions.push(eq(projectsTable.isRemote, isRemote));
    }

    // Location filter
    if (location) {
      conditions.push(ilike(projectsTable.location, `%${location}%`));
    }

    // Apply all conditions
    const whereClause = conditions.length > 1 ? and(...conditions) : conditions[0];

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Build sort order
    const sortColumn = projectsTable[sortBy] || projectsTable.createdAt;
    const orderBy = sortOrder === 'asc' ? asc(sortColumn) : desc(sortColumn);

    // Execute query
    const rows = await db
      .select()
      .from(projectsTable)
      .where(whereClause)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalCount = await db
      .select({ count: projectsTable.id })
      .from(projectsTable)
      .where(whereClause);

    return {
      projects: rows,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: totalCount.length,
        pages: Math.ceil(totalCount.length / limit)
      }
    };
  }
}

module.exports = {
  projectsTable,
  ProjectsModel,
};
