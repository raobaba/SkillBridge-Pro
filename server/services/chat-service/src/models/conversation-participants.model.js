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
    try {
      // Check if participant already exists
      const existing = await this.getParticipantByConversationAndUser(conversationId, userId);
      if (existing) {
        console.log(`[Add Participant] User ${userId} already exists in conversation ${conversationId}, skipping insert`);
        return existing;
      }
      
      const [participant] = await db
        .insert(conversationParticipantsTable)
        .values({
          conversationId: Number(conversationId),
          userId: Number(userId),
          role,
        })
        .returning();
      
      console.log(`[Add Participant] Successfully added user ${userId} to conversation ${conversationId} with role ${role}`);
      return participant;
    } catch (error) {
      console.error(`[Add Participant] Error adding participant:`, error);
      throw error;
    }
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
    try {
      const [participant] = await db
        .update(conversationParticipantsTable)
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(conversationParticipantsTable.conversationId, Number(conversationId)),
            eq(conversationParticipantsTable.userId, Number(userId)),
            eq(conversationParticipantsTable.leftAt, null) // Only update active participants
          )
        )
        .returning();
      
      return participant || null;
    } catch (error) {
      console.error("Error updating participant:", error);
      return null;
    }
  }

  /**
   * Get participants of a conversation
   */
  static async getParticipantsByConversationId(conversationId, excludeUserId = null) {
    try {
      const conditions = [
        eq(conversationParticipantsTable.conversationId, Number(conversationId)),
        eq(conversationParticipantsTable.leftAt, null),
      ];

      if (excludeUserId) {
        conditions.push(ne(conversationParticipantsTable.userId, Number(excludeUserId)));
      }

      const participants = await db
        .select()
        .from(conversationParticipantsTable)
        .where(and(...conditions));
      
      // Ensure all userIds are numbers for consistent comparison
      return participants.map(p => ({
        ...p,
        userId: Number(p.userId),
        conversationId: Number(p.conversationId)
      }));
    } catch (error) {
      console.error(`[Get Participants] Error getting participants for conversation ${conversationId}:`, error);
      return [];
    }
  }

  /**
   * Get participant by conversation and user ID
   */
  static async getParticipantByConversationAndUser(conversationId, userId) {
    try {
      // Ensure both IDs are numbers - handle both string and number inputs
      const convId = typeof conversationId === 'string' ? parseInt(conversationId, 10) : Number(conversationId);
      const usrId = typeof userId === 'string' ? parseInt(userId, 10) : Number(userId);
      
      // Validate IDs are valid numbers
      if (isNaN(convId) || isNaN(usrId) || convId <= 0 || usrId <= 0) {
        console.error(`[Get Participant] Invalid IDs - conversationId: ${conversationId} (${typeof conversationId}), userId: ${userId} (${typeof userId})`);
        return null;
      }
      
      const [participant] = await db
        .select()
        .from(conversationParticipantsTable)
        .where(
          and(
            eq(conversationParticipantsTable.conversationId, convId),
            eq(conversationParticipantsTable.userId, usrId),
            eq(conversationParticipantsTable.leftAt, null)
          )
        );
      
      if (participant) {
        // Ensure returned userId is also a number for comparison
        participant.userId = Number(participant.userId);
        participant.conversationId = Number(participant.conversationId);
        return participant;
      }
      
      return null;
    } catch (error) {
      console.error(`[Get Participant] Error getting participant for conversation ${conversationId}, user ${userId}:`, error);
      return null;
    }
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

