
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
  
  const applicantStatusEnum = pgEnum("applicant_status", [
    "applied",
    "shortlisted",
    "interviewing",
    "rejected",
    "accepted",
  ]);
  
  const priorityEnum = pgEnum("priority", ["low", "medium", "high"]);
  const experienceLevelEnum = pgEnum("experience_level", [
    "entry",
    "mid",
    "senior",
    "lead",
  ]);
  
  const boostPlanEnum = pgEnum("boost_plan", ["basic", "premium", "spotlight"]);
  
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
  
  // Skills / Tags
  const projectSkillsTable = pgTable("project_skills", {
    id: serial("id").primaryKey(),
    projectId: integer("project_id").notNull(), // FK -> projects.id
    name: text("name").notNull(),
  });
  
  const projectTagsTable = pgTable("project_tags", {
    id: serial("id").primaryKey(),
    projectId: integer("project_id").notNull(),
    name: text("name").notNull(),
  });
  
  // Applicants workflow
  const projectApplicantsTable = pgTable("project_applicants", {
    id: serial("id").primaryKey(),
    projectId: integer("project_id").notNull(),
    userId: integer("user_id").notNull(),
    status: applicantStatusEnum("status").default("applied").notNull(),
    matchScore: integer("match_score"),
    rating: integer("rating"),
    notes: text("notes"),
    appliedAt: timestamp("applied_at").defaultNow(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
  });
  
  // Direct invites
  const projectInvitesTable = pgTable("project_invites", {
    id: serial("id").primaryKey(),
    projectId: integer("project_id").notNull(),
    invitedEmail: text("invited_email").notNull(),
    invitedUserId: integer("invited_user_id"),
    role: text("role"),
    message: text("message"),
    status: text("status").default("pending"), // pending | accepted | declined | expired
    sentAt: timestamp("sent_at").defaultNow(),
    respondedAt: timestamp("responded_at"),
  });
  
  // Team members
  const projectTeamTable = pgTable("project_team", {
    id: serial("id").primaryKey(),
    projectId: integer("project_id").notNull(),
    userId: integer("user_id").notNull(),
    role: text("role"),
    joinedAt: timestamp("joined_at").defaultNow(),
  });
  
  // Files
  const projectFilesTable = pgTable("project_files", {
    id: serial("id").primaryKey(),
    projectId: integer("project_id").notNull(),
    uploaderId: integer("uploader_id").notNull(),
    name: text("name").notNull(),
    url: text("url").notNull(),
    mimeType: text("mime_type"),
    sizeKb: integer("size_kb"),
    uploadedAt: timestamp("uploaded_at").defaultNow(),
  });
  
  // Updates / Activity
  const projectUpdatesTable = pgTable("project_updates", {
    id: serial("id").primaryKey(),
    projectId: integer("project_id").notNull(),
    authorId: integer("author_id").notNull(),
    type: text("type").default("note"), // note | status_change | milestone | activity
    message: text("message").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  });
  
  // Reviews (optional)
  const projectReviewsTable = pgTable("project_reviews", {
    id: serial("id").primaryKey(),
    projectId: integer("project_id").notNull(),
    reviewerId: integer("reviewer_id").notNull(),
    rating: integer("rating").notNull(),
    comment: text("comment"),
    createdAt: timestamp("created_at").defaultNow(),
  });
  
  // Boosts / Premium visibility
  const projectBoostsTable = pgTable("project_boosts", {
    id: serial("id").primaryKey(),
    projectId: integer("project_id").notNull(),
    purchasedBy: integer("purchased_by").notNull(),
    plan: boostPlanEnum("plan").default("basic").notNull(),
    amountCents: integer("amount_cents").notNull(),
    currency: varchar("currency", { length: 8 }).default("USD"),
    startAt: timestamp("start_at").notNull(),
    endAt: timestamp("end_at").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  });
  
  // Model class
  class ProjectModel {
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
  
    // Skills & Tags
    static async setSkills(projectId, skills = []) {
      // naive replace strategy; optimize with upserts if needed
      await db.delete(projectSkillsTable).where(eq(projectSkillsTable.projectId, projectId));
      if (skills.length === 0) return [];
      const rows = await db.insert(projectSkillsTable).values(
        skills.map((name) => ({ projectId, name }))
      ).returning();
      return rows;
    }
  
    static async setTags(projectId, tags = []) {
      await db.delete(projectTagsTable).where(eq(projectTagsTable.projectId, projectId));
      if (tags.length === 0) return [];
      const rows = await db.insert(projectTagsTable).values(
        tags.map((name) => ({ projectId, name }))
      ).returning();
      return rows;
    }
  
    // Applicants
    static async applyToProject({ projectId, userId, matchScore, notes }) {
      const [row] = await db.insert(projectApplicantsTable).values({
        projectId, userId, matchScore, notes,
        status: "applied",
      }).returning();
      // bump counters (best effort)
      await db.update(projectsTable).set({
        applicantsCount: projectsTable.applicantsCount + 1,
        newApplicantsCount: projectsTable.newApplicantsCount + 1,
        updatedAt: new Date(),
      }).where(eq(projectsTable.id, projectId));
      return row;
    }
  
    static async updateApplicantStatus({ projectId, userId, status }) {
      const [row] = await db
        .update(projectApplicantsTable)
        .set({ status, updatedAt: new Date() })
        .where(and(eq(projectApplicantsTable.projectId, projectId), eq(projectApplicantsTable.userId, userId)))
        .returning();
      return row;
    }
  
    static async listApplicants(projectId) {
      return await db
        .select()
        .from(projectApplicantsTable)
        .where(eq(projectApplicantsTable.projectId, projectId));
    }
  
    // Invites
    static async createInvite({ projectId, invitedEmail, invitedUserId, role, message }) {
      const [row] = await db.insert(projectInvitesTable).values({
        projectId, invitedEmail, invitedUserId, role, message, status: "pending",
      }).returning();
      return row;
    }
  
    static async respondInvite({ inviteId, status }) {
      const [row] = await db
        .update(projectInvitesTable)
        .set({ status, respondedAt: new Date() })
        .where(eq(projectInvitesTable.id, inviteId))
        .returning();
      return row;
    }
  
    // Files
    static async addFile({ projectId, uploaderId, name, url, mimeType, sizeKb }) {
      const [row] = await db.insert(projectFilesTable).values({
        projectId, uploaderId, name, url, mimeType, sizeKb,
      }).returning();
      return row;
    }
  
    // Updates
    static async addUpdate({ projectId, authorId, type = "note", message }) {
      const [row] = await db.insert(projectUpdatesTable).values({
        projectId, authorId, type, message,
      }).returning();
      return row;
    }
  
    // Reviews
    static async addReview({ projectId, reviewerId, rating, comment }) {
      const [row] = await db.insert(projectReviewsTable).values({
        projectId, reviewerId, rating, comment,
      }).returning();
  
      // update cached rating (simple recompute)
      const reviews = await db
        .select()
        .from(projectReviewsTable)
        .where(eq(projectReviewsTable.projectId, projectId));
      const count = reviews.length;
      const avg = count ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / count) : 0;
  
      await db.update(projectsTable).set({
        ratingAvg: String(avg.toFixed(2)),
        ratingCount: count,
        updatedAt: new Date(),
      }).where(eq(projectsTable.id, projectId));
      return row;
    }
  
    // Boosts
    static async addBoost({ projectId, purchasedBy, plan, amountCents, currency = "USD", startAt, endAt }) {
      const [row] = await db.insert(projectBoostsTable).values({
        projectId, purchasedBy, plan, amountCents, currency, startAt, endAt,
      }).returning();
  
      await db.update(projectsTable).set({
        isFeatured: true,
        featuredUntil: endAt,
        updatedAt: new Date(),
      }).where(eq(projectsTable.id, projectId));
  
      return row;
    }
  }
  
  module.exports = {
    // tables
    projectsTable,
    projectSkillsTable,
    projectTagsTable,
    projectApplicantsTable,
    projectInvitesTable,
    projectTeamTable,
    projectFilesTable,
    projectUpdatesTable,
    projectReviewsTable,
    projectBoostsTable,
    // model
    ProjectModel,
  };
  