const { pgTable, serial, text, integer, timestamp, pgEnum, numeric } = require("drizzle-orm/pg-core");
const { eq, and } = require("drizzle-orm");

const { db } = require("../config/database");
const { ProjectsModel } = require("./projects.model");

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
    
    // bump counters (best effort)
    await ProjectsModel.updateApplicantsCount(projectId, 1);
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
}

module.exports = {
  projectApplicantsTable,
  ProjectApplicantsModel,
};
