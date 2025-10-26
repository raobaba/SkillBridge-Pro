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

// Project Favorites table
const projectFavoritesTable = pgTable("project_favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // FK -> users.id
  projectId: integer("project_id").notNull(), // FK -> projects.id
  createdAt: timestamp("created_at").defaultNow().notNull(),
  isDeleted: boolean("is_deleted").default(false).notNull(),
}, (table) => ({
  // Ensure unique combination of user and project
  uniqueUserProject: unique("unique_user_project").on(table.userId, table.projectId),
}));

// Project Favorites Model Class
class ProjectFavoritesModel {
  // Add project to favorites
  static async addProjectFavorite(userId, projectId) {
    try {
      // Check if already exists
      const existing = await this.getProjectFavorite(userId, projectId);
      if (existing) {
        return existing; // Already favorited
      }

      // If a soft-deleted row exists, undelete it instead of inserting
      const softDeleted = await this.getAnyFavorite(userId, projectId);
      if (softDeleted && softDeleted.isDeleted) {
        const [restored] = await db
          .update(projectFavoritesTable)
          .set({ isDeleted: false, createdAt: new Date() })
          .where(
            and(
              eq(projectFavoritesTable.userId, Number(userId)),
              eq(projectFavoritesTable.projectId, Number(projectId))
            )
          )
          .returning();
        return restored;
      }

      const [favorite] = await db
        .insert(projectFavoritesTable)
        .values({
          userId: Number(userId),
          projectId: Number(projectId),
        })
        .returning();

      return favorite;
    } catch (error) {
      // Handle unique constraint violation
      if (error.code === '23505') {
        // On race, return current active favorite
        return await this.getProjectFavorite(userId, projectId);
      }
      throw error;
    }
  }

  // Remove project from favorites
  static async removeProjectFavorite(userId, projectId) {
    const [favorite] = await db
      .update(projectFavoritesTable)
      .set({ isDeleted: true })
      .where(
        and(
          eq(projectFavoritesTable.userId, Number(userId)),
          eq(projectFavoritesTable.projectId, Number(projectId)),
          eq(projectFavoritesTable.isDeleted, false)
        )
      )
      .returning();

    return favorite;
  }

  // Get specific project favorite
  static async getProjectFavorite(userId, projectId) {
    const [favorite] = await db
      .select()
      .from(projectFavoritesTable)
      .where(
        and(
          eq(projectFavoritesTable.userId, Number(userId)),
          eq(projectFavoritesTable.projectId, Number(projectId)),
          eq(projectFavoritesTable.isDeleted, false)
        )
      );

    return favorite;
  }

  // Get favorite regardless of deletion status (for upsert logic)
  static async getAnyFavorite(userId, projectId) {
    const [favorite] = await db
      .select()
      .from(projectFavoritesTable)
      .where(
        and(
          eq(projectFavoritesTable.userId, Number(userId)),
          eq(projectFavoritesTable.projectId, Number(projectId))
        )
      );
    return favorite;
  }

  // Get all favorites for a user
  static async getUserFavorites(userId) {
    const favorites = await db
      .select({
        id: projectFavoritesTable.id,
        userId: projectFavoritesTable.userId,
        projectId: projectFavoritesTable.projectId,
        createdAt: projectFavoritesTable.createdAt,
      })
      .from(projectFavoritesTable)
      .where(
        and(
          eq(projectFavoritesTable.userId, Number(userId)),
          eq(projectFavoritesTable.isDeleted, false)
        )
      );

    return favorites;
  }

  // Get favorite projects with project details
  static async getUserFavoriteProjects(userId) {
    
    const favoriteProjects = await db
      .select({
        id: projectFavoritesTable.id,
        userId: projectFavoritesTable.userId,
        projectId: projectFavoritesTable.projectId,
        favoritedAt: projectFavoritesTable.createdAt,
        // Project details
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
      .from(projectFavoritesTable)
      .innerJoin(projectsTable, eq(projectFavoritesTable.projectId, projectsTable.id))
      .where(
        and(
          eq(projectFavoritesTable.userId, Number(userId)),
          eq(projectFavoritesTable.isDeleted, false),
          eq(projectsTable.isDeleted, false)
        )
      );

    return favoriteProjects;
  }

  // Check if project is favorited by user
  static async isProjectFavorited(userId, projectId) {
    const favorite = await this.getProjectFavorite(userId, projectId);
    return !!favorite;
  }

  // Get favorites count for a project
  static async getProjectFavoritesCount(projectId) {
    const result = await db
      .select({ count: projectFavoritesTable.id })
      .from(projectFavoritesTable)
      .where(
        and(
          eq(projectFavoritesTable.projectId, Number(projectId)),
          eq(projectFavoritesTable.isDeleted, false)
        )
      );

    return result.length;
  }
}

module.exports = {
  projectFavoritesTable,
  ProjectFavoritesModel,
};
