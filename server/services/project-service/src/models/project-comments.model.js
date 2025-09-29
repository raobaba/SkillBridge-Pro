const { pgTable, serial, text, integer, timestamp, boolean } = require("drizzle-orm/pg-core");
const { eq, and } = require("drizzle-orm");

const { db } = require("../config/database");
const { projectsTable } = require("./projects.model");

// Project Comments table
const projectCommentsTable = pgTable("project_comments", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projectsTable.id, { onDelete: "cascade" }), // FK -> projects.id
  userId: integer("user_id").notNull(), // FK -> users.id
  parentId: integer("parent_id"), // FK -> project_comments.id (for replies)
  content: text("content").notNull(),
  isEdited: boolean("is_edited").default(false),
  editedAt: timestamp("edited_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Project Comments Model Class
class ProjectCommentsModel {
  static async addComment({ projectId, userId, parentId, content }) {
    const [row] = await db.insert(projectCommentsTable).values({
      projectId, userId, parentId, content,
    }).returning();
    return row;
  }

  static async getCommentsByProjectId(projectId) {
    return await db
      .select()
      .from(projectCommentsTable)
      .where(eq(projectCommentsTable.projectId, projectId))
      .orderBy(projectCommentsTable.createdAt);
  }

  static async getCommentById(commentId) {
    const [comment] = await db
      .select()
      .from(projectCommentsTable)
      .where(eq(projectCommentsTable.id, commentId));
    return comment;
  }

  static async getRepliesByParentId(parentId) {
    return await db
      .select()
      .from(projectCommentsTable)
      .where(eq(projectCommentsTable.parentId, parentId))
      .orderBy(projectCommentsTable.createdAt);
  }

  static async updateComment(commentId, content) {
    const [row] = await db
      .update(projectCommentsTable)
      .set({ 
        content, 
        isEdited: true, 
        editedAt: new Date() 
      })
      .where(eq(projectCommentsTable.id, commentId))
      .returning();
    return row;
  }

  static async deleteComment(commentId) {
    const [row] = await db
      .delete(projectCommentsTable)
      .where(eq(projectCommentsTable.id, commentId))
      .returning();
    return row;
  }

  static async getCommentsByUserId(userId) {
    return await db
      .select()
      .from(projectCommentsTable)
      .where(eq(projectCommentsTable.userId, userId));
  }
}

module.exports = {
  projectCommentsTable,
  ProjectCommentsModel,
};
