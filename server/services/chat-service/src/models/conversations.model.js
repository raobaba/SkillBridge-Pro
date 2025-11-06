const { pgTable, serial, integer, text, timestamp, boolean, pgEnum } = require("drizzle-orm/pg-core");
const { eq, and, desc, ne, isNull, or } = require("drizzle-orm");
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
   * @param {Object} params
   * @param {string} params.type - Conversation type ('direct', 'group', etc.)
   * @param {string} params.name - Conversation name (for groups)
   * @param {number} params.projectId - Project ID (optional)
   * @param {number} params.createdBy - User ID of creator
   * @param {string} params.creatorRole - User role of creator ('project-owner', 'developer', etc.)
   */
  static async createConversation({ type, name, projectId, createdBy, creatorRole }) {
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
      try {
        // Ensure createdBy is a number
        const creatorUserId = Number(createdBy);
        
        // Determine participant role:
        // - For groups: use 'project-owner' if creator is project-owner, otherwise 'developer'
        // - For direct messages: always 'member'
        let participantRole = "member";
        if (type === "group") {
          if (creatorRole === "project-owner") {
            participantRole = "project-owner"; // Project owner creates group with 'project-owner' role
          } else if (creatorRole === "developer") {
            participantRole = "developer"; // Developer creates group with 'developer' role
          } else {
            participantRole = "member"; // Other roles join as member
          }
        }
        
        const [participant] = await db.insert(conversationParticipantsTable).values({
          conversationId: conversation.id,
          userId: creatorUserId,
          role: participantRole,
        }).returning();
        
        console.log(`[Create Conversation] ✅ Added creator ${creatorUserId} as participant with role ${participantRole}:`, {
          participantId: participant?.id,
          userId: participant?.userId,
          userIdType: typeof participant?.userId,
          role: participant?.role,
          conversationId: participant?.conversationId,
          creatorUserRole: creatorRole
        });
        
        // Verify it was saved correctly
        if (!participant || Number(participant.userId) !== creatorUserId) {
          throw new Error(`Failed to create participant - userId mismatch. Expected: ${creatorUserId}, Got: ${participant?.userId}`);
        }
      } catch (error) {
        console.error(`[Create Conversation] ❌ Error adding creator as participant:`, error);
        throw error;
      }
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
   * @param {number} userId1 - First user ID
   * @param {number} userId2 - Second user ID
   * @param {number|null} projectId - Optional project ID to associate with conversation
   * @returns {Promise<Object>} - Conversation object
   */
  static async getOrCreateDirectConversation(userId1, userId2, projectId = null) {
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
                isNull(conversationParticipantsTable.leftAt) // Use isNull() for proper null checks
          )
        );

      const participantIds = participants.map((p) => Number(p.userId));
      if (participantIds.includes(Number(userId1)) && participantIds.includes(Number(userId2)) && participants.length === 2) {
        // If conversation exists but doesn't have projectId and one is provided, update it
        if (projectId && !conv.conversations.projectId) {
          const [updated] = await db
            .update(conversationsTable)
            .set({ projectId: Number(projectId), updatedAt: new Date() })
            .where(eq(conversationsTable.id, conv.conversations.id))
            .returning();
          return updated || conv.conversations;
        }
        return conv.conversations;
      }
    }

    // Create new conversation with optional projectId
    // Note: For direct conversations, creatorRole doesn't affect participant role (always 'member')
    const conversation = await this.createConversation({
      type: "direct",
      projectId: projectId ? Number(projectId) : null,
      createdBy: userId1,
      creatorRole: null, // Direct conversations don't need creator role distinction
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
   * @param {number} userId - User ID
   * @param {Object} filters - Filter options
   * @param {string} filters.type - Conversation type ('direct', 'group')
   * @param {string} filters.role - Filter by participant role ('project-owner', 'member', 'admin')
   * @param {boolean} filters.archived - Filter archived conversations
   * @param {boolean} filters.favorites - Filter favorite conversations
   * @param {boolean} filters.flagged - Filter flagged conversations
   * @param {string} filters.search - Search term
   */
  static async getConversationsByUser(userId, filters = {}) {
    const { conversationParticipantsTable } = require("./conversation-participants.model");
    const { type, archived, favorites, flagged, search, role } = filters;

    console.log(`[Get Conversations By User] UserId: ${userId}, Filters:`, { type, role, archived, favorites, flagged, search });

    // Build where conditions array
    const conditions = [
      eq(conversationParticipantsTable.userId, Number(userId)),
      isNull(conversationParticipantsTable.leftAt), // Use isNull() for proper null checks
      // Only include active and archived conversations (exclude deleted)
      or(
        eq(conversationsTable.status, 'active'),
        eq(conversationsTable.status, 'archived')
      ),
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
    
    // Filter by participant role
    // For project owners requesting groups: filter by role='project-owner' to show only groups they created
    if (role) {
      conditions.push(eq(conversationParticipantsTable.role, role));
      console.log(`[Get Conversations By User] Filtering by participant role: ${role}`);
    }

        console.log(`[Get Conversations By User] Query conditions count: ${conditions.length}`);
    console.log(`[Get Conversations By User] Conditions:`, conditions.map(c => {
      // Try to extract info from condition for logging
      try {
        return JSON.stringify(c);
      } catch (e) {
        return String(c);
      }
    }));

    // Build the where clause
    const whereClause = conditions.length > 1 ? and(...conditions) : conditions[0];
    
    console.log(`[Get Conversations By User] Executing query with userId=${userId}, type=${type}, role=${role}`);

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
      .where(whereClause)        
      .orderBy(desc(conversationsTable.updatedAt));

    console.log(`[Get Conversations By User] Found ${results.length} conversations`);                                                                           
    if (results.length > 0) {
      console.log(`[Get Conversations By User] Sample results:`, results.slice(0, 3).map(r => ({                                                                
        conversationId: r.conversation.id,
        conversationName: r.conversation.name,
        conversationType: r.conversation.type,
        participantUserId: r.participant.userId,
        participantUserIdType: typeof r.participant.userId,
        participantRole: r.participant.role,
        participantRoleType: typeof r.participant.role,
        requestedUserId: userId,
        requestedUserIdType: typeof userId,
        requestedRole: role
      })));
    } else {
      console.log(`[Get Conversations By User] ⚠️ No conversations found for userId=${userId}, type=${type}, role=${role}`);
      
      // Debug: Check if there are any participants with this userId and role
      if (role) {
        try {
          const debugResults = await db
            .select()
            .from(conversationParticipantsTable)
            .where(
              and(
                eq(conversationParticipantsTable.userId, Number(userId)),
                eq(conversationParticipantsTable.role, role),
                isNull(conversationParticipantsTable.leftAt) // Use isNull() for proper null checks
              )
            );
          console.log(`[Get Conversations By User] Debug: Found ${debugResults.length} participants with userId=${userId} and role='${role}'`);
          if (debugResults.length > 0) {
            console.log(`[Get Conversations By User] Debug participant details:`, debugResults.map(p => ({
              id: p.id,
              conversationId: p.conversationId,
              userId: p.userId,
              role: p.role,
              leftAt: p.leftAt
            })));
          }
        } catch (debugError) {
          console.error(`[Get Conversations By User] Debug query error:`, debugError);
        }
      }
    }

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
                isNull(conversationParticipantsTable.leftAt) // Use isNull() for proper null checks
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

  /**
   * Delete conversation (soft delete by setting status to 'deleted')
   * @param {number} conversationId - Conversation ID
   * @returns {Promise<Object>} - Updated conversation object
   */
  static async deleteConversation(conversationId) {
    const [conversation] = await db
      .update(conversationsTable)
      .set({
        status: 'deleted',
        updatedAt: new Date(),
      })
      .where(eq(conversationsTable.id, conversationId))
      .returning();
    return conversation;
  }
}

module.exports = {
  conversationsTable,
  conversationTypeEnum,
  conversationStatusEnum,
  ConversationsModel,
};
