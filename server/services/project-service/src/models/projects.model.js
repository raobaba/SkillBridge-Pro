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
const { eq, and, desc } = require("drizzle-orm");

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
    let query = db.select().from(projectsTable).where(eq(projectsTable.isDeleted, false));
    if (ownerId) {
      query = query.where(and(eq(projectsTable.ownerId, ownerId), eq(projectsTable.isDeleted, false)));
    }
    if (status) {
      query = query.where(and(eq(projectsTable.status, status), eq(projectsTable.isDeleted, false)));
    }
    const rows = await query.orderBy(desc(projectsTable.createdAt));
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
    // First get current counts to avoid null issues
    const [project] = await db
      .select({ 
        applicantsCount: projectsTable.applicantsCount, 
        newApplicantsCount: projectsTable.newApplicantsCount 
      })
      .from(projectsTable)
      .where(eq(projectsTable.id, projectId));
    
    if (project) {
      const currentApplicantsCount = project.applicantsCount || 0;
      const currentNewApplicantsCount = project.newApplicantsCount || 0;
      
      await db.update(projectsTable).set({
        applicantsCount: currentApplicantsCount + increment,
        newApplicantsCount: currentNewApplicantsCount + increment,
        updatedAt: new Date(),
      }).where(eq(projectsTable.id, projectId));
    }
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
}

module.exports = {
  projectsTable,
  ProjectsModel,
};
