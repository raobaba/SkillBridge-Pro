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
  /**
   * Apply to a project - stores userId and projectId in project_applicants table
   * @param {Object} params - Application parameters
   * @param {number} params.projectId - The project ID
   * @param {number} params.userId - The user ID (from authenticated user, not from body)
   * @param {string} params.matchScore - Optional match score
   * @param {string} params.notes - Optional application notes
   * @returns {Promise<Object>} - The inserted row with id, projectId, userId, status, etc.
   */
  static async applyToProject({ projectId, userId, matchScore, notes }) {
    console.log('ProjectApplicantsModel.applyToProject - Inserting into project_applicants table:', {
      projectId,
      userId,
      status: 'applied',
      matchScore: matchScore || null,
      notes: notes || null
    });
    
    // Insert into project_applicants table with user_id and project_id
    // Database schema: { id, project_id, user_id, status, match_score, notes, applied_at, updated_at }
    const [row] = await db.insert(projectApplicantsTable).values({
      projectId,      // Stored as project_id in database
      userId,         // Stored as user_id in database (this is the authenticated developer's ID)
      matchScore, 
      notes,
      status: "applied",
    }).returning();
    
    console.log('ProjectApplicantsModel.applyToProject - Successfully inserted:', {
      id: row?.id,
      projectId: row?.projectId,
      userId: row?.userId,
      status: row?.status,
      appliedAt: row?.appliedAt
    });
    
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
    // Validate projectId
    const validatedProjectId = Number(projectId);
    if (!validatedProjectId || isNaN(validatedProjectId)) {
      console.error('listApplicants - Invalid projectId:', projectId);
      return [];
    }

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
      WHERE pa.project_id = ${validatedProjectId} AND u.is_deleted = false
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
      console.log('listApplicationsByUser - userId:', userId);
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
      const filteredApplications = applications.filter(app => app.projectTitle !== null);
      console.log('listApplicationsByUser - raw applications:', applications?.length);
      console.log('listApplicationsByUser - filtered applications:', filteredApplications?.length);
      return filteredApplications;
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

  /**
   * Get project IDs with status from project_applicants table for a specific user
   * Lightweight query - returns project IDs with their application status
   * @param {number} userId - The user ID
   * @returns {Promise<{userId: number, projectIds: Array<{projectId: number, status: string}>}>} - Object with userId and array of project IDs with status
   */
  static async getAppliedProjectIdsByUser(userId) {
    try {
      // Validate userId is provided and is a number
      const validatedUserId = Number(userId);
      if (!validatedUserId || isNaN(validatedUserId)) {
        console.error('getAppliedProjectIdsByUser - Invalid userId:', userId);
        return {
          userId: null,
          projectIds: [],
        };
      }

      console.log('getAppliedProjectIdsByUser - Querying project_applicants table for userId:', validatedUserId);
      
      // Query project_applicants table with explicit WHERE clause filtering by user_id
      // Now also selecting status along with projectId
      const applications = await db
        .select({
          projectId: projectApplicantsTable.projectId,
          userId: projectApplicantsTable.userId,
          status: projectApplicantsTable.status, // ✅ Added status
        })
        .from(projectApplicantsTable)
        .where(eq(projectApplicantsTable.userId, validatedUserId));

      console.log('getAppliedProjectIdsByUser - Raw results count:', applications?.length || 0);
      console.log('getAppliedProjectIdsByUser - Raw results (first 5):', applications?.slice(0, 5));

      // Map to include both projectId and status
      // Return array of objects with projectId and status for ALL applications
      // Always include status regardless of whether it's "applied" or changed
      const projectIdsWithStatus = applications
        .map(app => ({
          projectId: app.projectId,
          status: app.status || 'applied', // ✅ Always include status for all applications
        }))
        .filter(item => typeof item.projectId === 'number' && !isNaN(item.projectId));

      console.log('getAppliedProjectIdsByUser - Filtered projectIds with status (all applications):', projectIdsWithStatus);

      return {
        userId: validatedUserId,
        projectIds: projectIdsWithStatus, // ✅ Returns array of {projectId, status} objects for all applications
      };
    } catch (error) {
      console.error('Error in getAppliedProjectIdsByUser:', error);
      return {
        userId: Number(userId) || null,
        projectIds: [],
      };
    }
  }
}

module.exports = {
  projectApplicantsTable,
  ProjectApplicantsModel,
};
