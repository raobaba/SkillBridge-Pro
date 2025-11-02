const {
  ConversationsModel,
  MessagesModel,
  ConversationParticipantsModel,
} = require("../models");
const ErrorHandler = require("shared/utils/errorHandler");

// Get all conversations for the authenticated user
const getConversations = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    if (!userId) return new ErrorHandler("User ID is required", 400).sendError(res);

    const { type, archived, favorites, flagged, search } = req.query;

    const filters = {
      type: type || undefined,
      archived: archived === "true" ? true : archived === "false" ? false : undefined,
      favorites: favorites === "true" ? true : favorites === "false" ? false : undefined,
      flagged: flagged === "true" ? true : undefined,
      search: search || undefined,
    };

    const conversations = await ConversationsModel.getConversationsByUser(
      Number(userId),
      filters
    );

    // Enrich conversations with user details
    const enrichedConversations = await Promise.all(
      conversations.map(async (conv) => {
        // Get user details for participants (requires cross-service call)
        // For now, return participant IDs and let frontend handle user display
        const participants = await ConversationParticipantsModel.getParticipantsByConversationId(conv.id);
        
        // Get other participant info for direct messages
        let otherParticipant = null;
        if (conv.type === "direct" && conv.otherParticipants?.length > 0) {
          const otherParticipantId = conv.otherParticipants[0].userId;
          try {
            // Try to get user info from user service
            // This is a placeholder - you might need to implement a cross-service call
            otherParticipant = {
              id: otherParticipantId,
              // User details would be fetched from user-service
            };
          } catch (e) {
            console.log("Could not fetch user details:", e.message);
          }
        }

        return {
          id: conv.id,
          type: conv.type,
          name: conv.name,
          projectId: conv.projectId,
          status: conv.status,
          isFlagged: conv.isFlagged,
          lastMessage: conv.lastMessage
            ? {
                id: conv.lastMessage.id,
                content: conv.lastMessage.content,
                senderId: conv.lastMessage.senderId,
                timestamp: conv.lastMessage.createdAt,
              }
            : null,
          participant: {
            unreadCount: conv.participant?.unreadCount || 0,
            isArchived: conv.participant?.isArchived || false,
            isFavorite: conv.participant?.isFavorite || false,
            isMuted: conv.participant?.isMuted || false,
            lastReadAt: conv.participant?.lastReadAt,
          },
          otherParticipant,
          participants,
          updatedAt: conv.updatedAt,
          createdAt: conv.createdAt,
        };
      })
    );

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Conversations retrieved successfully",
      data: enrichedConversations,
    });
  } catch (error) {
    console.error("Get Conversations Error:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Failed to fetch conversations",
      error: error.message,
    });
  }
};

// Get or create a direct conversation
const getOrCreateDirectConversation = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const { otherUserId } = req.params;

    if (!userId) return new ErrorHandler("User ID is required", 400).sendError(res);
    if (!otherUserId) return new ErrorHandler("Other user ID is required", 400).sendError(res);

    if (Number(userId) === Number(otherUserId)) {
      return new ErrorHandler("Cannot create conversation with yourself", 400).sendError(res);
    }

    const conversation = await ConversationsModel.getOrCreateDirectConversation(
      Number(userId),
      Number(otherUserId)
    );

    // Get participants
    const participants = await ConversationParticipantsModel.getParticipantsByConversationId(conversation.id);

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Conversation retrieved/created successfully",
      data: {
        ...conversation,
        participants,
      },
    });
  } catch (error) {
    console.error("Get/Create Direct Conversation Error:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Failed to get/create conversation",
      error: error.message,
    });
  }
};

// Get messages for a conversation
const getMessages = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const { conversationId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    if (!userId) return new ErrorHandler("User ID is required", 400).sendError(res);
    if (!conversationId) return new ErrorHandler("Conversation ID is required", 400).sendError(res);

    // Verify user is a participant
    const participants = await ConversationParticipantsModel.getParticipantsByConversationId(Number(conversationId));
    const isParticipant = participants.some((p) => p.userId === Number(userId));

    if (!isParticipant) {
      return new ErrorHandler("You are not a participant in this conversation", 403).sendError(res);
    }

    const messages = await MessagesModel.getMessages(
      Number(conversationId),
      Number(limit),
      Number(offset)
    );

    // Reverse to show oldest first (for frontend)
    const reversedMessages = messages.reverse();

    // Mark messages as read when fetching
    await MessagesModel.markAsRead(Number(conversationId), Number(userId));

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Messages retrieved successfully",
      data: reversedMessages,
      pagination: {
        limit: Number(limit),
        offset: Number(offset),
        total: messages.length,
      },
    });
  } catch (error) {
    console.error("Get Messages Error:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Failed to fetch messages",
      error: error.message,
    });
  }
};

// Send a message
const sendMessage = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const {
      conversationId,
      content,
      messageType = "text",
      fileUrl,
      fileName,
      fileSize,
      replyToId,
    } = req.body;

    if (!userId) return new ErrorHandler("User ID is required", 400).sendError(res);
    if (!conversationId) return new ErrorHandler("Conversation ID is required", 400).sendError(res);
    if (!content) return new ErrorHandler("Message content is required", 400).sendError(res);

    // Verify user is a participant
    const participants = await ConversationParticipantsModel.getParticipantsByConversationId(Number(conversationId));
    const isParticipant = participants.some((p) => p.userId === Number(userId));

    if (!isParticipant) {
      return new ErrorHandler("You are not a participant in this conversation", 403).sendError(res);
    }

    // Check if conversation is flagged and user is not admin
    const conversation = await ConversationsModel.getConversationById(Number(conversationId));
    if (conversation?.isFlagged && req.user?.role !== "admin") {
      return new ErrorHandler("Cannot send messages to flagged conversations", 403).sendError(res);
    }

    const message = await MessagesModel.createMessage({
      conversationId: Number(conversationId),
      senderId: Number(userId),
      content,
      messageType,
      fileUrl,
      fileName,
      fileSize,
      replyToId: replyToId ? Number(replyToId) : null,
    });

    return res.status(201).json({
      success: true,
      status: 201,
      message: "Message sent successfully",
      data: message,
    });
  } catch (error) {
    console.error("Send Message Error:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Failed to send message",
      error: error.message,
    });
  }
};

// Mark messages as read
const markAsRead = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const { conversationId } = req.params;
    const { messageIds } = req.body;

    if (!userId) return new ErrorHandler("User ID is required", 400).sendError(res);
    if (!conversationId) return new ErrorHandler("Conversation ID is required", 400).sendError(res);

    await MessagesModel.markAsRead(Number(conversationId), Number(userId), messageIds);

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Messages marked as read",
    });
  } catch (error) {
    console.error("Mark as Read Error:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Failed to mark messages as read",
      error: error.message,
    });
  }
};

// Delete message
const deleteMessage = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const { messageId } = req.params;

    if (!userId) return new ErrorHandler("User ID is required", 400).sendError(res);
    if (!messageId) return new ErrorHandler("Message ID is required", 400).sendError(res);

    const message = await MessagesModel.deleteMessage(Number(messageId), Number(userId));

    if (!message) {
      return new ErrorHandler("Message not found or you don't have permission", 404).sendError(res);
    }

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Message deleted successfully",
      data: message,
    });
  } catch (error) {
    console.error("Delete Message Error:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Failed to delete message",
      error: error.message,
    });
  }
};

// Edit message
const editMessage = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const { messageId } = req.params;
    const { content } = req.body;

    if (!userId) return new ErrorHandler("User ID is required", 400).sendError(res);
    if (!messageId) return new ErrorHandler("Message ID is required", 400).sendError(res);
    if (!content) return new ErrorHandler("Content is required", 400).sendError(res);

    const message = await MessagesModel.editMessage(
      Number(messageId),
      Number(userId),
      content
    );

    if (!message) {
      return new ErrorHandler("Message not found or you don't have permission", 404).sendError(res);
    }

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Message edited successfully",
      data: message,
    });
  } catch (error) {
    console.error("Edit Message Error:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Failed to edit message",
      error: error.message,
    });
  }
};

// Create group conversation
const createGroupConversation = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const { name, projectId, participantIds } = req.body;

    if (!userId) return new ErrorHandler("User ID is required", 400).sendError(res);
    if (!name) return new ErrorHandler("Group name is required", 400).sendError(res);

    const conversation = await ConversationsModel.createConversation({
      type: "group",
      name,
      projectId: projectId ? Number(projectId) : null,
      createdBy: Number(userId),
    });

    // Add all participants
    if (participantIds && Array.isArray(participantIds)) {
      for (const participantId of participantIds) {
        await ConversationParticipantsModel.addParticipant(conversation.id, Number(participantId));
      }
    }

    // Creator is already added in createConversation, but ensure they're admin
    await ConversationParticipantsModel.updateParticipant(conversation.id, Number(userId), {
      role: "admin",
    });

    return res.status(201).json({
      success: true,
      status: 201,
      message: "Group conversation created successfully",
      data: conversation,
    });
  } catch (error) {
    console.error("Create Group Conversation Error:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Failed to create group conversation",
      error: error.message,
    });
  }
};

// Update conversation participant settings (archive, favorite, mute)
const updateParticipantSettings = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const { conversationId } = req.params;
    const { isArchived, isFavorite, isMuted } = req.body;

    if (!userId) return new ErrorHandler("User ID is required", 400).sendError(res);
    if (!conversationId) return new ErrorHandler("Conversation ID is required", 400).sendError(res);

    const updates = {};
    if (isArchived !== undefined) updates.isArchived = isArchived;
    if (isFavorite !== undefined) updates.isFavorite = isFavorite;
    if (isMuted !== undefined) updates.isMuted = isMuted;

    if (Object.keys(updates).length === 0) {
      return new ErrorHandler("No updates provided", 400).sendError(res);
    }

    const participant = await ConversationParticipantsModel.updateParticipant(
      Number(conversationId),
      Number(userId),
      updates
    );

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Participant settings updated successfully",
      data: participant,
    });
  } catch (error) {
    console.error("Update Participant Settings Error:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Failed to update participant settings",
      error: error.message,
    });
  }
};

// Flag conversation (admin only)
const flagConversation = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const { conversationId } = req.params;
    const { reason } = req.body;

    if (!userId) return new ErrorHandler("User ID is required", 400).sendError(res);
    if (!conversationId) return new ErrorHandler("Conversation ID is required", 400).sendError(res);

    const conversation = await ConversationsModel.flagConversation(
      Number(conversationId),
      Number(userId),
      reason
    );

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Conversation flagged successfully",
      data: conversation,
    });
  } catch (error) {
    console.error("Flag Conversation Error:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Failed to flag conversation",
      error: error.message,
    });
  }
};

// Unflag conversation (admin only)
const unflagConversation = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const { conversationId } = req.params;

    if (!userId) return new ErrorHandler("User ID is required", 400).sendError(res);
    if (!conversationId) return new ErrorHandler("Conversation ID is required", 400).sendError(res);

    const conversation = await ConversationsModel.unflagConversation(Number(conversationId));

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Conversation unflagged successfully",
      data: conversation,
    });
  } catch (error) {
    console.error("Unflag Conversation Error:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Failed to unflag conversation",
      error: error.message,
    });
  }
};

module.exports = {
  getConversations,
  getOrCreateDirectConversation,
  getMessages,
  sendMessage,
  markAsRead,
  deleteMessage,
  editMessage,
  createGroupConversation,
  updateParticipantSettings,
  flagConversation,
  unflagConversation,
};

