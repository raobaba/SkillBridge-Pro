const { pgTable, serial, text, integer, timestamp, boolean } = require("drizzle-orm/pg-core");
const { eq, and } = require("drizzle-orm");

const { db } = require("../config/database");

// Project Notifications table
const projectNotificationsTable = pgTable("project_notifications", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(), // FK -> projects.id
  userId: integer("user_id").notNull(), // FK -> users.id
  type: text("type").notNull(), // application, update, comment, deadline, etc.
  title: text("title").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Project Notifications Model Class
class ProjectNotificationsModel {
  static async addNotification({ projectId, userId, type, title, message }) {
    const [row] = await db.insert(projectNotificationsTable).values({
      projectId, userId, type, title, message,
    }).returning();
    return row;
  }

  static async getNotificationsByUserId(userId) {
    return await db
      .select()
      .from(projectNotificationsTable)
      .where(eq(projectNotificationsTable.userId, userId))
      .orderBy(projectNotificationsTable.createdAt);
  }

  static async getNotificationsByProjectId(projectId) {
    return await db
      .select()
      .from(projectNotificationsTable)
      .where(eq(projectNotificationsTable.projectId, projectId));
  }

  static async markAsRead(notificationId) {
    const [row] = await db
      .update(projectNotificationsTable)
      .set({ isRead: true })
      .where(eq(projectNotificationsTable.id, notificationId))
      .returning();
    return row;
  }

  static async markAllAsRead(userId) {
    await db
      .update(projectNotificationsTable)
      .set({ isRead: true })
      .where(eq(projectNotificationsTable.userId, userId));
  }

  static async getUnreadCount(userId) {
    const result = await db
      .select()
      .from(projectNotificationsTable)
      .where(and(eq(projectNotificationsTable.userId, userId), eq(projectNotificationsTable.isRead, false)));
    return result.length;
  }

  static async deleteNotification(notificationId) {
    const [row] = await db
      .delete(projectNotificationsTable)
      .where(eq(projectNotificationsTable.id, notificationId))
      .returning();
    return row;
  }
}

module.exports = {
  projectNotificationsTable,
  ProjectNotificationsModel,
};
