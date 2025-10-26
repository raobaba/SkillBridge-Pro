const {
  pgTable,
  serial,
  integer,
  timestamp,
  boolean,
  unique,
} = require("drizzle-orm/pg-core");
const { eq, and } = require("drizzle-orm");

const { db } = require("../config/database");
const { projectsTable } = require("./projects.model");

// Project Saves (Bookmarks) table
const projectSavesTable = pgTable("project_saves", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // FK -> users.id
  projectId: integer("project_id").notNull(), // FK -> projects.id
  createdAt: timestamp("created_at").defaultNow().notNull(),
  isDeleted: boolean("is_deleted").default(false).notNull(),
}, (table) => ({
  uniqueUserProject: unique("unique_user_project_save").on(table.userId, table.projectId),
}));

class ProjectSavesModel {
  // Add project to saves
  static async addProjectSave(userId, projectId) {
    try {
      const existing = await this.getProjectSave(userId, projectId);
      if (existing) return existing;

      // If soft-deleted exists, restore
      const [any] = await db
        .select()
        .from(projectSavesTable)
        .where(and(
          eq(projectSavesTable.userId, Number(userId)),
          eq(projectSavesTable.projectId, Number(projectId))
        ));
      if (any && any.isDeleted) {
        const [restored] = await db
          .update(projectSavesTable)
          .set({ isDeleted: false, createdAt: new Date() })
          .where(and(
            eq(projectSavesTable.userId, Number(userId)),
            eq(projectSavesTable.projectId, Number(projectId))
          ))
          .returning();
        return restored;
      }

      const [save] = await db
        .insert(projectSavesTable)
        .values({ userId: Number(userId), projectId: Number(projectId) })
        .returning();
      return save;
    } catch (error) {
      if (error.code === '23505') {
        return await this.getProjectSave(userId, projectId);
      }
      throw error;
    }
  }

  // Remove project from saves (soft delete)
  static async removeProjectSave(userId, projectId) {
    const [save] = await db
      .update(projectSavesTable)
      .set({ isDeleted: true })
      .where(and(
        eq(projectSavesTable.userId, Number(userId)),
        eq(projectSavesTable.projectId, Number(projectId)),
        eq(projectSavesTable.isDeleted, false)
      ))
      .returning();
    return save;
  }

  // Get specific active save
  static async getProjectSave(userId, projectId) {
    const [save] = await db
      .select()
      .from(projectSavesTable)
      .where(and(
        eq(projectSavesTable.userId, Number(userId)),
        eq(projectSavesTable.projectId, Number(projectId)),
        eq(projectSavesTable.isDeleted, false)
      ));
    return save;
  }

  // Get user's active saves
  static async getUserSaves(userId) {
    return await db
      .select({
        id: projectSavesTable.id,
        userId: projectSavesTable.userId,
        projectId: projectSavesTable.projectId,
        createdAt: projectSavesTable.createdAt,
      })
      .from(projectSavesTable)
      .where(and(
        eq(projectSavesTable.userId, Number(userId)),
        eq(projectSavesTable.isDeleted, false)
      ));
  }

  // Get user's saved projects with details
  static async getUserSavedProjects(userId) {
    return await db
      .select({
        id: projectSavesTable.id,
        userId: projectSavesTable.userId,
        projectId: projectSavesTable.projectId,
        savedAt: projectSavesTable.createdAt,
        project: {
          id: projectsTable.id,
          uuid: projectsTable.uuid,
          title: projectsTable.title,
          description: projectsTable.description,
          roleNeeded: projectsTable.roleNeeded,
          status: projectsTable.status,
          priority: projectsTable.priority,
          category: projectsTable.category,
          experienceLevel: projectsTable.experienceLevel,
          budgetMin: projectsTable.budgetMin,
          budgetMax: projectsTable.budgetMax,
          currency: projectsTable.currency,
          isRemote: projectsTable.isRemote,
          location: projectsTable.location,
          duration: projectsTable.duration,
          startDate: projectsTable.startDate,
          deadline: projectsTable.deadline,
          requirements: projectsTable.requirements,
          benefits: projectsTable.benefits,
          company: projectsTable.company,
          website: projectsTable.website,
          isUrgent: projectsTable.isUrgent,
          isFeatured: projectsTable.isFeatured,
          maxApplicants: projectsTable.maxApplicants,
          language: projectsTable.language,
          timezone: projectsTable.timezone,
          matchScoreAvg: projectsTable.matchScoreAvg,
          ratingAvg: projectsTable.ratingAvg,
          ratingCount: projectsTable.ratingCount,
          applicantsCount: projectsTable.applicantsCount,
          newApplicantsCount: projectsTable.newApplicantsCount,
          subcategory: projectsTable.subcategory,
          contactEmail: projectsTable.contactEmail,
          contactPhone: projectsTable.contactPhone,
          color: projectsTable.color,
          progress: projectsTable.progress,
          workArrangement: projectsTable.workArrangement,
          visibility: projectsTable.visibility,
          paymentTerms: projectsTable.paymentTerms,
          activityCount: projectsTable.activityCount,
          viewsCount: projectsTable.viewsCount,
          favoritesCount: projectsTable.favoritesCount,
          sharesCount: projectsTable.sharesCount,
          disputesCount: projectsTable.disputesCount,
          isFlagged: projectsTable.isFlagged,
          isVerified: projectsTable.isVerified,
          isSuspended: projectsTable.isSuspended,
          suspensionReason: projectsTable.suspensionReason,
          verificationNotes: projectsTable.verificationNotes,
          lastActivityAt: projectsTable.lastActivityAt,
          boostLevel: projectsTable.boostLevel,
          createdAt: projectsTable.createdAt,
          updatedAt: projectsTable.updatedAt,
        }
      })
      .from(projectSavesTable)
      .innerJoin(projectsTable, eq(projectSavesTable.projectId, projectsTable.id))
      .where(and(
        eq(projectSavesTable.userId, Number(userId)),
        eq(projectSavesTable.isDeleted, false),
        eq(projectsTable.isDeleted, false)
      ));
  }
}

module.exports = {
  projectSavesTable,
  ProjectSavesModel,
};


