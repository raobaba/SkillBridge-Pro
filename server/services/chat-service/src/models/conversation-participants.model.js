const { pgTable, serial, integer, text, timestamp, boolean } = require("drizzle-orm/pg-core");
const { eq, and, ne } = require("drizzle-orm");
const { db } = require("../config/database");

// Conversation Participants table - users in a conversation
const conversationParticipantsTable = pgTable("conversation_participants", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull(), // FK -> conversations.id
  userId: integer("user_id").notNull(), // FK -> users.id
  role: text("role").default("member"), // member, admin (for groups)
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
  lastReadAt: timestamp("last_read_at"), // Last time user read messages
  unreadCount: integer("unread_count").default(0), // Unread message count
  isArchived: boolean("is_archived").default(false),
  isFavorite: boolean("is_favorite").default(false),
  isMuted: boolean("is_muted").default(false),
  leftAt: timestamp("left_at"), // When user left (null if still in conversation)
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

class ConversationParticipantsModel {
  /**
   * Add participant to conversation
   */
  static async addParticipant(conversationId, userId, role = "member") {
    const [participant] = await db
      .insert(conversationParticipantsTable)
      .values({
        conversationId: Number(conversationId),
        userId: Number(userId),
        role,
      })
      .returning();
    return participant;
  }

  /**
   * Remove participant from conversation
   */
  static async removeParticipant(conversationId, userId) {
    const [participant] = await db
      .update(conversationParticipantsTable)
      .set({
        leftAt: new Date(),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(conversationParticipantsTable.conversationId, Number(conversationId)),
          eq(conversationParticipantsTable.userId, Number(userId))
        )
      )
      .returning();
    return participant;
  }

  /**
   * Update participant settings
   */
  static async updateParticipant(conversationId, userId, updates) {
    const [participant] = await db
      .update(conversationParticipantsTable)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(conversationParticipantsTable.conversationId, Number(conversationId)),
          eq(conversationParticipantsTable.userId, Number(userId))
        )
      )
      .returning();
    return participant;
  }

  /**
   * Get participants of a conversation
   */
  static async getParticipantsByConversationId(conversationId, excludeUserId = null) {
    const conditions = [
      eq(conversationParticipantsTable.conversationId, Number(conversationId)),
      eq(conversationParticipantsTable.leftAt, null),
    ];

    if (excludeUserId) {
      conditions.push(ne(conversationParticipantsTable.userId, Number(excludeUserId)));
    }

    return await db
      .select()
      .from(conversationParticipantsTable)
      .where(and(...conditions));
  }

  /**
   * Get participant by conversation and user ID
   */
  static async getParticipantByConversationAndUser(conversationId, userId) {
    const [participant] = await db
      .select()
      .from(conversationParticipantsTable)
      .where(
        and(
          eq(conversationParticipantsTable.conversationId, Number(conversationId)),
          eq(conversationParticipantsTable.userId, Number(userId)),
          eq(conversationParticipantsTable.leftAt, null)
        )
      );
    return participant;
  }

  /**
   * Increment unread count for participants (except sender)
   */
  static async incrementUnreadCount(conversationId, excludeUserId) {
    const participants = await db
      .select()
      .from(conversationParticipantsTable)
      .where(
        and(
          eq(conversationParticipantsTable.conversationId, Number(conversationId)),
          ne(conversationParticipantsTable.userId, Number(excludeUserId)),
          eq(conversationParticipantsTable.leftAt, null)
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
  }

  /**
   * Reset unread count for a user in a conversation
   */
  static async resetUnreadCount(conversationId, userId) {
    const [participant] = await db
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
      )
      .returning();
    return participant;
  }
}

module.exports = {
  conversationParticipantsTable,
  ConversationParticipantsModel,
};

