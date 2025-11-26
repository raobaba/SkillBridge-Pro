const {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  json,
} = require("drizzle-orm/pg-core");

const { eq, and, desc, sql } = require("drizzle-orm");

const { db } = require("../config/database");

// Endorsements table - stores skill endorsements from project owners to developers
const endorsementsTable = pgTable("endorsements", {
  id: serial("id").primaryKey(),
  developerId: integer("developer_id").notNull(), // The developer being endorsed
  endorserId: integer("endorser_id").notNull(), // The project owner giving the endorsement
  projectId: integer("project_id"), // Optional: associated project
  skill: text("skill").notNull(), // The skill being endorsed
  rating: integer("rating").default(5), // Rating for this skill (1-5)
  message: text("message"), // Optional message/comment
  categories: json("categories"), // Store category ratings if provided
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Endorsements Model Class
class EndorsementsModel {
  /**
   * Create one or more endorsements
   * @param {Object} params - Endorsement data
   * @param {number} params.developerId - Developer being endorsed
   * @param {number} params.endorserId - Project owner giving endorsement
   * @param {number} params.projectId - Associated project (optional)
   * @param {string[]} params.skills - Array of skills to endorse
   * @param {number} params.rating - Overall rating (used for each skill)
   * @param {string} params.message - Optional message
   * @param {Object} params.categories - Optional category ratings
   */
  static async createEndorsements({
    developerId,
    endorserId,
    projectId,
    skills = [],
    rating = 5,
    message,
    categories,
  }) {
    if (!developerId || !endorserId || !skills || skills.length === 0) {
      throw new Error("developerId, endorserId, and skills are required");
    }

    const endorsements = [];
    for (const skill of skills) {
      const [endorsement] = await db
        .insert(endorsementsTable)
        .values({
          developerId: Number(developerId),
          endorserId: Number(endorserId),
          projectId: projectId ? Number(projectId) : null,
          skill: String(skill),
          rating: Number(rating),
          message: message || null,
          categories: categories || null,
        })
        .returning();
      endorsements.push(endorsement);
    }

    return endorsements;
  }

  /**
   * Get all endorsements for a developer
   * @param {number} developerId - Developer ID
   * @param {number} limit - Maximum number of endorsements to return
   * @returns {Promise<Array>} Array of endorsements with endorser info
   */
  static async getDeveloperEndorsements(developerId, limit = 10) {
    if (!developerId) {
      throw new Error("developerId is required");
    }

    // Query endorsements with endorser information
    const endorsements = await db.execute(sql`
      SELECT 
        e.id,
        e.developer_id as "developerId",
        e.endorser_id as "endorserId",
        e.project_id as "projectId",
        e.skill,
        e.rating,
        e.message,
        e.categories,
        e.created_at as "createdAt",
        e.updated_at as "updatedAt",
        u.name as "endorserName",
        u.avatar_url as "endorserAvatar",
        u.email as "endorserEmail",
        p.title as "projectTitle"
      FROM endorsements e
      LEFT JOIN users u ON e.endorser_id = u.id
      LEFT JOIN projects p ON e.project_id = p.id
      WHERE e.developer_id = ${Number(developerId)}
        AND u.is_deleted = false
      ORDER BY e.created_at DESC
      LIMIT ${Number(limit)}
    `);

    return endorsements.rows || [];
  }

  /**
   * Get endorsements grouped by skill with statistics
   * @param {number} developerId - Developer ID
   * @returns {Promise<Array>} Array of skills with endorsement stats
   */
  static async getDeveloperEndorsementsBySkill(developerId) {
    if (!developerId) {
      throw new Error("developerId is required");
    }

    const results = await db.execute(sql`
      SELECT 
        e.skill,
        COUNT(*) as "endorsementCount",
        AVG(e.rating)::numeric(3,1) as "averageRating",
        MAX(e.created_at) as "lastEndorsed"
      FROM endorsements e
      INNER JOIN users u ON e.endorser_id = u.id
      WHERE e.developer_id = ${Number(developerId)}
        AND u.is_deleted = false
      GROUP BY e.skill
      ORDER BY "endorsementCount" DESC, "averageRating" DESC
    `);

    return results.rows || [];
  }

  /**
   * Get total endorsement count for a developer
   * @param {number} developerId - Developer ID
   * @returns {Promise<number>} Total count of endorsements
   */
  static async getDeveloperEndorsementCount(developerId) {
    if (!developerId) {
      throw new Error("developerId is required");
    }

    const result = await db.execute(sql`
      SELECT COUNT(*) as count
      FROM endorsements e
      INNER JOIN users u ON e.endorser_id = u.id
      WHERE e.developer_id = ${Number(developerId)}
        AND u.is_deleted = false
    `);

    return Number(result.rows[0]?.count || 0);
  }

  /**
   * Delete an endorsement
   * @param {number} endorsementId - Endorsement ID
   * @param {number} endorserId - Endorser ID (for authorization)
   * @returns {Promise<Object>} Deleted endorsement
   */
  static async deleteEndorsement(endorsementId, endorserId) {
    const [endorsement] = await db
      .delete(endorsementsTable)
      .where(
        and(
          eq(endorsementsTable.id, Number(endorsementId)),
          eq(endorsementsTable.endorserId, Number(endorserId))
        )
      )
      .returning();

    return endorsement;
  }

  /**
   * Get endorsements by project
   * @param {number} projectId - Project ID
   * @returns {Promise<Array>} Array of endorsements
   */
  static async getEndorsementsByProject(projectId) {
    const endorsements = await db
      .select()
      .from(endorsementsTable)
      .where(eq(endorsementsTable.projectId, Number(projectId)))
      .orderBy(desc(endorsementsTable.createdAt));

    return endorsements;
  }
}

module.exports = {
  endorsementsTable,
  EndorsementsModel,
};

