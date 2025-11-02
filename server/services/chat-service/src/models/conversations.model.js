const { pgTable, serial, integer, text, timestamp, boolean, pgEnum } = require("drizzle-orm/pg-core");
const { eq, and, desc, ne } = require("drizzle-orm");
const { db } = require("../config/database");

// Enum for conversation types
const conversationTypeEnum = pgEnum("conversation_type", [
  "direct",
  "group",
  "system",
  "moderation"
]);

// Enum for conversation status
const conversationStatusEnum = pgEnum("conversation_status", [
  "active",
  "archived",
  "deleted"
]);

// Conversations table - represents a chat/conversation
const conversationsTable = pgTable("conversations", {
  id: serial("id").primaryKey(),
  type: conversationTypeEnum("type").default("direct").notNull(),
  name: text("name"), // For group chats, null for direct messages
  projectId: integer("project_id"), // Optional: associated with a project
  status: conversationStatusEnum("status").default("active").notNull(),
  isFlagged: boolean("is_flagged").default(false), // For moderation
  flaggedReason: text("flagged_reason"), // Reason for flagging
  flaggedAt: timestamp("flagged_at"), // When it was flagged
  flaggedBy: integer("flagged_by"), // Admin who flagged it
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

class ConversationsModel {
  /**
   * Create a new conversation
   */
  static async createConversation({ type, name, projectId, createdBy }) {
    const [conversation] = await db
      .insert(conversationsTable)
      .values({
        type,
        name,
        projectId,
      })
      .returning();

    // Add creator as participant
    if (conversation && createdBy) {
      const { conversationParticipantsTable } = require("./conversation-participants.model");
      await db.insert(conversationParticipantsTable).values({
        conversationId: conversation.id,
        userId: createdBy,
        role: type === "group" ? "admin" : "member",
      });
    }

    return conversation;
  }

  /**
   * Get conversation by ID
   */
  static async getConversationById(conversationId) {
    const [conversation] = await db
      .select()
      .from(conversationsTable)
      .where(eq(conversationsTable.id, conversationId));
    return conversation;
  }

  /**
   * Get or create direct conversation between two users
   */
  static async getOrCreateDirectConversation(userId1, userId2) {
    const { conversationParticipantsTable } = require("./conversation-participants.model");
    
    // Check if conversation already exists
    const existingRaw = await db
      .select({
        conversations: conversationsTable,
        participants: conversationParticipantsTable,
      })
      .from(conversationsTable)
      .innerJoin(
        conversationParticipantsTable,
        eq(conversationsTable.id, conversationParticipantsTable.conversationId)
      )
      .where(
        and(
          eq(conversationsTable.type, "direct"),
          eq(conversationParticipantsTable.userId, Number(userId1))
        )
      );
    
    const existing = existingRaw.map(row => ({
      conversations: row.conversations,
      participants: row.participants
    }));

    // Check if any of these conversations also has userId2
    for (const conv of existing) {
      const participants = await db
        .select()
        .from(conversationParticipantsTable)
        .where(
          and(
            eq(conversationParticipantsTable.conversationId, conv.conversations.id),
            eq(conversationParticipantsTable.leftAt, null)
          )
        );

      const participantIds = participants.map((p) => Number(p.userId));
      if (participantIds.includes(Number(userId1)) && participantIds.includes(Number(userId2)) && participants.length === 2) {
        return conv.conversations;
      }
    }

    // Create new conversation
    const conversation = await this.createConversation({
      type: "direct",
      createdBy: userId1,
    });

    // Add both participants (creator already added, so add the other user)
    const { conversationParticipantsTable: cpTable } = require("./conversation-participants.model");
    await db.insert(cpTable).values({
      conversationId: conversation.id,
      userId: Number(userId2),
    });

    return conversation;
  }

  /**
   * Get conversations for a user
   */
  static async getConversationsByUser(userId, filters = {}) {
    const { conversationParticipantsTable } = require("./conversation-participants.model");
    const { type, archived, favorites, flagged, search } = filters;

    // Build where conditions array
    const conditions = [
      eq(conversationParticipantsTable.userId, Number(userId)),
      eq(conversationParticipantsTable.leftAt, null),
    ];

    if (archived !== undefined) {
      conditions.push(eq(conversationParticipantsTable.isArchived, archived));
    }
    if (favorites !== undefined) {
      conditions.push(eq(conversationParticipantsTable.isFavorite, favorites));
    }
    if (flagged !== undefined) {
      conditions.push(eq(conversationsTable.isFlagged, flagged));
    }
    if (type) {
      conditions.push(eq(conversationsTable.type, type));
    }

    const results = await db
      .select({
        conversation: conversationsTable,
        participant: conversationParticipantsTable,
      })
      .from(conversationParticipantsTable)
      .innerJoin(
        conversationsTable,
        eq(conversationParticipantsTable.conversationId, conversationsTable.id)
      )
      .where(conditions.length > 1 ? and(...conditions) : conditions[0])
      .orderBy(desc(conversationsTable.updatedAt));

    // Get last message for each conversation
    const conversationsWithLastMessage = await Promise.all(
      results.map(async (result) => {
        const { MessagesModel } = require("./messages.model");
        const lastMessage = await MessagesModel.getLastMessage(result.conversation.id);
        
        // Get other participants for direct messages
        let otherParticipants = [];
        if (result.conversation.type === "direct") {
          const participants = await db
            .select()
            .from(conversationParticipantsTable)
            .where(
              and(
                eq(conversationParticipantsTable.conversationId, result.conversation.id),
                ne(conversationParticipantsTable.userId, Number(userId)),
                eq(conversationParticipantsTable.leftAt, null)
              )
            );
          otherParticipants = participants;
        }

        return {
          ...result.conversation,
          participant: result.participant,
          lastMessage,
          otherParticipants,
        };
      })
    );

    return conversationsWithLastMessage;
  }

  /**
   * Flag conversation for moderation
   */
  static async flagConversation(conversationId, flaggedBy, reason) {
    const [conversation] = await db
      .update(conversationsTable)
      .set({
        isFlagged: true,
        flaggedReason: reason,
        flaggedAt: new Date(),
        flaggedBy,
        updatedAt: new Date(),
      })
      .where(eq(conversationsTable.id, conversationId))
      .returning();
    return conversation;
  }

  /**
   * Unflag conversation
   */
  static async unflagConversation(conversationId) {
    const [conversation] = await db
      .update(conversationsTable)
      .set({
        isFlagged: false,
        flaggedReason: null,
        flaggedAt: null,
        flaggedBy: null,
        updatedAt: new Date(),
      })
      .where(eq(conversationsTable.id, conversationId))
      .returning();
    return conversation;
  }

  /**
   * Update conversation updatedAt timestamp
   */
  static async updateTimestamp(conversationId) {
    await db
      .update(conversationsTable)
      .set({ updatedAt: new Date() })
      .where(eq(conversationsTable.id, conversationId));
  }
}

module.exports = {
  conversationsTable,
  conversationTypeEnum,
  conversationStatusEnum,
  ConversationsModel,
};
