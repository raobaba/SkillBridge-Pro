const { pgTable, serial, integer, text, timestamp, boolean } = require("drizzle-orm/pg-core");
const { eq, and, or, desc, ne, isNull } = require("drizzle-orm");
const { db } = require("../config/database");

// Messages table
const messagesTable = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull(), // FK -> conversations.id
  senderId: integer("sender_id").notNull(), // FK -> users.id
  content: text("content").notNull(),
  messageType: text("message_type").default("text"), // text, file, image, audio, system
  fileUrl: text("file_url"), // For file/image/audio messages
  fileName: text("file_name"), // Original file name
  fileSize: integer("file_size"), // File size in bytes
  replyToId: integer("reply_to_id"), // FK -> messages.id (for replies)
  status: text("status").default("sent"), // sent, delivered, read
  isDeleted: boolean("is_deleted").default(false),
  deletedAt: timestamp("deleted_at"),
  isEdited: boolean("is_edited").default(false),
  editedAt: timestamp("edited_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

class MessagesModel {
  /**
   * Create a new message
   */
  static async createMessage({
    conversationId,
    senderId,
    content,
    messageType = "text",
    fileUrl,
    fileName,
    fileSize,
    replyToId,
  }) {
    const [message] = await db
      .insert(messagesTable)
      .values({
        conversationId: Number(conversationId),
        senderId: Number(senderId),
        content,
        messageType,
        fileUrl,
        fileName,
        fileSize,
        replyToId: replyToId ? Number(replyToId) : null,
        status: "sent",
      })
      .returning();

    // Update conversation's updatedAt
    const { conversationsTable } = require("./conversations.model");
    await db
      .update(conversationsTable)
      .set({ updatedAt: new Date() })
      .where(eq(conversationsTable.id, Number(conversationId)));

    // Increment unread count for all participants except sender
    const { conversationParticipantsTable } = require("./conversation-participants.model");
    const participants = await db
      .select()
      .from(conversationParticipantsTable)
      .where(
        and(
          eq(conversationParticipantsTable.conversationId, Number(conversationId)),
          ne(conversationParticipantsTable.userId, Number(senderId)),
          isNull(conversationParticipantsTable.leftAt) // Use isNull() for proper null checks
        )
      );

    for (const participant of participants) {
      await db
        .update(conversationParticipantsTable)
        .set({
          unreadCount: (participant.unreadCount || 0) + 1,
          updatedAt: new Date(),
        })
        .where(eq(conversationParticipantsTable.id, participant.id));
    }

    return message;
  }

  /**
   * Get messages for a conversation
   */
  static async getMessages(conversationId, limit = 50, offset = 0) {
    return await db
      .select()
      .from(messagesTable)
      .where(
        and(
          eq(messagesTable.conversationId, Number(conversationId)),
          eq(messagesTable.isDeleted, false)
        )
      )
      .orderBy(desc(messagesTable.createdAt))
      .limit(Number(limit))
      .offset(Number(offset));
  }

  /**
   * Get last message in conversation
   */
  static async getLastMessage(conversationId) {
    const [message] = await db
      .select()
      .from(messagesTable)
      .where(
        and(
          eq(messagesTable.conversationId, Number(conversationId)),
          eq(messagesTable.isDeleted, false)
        )
      )
      .orderBy(desc(messagesTable.createdAt))
      .limit(1);
    return message || null;
  }

  /**
   * Mark messages as read
   */
  static async markAsRead(conversationId, userId, messageIds = null) {
    const { MessageReadReceiptsModel } = require("./message-read-receipts.model");
    const { conversationParticipantsTable } = require("./conversation-participants.model");
    
    // If specific message IDs provided, mark only those
    if (messageIds && messageIds.length > 0) {
      // Create read receipts
      const readReceipts = messageIds.map((messageId) => ({
        messageId: Number(messageId),
        userId: Number(userId),
      }));
      
      if (readReceipts.length > 0) {
        await MessageReadReceiptsModel.createReadReceipts(readReceipts);

        // Update message status to 'read' if all participants have read it
        // This is a simplified version - in production, you'd check all participants
        await db
          .update(messagesTable)
          .set({ status: "read", updatedAt: new Date() })
          .where(eq(messagesTable.id, messageIds[0])); // Simplified
      }
    } else {
      // Mark all unread messages in conversation as read
      const unreadMessages = await db
        .select()
        .from(messagesTable)
        .where(
          and(
            eq(messagesTable.conversationId, Number(conversationId)),
            ne(messagesTable.senderId, Number(userId)),
            or(
              eq(messagesTable.status, "sent"),
              eq(messagesTable.status, "delivered")
            )
          )
        );

      if (unreadMessages.length > 0) {
        const messageIds = unreadMessages.map((m) => m.id);
        const readReceipts = messageIds.map((messageId) => ({
          messageId,
          userId: Number(userId),
        }));
        await MessageReadReceiptsModel.createReadReceipts(readReceipts);

        // Update message status
        await db
          .update(messagesTable)
          .set({ status: "read", updatedAt: new Date() })
          .where(eq(messagesTable.conversationId, Number(conversationId)));
      }
    }

    // Reset unread count for this user in this conversation
    await db
      .update(conversationParticipantsTable)
      .set({
        unreadCount: 0,
        lastReadAt: new Date(),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(conversationParticipantsTable.conversationId, Number(conversationId)),
          eq(conversationParticipantsTable.userId, Number(userId))
        )
      );

    return { success: true };
  }

  /**
   * Update message status (e.g., sent -> delivered -> read)
   */
  static async updateMessageStatus(messageId, status) {
    const [message] = await db
      .update(messagesTable)
      .set({ status, updatedAt: new Date() })
      .where(eq(messagesTable.id, Number(messageId)))
      .returning();
    return message;
  }

  /**
   * Delete message (soft delete)
   */
  static async deleteMessage(messageId, userId) {
    const [message] = await db
      .update(messagesTable)
      .set({
        isDeleted: true,
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(messagesTable.id, Number(messageId)),
          eq(messagesTable.senderId, Number(userId)) // Only sender can delete
        )
      )
      .returning();
    return message;
  }

  /**
   * Edit message
   */
  static async editMessage(messageId, userId, newContent) {
    const [message] = await db
      .update(messagesTable)
      .set({
        content: newContent,
        isEdited: true,
        editedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(messagesTable.id, Number(messageId)),
          eq(messagesTable.senderId, Number(userId)) // Only sender can edit
        )
      )
      .returning();
    return message;
  }

  /**
   * Get message by ID
   */
  static async getMessageById(messageId) {
    const [message] = await db
      .select()
      .from(messagesTable)
      .where(eq(messagesTable.id, Number(messageId)));
    return message;
  }
}

module.exports = {
  messagesTable,
  MessagesModel,
};

