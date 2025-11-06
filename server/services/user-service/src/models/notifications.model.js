const { pgTable, serial, text, integer, timestamp, boolean, pgEnum } = require("drizzle-orm/pg-core");
const { eq, and, desc, ne, or, isNull } = require("drizzle-orm");
const { db } = require("../config/database");

// Enum for notification types
const notificationTypeEnum = pgEnum("notification_type", [
  "Project Match",
  "Application Update",
  "Invitation",
  "Task Deadline",
  "Chat Message",
  "Endorsement",
  "Review",
  "Career Opportunity",
  "New Applicant",
  "Recommended Developer",
  "Project Update",
  "Billing Reminder",
  "Project Milestone",
  "Team Invitation",
  "Budget Alert",
  "Flagged User",
  "Dispute Report",
  "System Alert",
  "Billing Alert",
  "Moderation Task",
  "Security Alert",
  "Platform Health",
  "User Verification",
  "Feature Request",
  "Compliance Alert",
  "Other"
]);

// Enum for notification priority
const notificationPriorityEnum = pgEnum("notification_priority", ["high", "medium", "low"]);

// General Notifications table
const notificationsTable = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // FK -> users.id
  type: notificationTypeEnum("type").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  category: text("category"), // match, application, invitation, deadline, chat, etc.
  priority: notificationPriorityEnum("priority").default("medium"),
  read: boolean("read").default(false),
  action: text("action"), // Optional action text like "View Projects", "Respond", etc.
  actionUrl: text("action_url"), // Optional URL to navigate when action is clicked
  relatedEntityId: integer("related_entity_id"), // Optional: ID of related entity (project, application, etc.)
  relatedEntityType: text("related_entity_type"), // Optional: Type of related entity (project, application, etc.)
  metadata: text("metadata"), // Optional: JSON string for additional data
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
  archivedAt: timestamp("archived_at"), // Soft delete/archive
});

class NotificationsModel {
  /**
   * Create a new notification
   */
  static async createNotification({
    userId,
    type,
    title,
    message,
    category,
    priority = "medium",
    action,
    actionUrl,
    relatedEntityId,
    relatedEntityType,
    metadata,
  }) {
    const [notification] = await db
      .insert(notificationsTable)
      .values({
        userId: Number(userId),
        type,
        title,
        message,
        category: category || null,
        priority,
        action: action || null,
        actionUrl: actionUrl || null,
        relatedEntityId: relatedEntityId ? Number(relatedEntityId) : null,
        relatedEntityType: relatedEntityType || null,
        metadata: metadata ? JSON.stringify(metadata) : null,
        read: false,
      })
      .returning();

    return notification;
  }

  /**
   * Get notifications for a user
   */
  static async getNotificationsByUserId(userId, filters = {}) {
    const { type, category, read, priority, archived = false, limit = 100, offset = 0 } = filters;

    const conditions = [eq(notificationsTable.userId, Number(userId))];

    if (type) {
      conditions.push(eq(notificationsTable.type, type));
    }

    if (category) {
      conditions.push(eq(notificationsTable.category, category));
    }

    if (read !== undefined) {
      conditions.push(eq(notificationsTable.read, read));
    }

    if (priority) {
      conditions.push(eq(notificationsTable.priority, priority));
    }

    if (!archived) {
      conditions.push(isNull(notificationsTable.archivedAt));
    }

    const notifications = await db
      .select()
      .from(notificationsTable)
      .where(and(...conditions))
      .orderBy(desc(notificationsTable.createdAt))
      .limit(Number(limit))
      .offset(Number(offset));

    // Parse metadata if it exists
    return notifications.map(notif => ({
      ...notif,
      metadata: notif.metadata ? JSON.parse(notif.metadata) : null,
    }));
  }

  /**
   * Get notification by ID
   */
  static async getNotificationById(notificationId) {
    const [notification] = await db
      .select()
      .from(notificationsTable)
      .where(eq(notificationsTable.id, Number(notificationId)));

    if (notification && notification.metadata) {
      notification.metadata = JSON.parse(notification.metadata);
    }

    return notification;
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId) {
    const [notification] = await db
      .update(notificationsTable)
      .set({
        read: true,
        updatedAt: new Date(),
      })
      .where(eq(notificationsTable.id, Number(notificationId)))
      .returning();

    return notification;
  }

  /**
   * Mark all notifications as read for a user
   */
  static async markAllAsRead(userId) {
    await db
      .update(notificationsTable)
      .set({
        read: true,
        updatedAt: new Date(),
      })
      .where(and(
        eq(notificationsTable.userId, Number(userId)),
        eq(notificationsTable.read, false),
        isNull(notificationsTable.archivedAt)
      ));
  }

  /**
   * Get unread count for a user
   */
  static async getUnreadCount(userId) {
    const result = await db
      .select()
      .from(notificationsTable)
      .where(and(
        eq(notificationsTable.userId, Number(userId)),
        eq(notificationsTable.read, false),
        isNull(notificationsTable.archivedAt)
      ));

    // Return count of unread notifications
    return result ? result.length : 0;
  }

  /**
   * Delete notification (soft delete - archive)
   */
  static async deleteNotification(notificationId) {
    const [notification] = await db
      .update(notificationsTable)
      .set({
        archivedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(notificationsTable.id, Number(notificationId)))
      .returning();

    return notification;
  }

  /**
   * Delete all notifications for a user (soft delete)
   */
  static async deleteAllNotifications(userId) {
    await db
      .update(notificationsTable)
      .set({
        archivedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(and(
        eq(notificationsTable.userId, Number(userId)),
        isNull(notificationsTable.archivedAt)
      ));
  }

  /**
   * Update notification
   */
  static async updateNotification(notificationId, updates) {
    const updateData = {
      ...updates,
      updatedAt: new Date(),
    };

    if (updates.metadata && typeof updates.metadata === 'object') {
      updateData.metadata = JSON.stringify(updates.metadata);
    }

    const [notification] = await db
      .update(notificationsTable)
      .set(updateData)
      .where(eq(notificationsTable.id, Number(notificationId)))
      .returning();

    if (notification && notification.metadata) {
      notification.metadata = JSON.parse(notification.metadata);
    }

    return notification;
  }
}

module.exports = {
  notificationsTable,
  NotificationsModel,
};

