const { pgTable, serial, text, integer, timestamp, boolean } = require("drizzle-orm/pg-core");
const { eq, and, desc, asc, sql } = require("drizzle-orm");
const { db } = require("../config/database");
const { projectTasksTable } = require("./project-tasks.model");

// Task Comments table - for discussions on tasks
const taskCommentsTable = pgTable("task_comments", {
  id: serial("id").primaryKey(),
  taskId: integer("task_id").notNull().references(() => projectTasksTable.id, { onDelete: "cascade" }), // FK -> project_tasks.id
  userId: integer("user_id").notNull(), // FK -> users.id (comment author)
  comment: text("comment").notNull(),
  parentCommentId: integer("parent_comment_id"), // For replies/threading
  isEdited: boolean("is_edited").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Task Comments Model Class
class TaskCommentsModel {
  static async createComment({ taskId, userId, comment, parentCommentId }) {
    const [row] = await db.insert(taskCommentsTable).values({
      taskId,
      userId,
      comment,
      parentCommentId: parentCommentId || null,
    }).returning();
    return row;
  }

  static async getCommentById(commentId) {
    const [comment] = await db
      .select()
      .from(taskCommentsTable)
      .where(eq(taskCommentsTable.id, commentId));
    return comment;
  }

  static async getCommentsByTaskId(taskId) {
    return await db
      .select()
      .from(taskCommentsTable)
      .where(eq(taskCommentsTable.taskId, taskId))
      .orderBy(asc(taskCommentsTable.createdAt));
  }

  static async getCommentsByUser(userId, options = {}) {
    const { limit } = options;
    let query = db
      .select()
      .from(taskCommentsTable)
      .where(eq(taskCommentsTable.userId, userId))
      .orderBy(desc(taskCommentsTable.createdAt));
    
    if (limit) {
      query = query.limit(limit);
    }
    
    return await query;
  }

  static async updateComment(commentId, userId, comment) {
    // Verify ownership
    const existingComment = await this.getCommentById(commentId);
    if (!existingComment || existingComment.userId !== userId) {
      throw new Error("You can only edit your own comments");
    }
    
    const [row] = await db
      .update(taskCommentsTable)
      .set({
        comment,
        isEdited: true,
        updatedAt: new Date(),
      })
      .where(eq(taskCommentsTable.id, commentId))
      .returning();
    return row;
  }

  static async deleteComment(commentId, userId) {
    // Verify ownership
    const existingComment = await this.getCommentById(commentId);
    if (!existingComment || existingComment.userId !== userId) {
      throw new Error("You can only delete your own comments");
    }
    
    const [row] = await db
      .delete(taskCommentsTable)
      .where(eq(taskCommentsTable.id, commentId))
      .returning();
    return row;
  }

  static async getCommentCount(taskId) {
    const result = await db
      .select({ count: sql`count(*)::int` })
      .from(taskCommentsTable)
      .where(eq(taskCommentsTable.taskId, taskId));
    return Number(result[0]?.count || 0);
  }
}

module.exports = {
  taskCommentsTable,
  TaskCommentsModel,
};

