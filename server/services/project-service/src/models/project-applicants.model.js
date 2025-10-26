const { pgTable, serial, text, integer, timestamp, pgEnum, numeric } = require("drizzle-orm/pg-core");
const { eq, and } = require("drizzle-orm");

const { db } = require("../config/database");
const { projectsTable } = require("./projects.model");

// Enums
const applicantStatusEnum = pgEnum("applicant_status", [
  "applied",
  "shortlisted",
  "interviewing",
  "rejected",
  "accepted",
]);

// Project Applicants table
const projectApplicantsTable = pgTable("project_applicants", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(), // FK -> projects.id
  userId: integer("user_id").notNull(), // FK -> users.id
  status: applicantStatusEnum("status").default("applied").notNull(),
  matchScore: numeric("match_score"),
  rating: integer("rating"),
  notes: text("notes"),
  appliedAt: timestamp("applied_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Project Applicants Model Class
class ProjectApplicantsModel {
  static async applyToProject({ projectId, userId, matchScore, notes }) {
    const [row] = await db.insert(projectApplicantsTable).values({
      projectId, userId, matchScore, notes,
      status: "applied",
    }).returning();
    
    // bump counters (best effort) - lazy require to avoid circular dependency
    const { ProjectsModel } = require("./projects.model");
    await ProjectsModel.updateApplicantsCount(projectId, 1);
    return row;
  }

  static async withdrawApplication(projectId, userId) {
    // delete the application row and decrement counters
    const { db } = require("../config/database");
    const { and, eq } = require("drizzle-orm");
    const { ProjectsModel } = require("./projects.model");

    const [row] = await db
      .delete(projectApplicantsTable)
      .where(and(eq(projectApplicantsTable.projectId, projectId), eq(projectApplicantsTable.userId, userId)))
      .returning();

    if (row) {
      await ProjectsModel.updateApplicantsCount(projectId, -1);
    }

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
    const { sql } = require("drizzle-orm");
    
    // Get applicants with user profile information
    const applicants = await db.execute(sql`
      SELECT 
        pa.id,
        pa.project_id as "projectId",
        pa.user_id as "userId",
        pa.status,
        pa.match_score as "matchScore",
        pa.rating,
        pa.notes,
        pa.applied_at as "appliedAt",
        pa.updated_at as "updatedAt",
        u.name,
        u.email,
        u.bio,
        u.avatar_url as "avatarUrl",
        u.experience,
        u.location,
        u.availability,
        u.skills,
        u.github_url as "githubUrl",
        u.linkedin_url as "linkedinUrl",
        u.portfolio_url as "portfolioUrl",
        u.level,
        u.xp
      FROM project_applicants pa
      LEFT JOIN users u ON pa.user_id = u.id
      WHERE pa.project_id = ${projectId} AND u.is_deleted = false
      ORDER BY pa.applied_at DESC
    `);
    
    return applicants.rows || [];
  }

  static async getApplicantByProjectAndUser(projectId, userId) {
    const [applicant] = await db
      .select()
      .from(projectApplicantsTable)
      .where(and(eq(projectApplicantsTable.projectId, projectId), eq(projectApplicantsTable.userId, userId)));
    return applicant;
  }

  static async getApplicantsByStatus(projectId, status) {
    return await db
      .select()
      .from(projectApplicantsTable)
      .where(and(eq(projectApplicantsTable.projectId, projectId), eq(projectApplicantsTable.status, status)));
  }

  static async listApplicationsByUser(userId) {
    try {
      const applications = await db
        .select({
          id: projectApplicantsTable.id,
          projectId: projectApplicantsTable.projectId,
          userId: projectApplicantsTable.userId,
          status: projectApplicantsTable.status,
          matchScore: projectApplicantsTable.matchScore,
          rating: projectApplicantsTable.rating,
          notes: projectApplicantsTable.notes,
          appliedAt: projectApplicantsTable.appliedAt,
          updatedAt: projectApplicantsTable.updatedAt,
          // Project details
          projectTitle: projectsTable.title,
          projectDescription: projectsTable.description,
          projectCompany: projectsTable.company,
          projectStatus: projectsTable.status,
          projectCategory: projectsTable.category,
          projectExperienceLevel: projectsTable.experienceLevel,
          projectBudgetMin: projectsTable.budgetMin,
          projectBudgetMax: projectsTable.budgetMax,
          projectCurrency: projectsTable.currency,
          projectLocation: projectsTable.location,
          projectIsRemote: projectsTable.isRemote,
          projectDuration: projectsTable.duration,
          projectStartDate: projectsTable.startDate,
          projectDeadline: projectsTable.deadline,
          projectOwnerId: projectsTable.ownerId,
        })
        .from(projectApplicantsTable)
        .leftJoin(projectsTable, eq(projectApplicantsTable.projectId, projectsTable.id))
        .where(eq(projectApplicantsTable.userId, userId))
        .orderBy(projectApplicantsTable.appliedAt);

      // Filter out applications where project data is missing (due to deleted projects)
      return applications.filter(app => app.projectTitle !== null);
    } catch (error) {
      console.error('Error in listApplicationsByUser:', error);
      return [];
    }
  }

  static async countApplicationsByUser(userId) {
    const { sql } = require("drizzle-orm");
    const result = await db
      .select({ count: sql`count(*)` })
      .from(projectApplicantsTable)
      .where(eq(projectApplicantsTable.userId, userId));
    const countVal = Array.isArray(result) && result[0] && result[0].count != null ? Number(result[0].count) : 0;
    return countVal;
  }
}

module.exports = {
  projectApplicantsTable,
  ProjectApplicantsModel,
};
