const { pgTable, serial, text, integer, timestamp } = require("drizzle-orm/pg-core");
const { eq } = require("drizzle-orm");

const { db } = require("../config/database");
const { ProjectsModel, projectsTable } = require("./projects.model");

// Project Reviews table
const projectReviewsTable = pgTable("project_reviews", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(), // FK -> projects.id
  reviewerId: integer("reviewer_id").notNull(), // FK -> users.id
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Project Reviews Model Class
class ProjectReviewsModel {
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

    await ProjectsModel.updateRatingStats(projectId, avg, count);
    return row;
  }

  static async getReviewsByProjectId(projectId) {
    return await db
      .select()
      .from(projectReviewsTable)
      .where(eq(projectReviewsTable.projectId, projectId));
  }

  static async getReviewById(reviewId) {
    const [review] = await db
      .select()
      .from(projectReviewsTable)
      .where(eq(projectReviewsTable.id, reviewId));
    return review;
  }

  static async getReviewsByReviewer(reviewerId) {
    return await db
      .select()
      .from(projectReviewsTable)
      .where(eq(projectReviewsTable.reviewerId, reviewerId));
  }

  static async getReviewsByRating(projectId, rating) {
    return await db
      .select()
      .from(projectReviewsTable)
      .where(and(eq(projectReviewsTable.projectId, projectId), eq(projectReviewsTable.rating, rating)));
  }

  static async deleteReview(reviewId) {
    const [row] = await db
      .delete(projectReviewsTable)
      .where(eq(projectReviewsTable.id, reviewId))
      .returning();
    return row;
  }

  static async getAverageRating(projectId) {
    const reviews = await this.getReviewsByProjectId(projectId);
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  }
}

module.exports = {
  projectReviewsTable,
  ProjectReviewsModel,
};
