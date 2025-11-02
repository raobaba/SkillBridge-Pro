const {
  ConversationsModel,
  MessagesModel,
  ConversationParticipantsModel,
  MessageReadReceiptsModel,
} = require("../models");

/**
 * Socket.io event handlers
 */
class SocketHandlers {
  constructor(io) {
    this.io = io;
    // Store active users: userId -> socketId
    this.activeUsers = new Map();
    // Store typing users: conversationId -> { userId -> timestamp }
    this.typingUsers = new Map();
  }

  /**
   * Get active users count
   */
  getActiveUsersCount() {
    return this.activeUsers.size;
  }

  /**
   * Get user's socket ID
   */
  getUserSocketId(userId) {
    return this.activeUsers.get(Number(userId));
  }

  /**
   * Get all socket IDs for a conversation (all participants)
   */
  async getConversationSocketIds(conversationId) {
    try {
      const participants = await ConversationParticipantsModel.getParticipantsByConversationId(
        Number(conversationId)
      );
      const socketIds = [];
      
      participants.forEach((participant) => {
        const socketId = this.activeUsers.get(Number(participant.userId));
        if (socketId) {
          socketIds.push(socketId);
        }
      });

      return socketIds;
    } catch (error) {
      console.error("Error getting conversation socket IDs:", error);
      return [];
    }
  }

  /**
   * Handle socket connection
   */
  handleConnection(socket) {
    const userId = socket.user?.userId || socket.user?.id;
    
    if (!userId) {
      console.error("Socket connected without user ID");
      socket.disconnect();
      return;
    }

    // Store user's socket connection
    this.activeUsers.set(Number(userId), socket.id);

    console.log(`✅ User ${userId} connected (Socket: ${socket.id})`);
    console.log(`📊 Active users: ${this.activeUsers.size}`);

    // Join user's personal room (for direct notifications)
    socket.join(`user:${userId}`);

    // Emit user online status to relevant users
    this.broadcastUserStatus(userId, "online");

    /**
     * Handle joining a conversation room
     */
    socket.on("join_conversation", async ({ conversationId }) => {
      try {
        if (!conversationId) {
          socket.emit("error", { message: "Conversation ID is required" });
          return;
        }

        // Verify user is a participant
        const participants = await ConversationParticipantsModel.getParticipantsByConversationId(
          Number(conversationId)
        );
        const isParticipant = participants.some((p) => p.userId === Number(userId));

        if (!isParticipant) {
          socket.emit("error", { message: "You are not a participant in this conversation" });
          return;
        }

        // Join conversation room
        socket.join(`conversation:${conversationId}`);
        console.log(`👤 User ${userId} joined conversation ${conversationId}`);

        socket.emit("joined_conversation", { conversationId });
      } catch (error) {
        console.error("Error joining conversation:", error);
        socket.emit("error", { message: "Failed to join conversation" });
      }
    });

    /**
     * Handle leaving a conversation room
     */
    socket.on("leave_conversation", ({ conversationId }) => {
      if (conversationId) {
        socket.leave(`conversation:${conversationId}`);
        console.log(`👤 User ${userId} left conversation ${conversationId}`);
      }
    });

    /**
     * Handle sending a message
     */
    socket.on("send_message", async (data) => {
      try {
        const { conversationId, content, messageType = "text", replyToId } = data;

        if (!conversationId || !content) {
          socket.emit("error", { message: "Conversation ID and content are required" });
          return;
        }

        // Verify user is a participant
        const participants = await ConversationParticipantsModel.getParticipantsByConversationId(
          Number(conversationId)
        );
        const isParticipant = participants.some((p) => p.userId === Number(userId));

        if (!isParticipant) {
          socket.emit("error", { message: "You are not a participant in this conversation" });
          return;
        }

        // Create message in database
        const message = await MessagesModel.createMessage({
          conversationId: Number(conversationId),
          senderId: Number(userId),
          content,
          messageType,
          replyToId: replyToId ? Number(replyToId) : null,
        });

        // Get all participants for this conversation
        const conversationSocketIds = await this.getConversationSocketIds(conversationId);

        // Emit message to all participants in the conversation room
        this.io.to(`conversation:${conversationId}`).emit("new_message", {
          conversationId: Number(conversationId),
          message,
        });

        // Update conversation's updatedAt (already done in MessagesModel.createMessage)
        
        console.log(`💬 Message sent in conversation ${conversationId} by user ${userId}`);
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    /**
     * Handle typing indicator
     */
    socket.on("typing", async ({ conversationId, isTyping }) => {
      try {
        if (!conversationId) return;

        const conversationKey = `conversation:${conversationId}`;
        
        if (isTyping) {
          // Add user to typing list
          if (!this.typingUsers.has(Number(conversationId))) {
            this.typingUsers.set(Number(conversationId), new Map());
          }
          this.typingUsers.get(Number(conversationId)).set(Number(userId), Date.now());

          // Broadcast typing indicator to other participants
          socket.to(conversationKey).emit("user_typing", {
            conversationId: Number(conversationId),
            userId: Number(userId),
            isTyping: true,
          });

          // Clear typing after 3 seconds
          setTimeout(() => {
            if (this.typingUsers.has(Number(conversationId))) {
              this.typingUsers.get(Number(conversationId)).delete(Number(userId));
              socket.to(conversationKey).emit("user_typing", {
                conversationId: Number(conversationId),
                userId: Number(userId),
                isTyping: false,
              });
            }
          }, 3000);
        } else {
          // Remove user from typing list
          if (this.typingUsers.has(Number(conversationId))) {
            this.typingUsers.get(Number(conversationId)).delete(Number(userId));
          }

          socket.to(conversationKey).emit("user_typing", {
            conversationId: Number(conversationId),
            userId: Number(userId),
            isTyping: false,
          });
        }
      } catch (error) {
        console.error("Error handling typing:", error);
      }
    });

    /**
     * Handle marking messages as read
     */
    socket.on("mark_read", async ({ conversationId, messageIds }) => {
      try {
        if (!conversationId) return;

        // Verify user is a participant
        const participants = await ConversationParticipantsModel.getParticipantsByConversationId(
          Number(conversationId)
        );
        const isParticipant = participants.some((p) => p.userId === Number(userId));

        if (!isParticipant) {
          socket.emit("error", { message: "You are not a participant in this conversation" });
          return;
        }

        // Mark messages as read in database
        if (messageIds && Array.isArray(messageIds) && messageIds.length > 0) {
          await MessageReadReceiptsModel.createReadReceipts(
            messageIds.map((messageId) => ({
              messageId: Number(messageId),
              userId: Number(userId),
            }))
          );
        } else {
          // Mark all messages in conversation as read
          await MessagesModel.markAsRead(Number(conversationId), Number(userId));
        }

        // Broadcast read receipt to conversation
        this.io.to(`conversation:${conversationId}`).emit("messages_read", {
          conversationId: Number(conversationId),
          userId: Number(userId),
          messageIds: messageIds || [],
        });

        console.log(`✓ User ${userId} marked messages as read in conversation ${conversationId}`);
      } catch (error) {
        console.error("Error marking messages as read:", error);
        socket.emit("error", { message: "Failed to mark messages as read" });
      }
    });

    /**
     * Handle disconnection
     */
    socket.on("disconnect", () => {
      // Remove user from active users
      this.activeUsers.delete(Number(userId));

      // Remove from all typing lists
      this.typingUsers.forEach((users, conversationId) => {
        users.delete(Number(userId));
        if (users.size === 0) {
          this.typingUsers.delete(conversationId);
        }
      });

      // Broadcast user offline status
      this.broadcastUserStatus(userId, "offline");

      console.log(`❌ User ${userId} disconnected (Socket: ${socket.id})`);
      console.log(`📊 Active users: ${this.activeUsers.size}`);
    });
  }

  /**
   * Broadcast user online/offline status
   */
  async broadcastUserStatus(userId, status) {
    try {
      // Find all conversations this user is part of
      // This is simplified - in production, you might want to cache this
      const statusUpdate = {
        userId: Number(userId),
        status,
        timestamp: new Date().toISOString(),
      };

      // Broadcast to all connected sockets (they'll filter on their end)
      this.io.emit("user_status_change", statusUpdate);
    } catch (error) {
      console.error("Error broadcasting user status:", error);
    }
  }

  /**
   * Emit message to specific conversation
   */
  async emitToConversation(conversationId, event, data) {
    this.io.to(`conversation:${conversationId}`).emit(event, data);
  }

  /**
   * Emit to specific user
   */
  emitToUser(userId, event, data) {
    const socketId = this.activeUsers.get(Number(userId));
    if (socketId) {
      this.io.to(socketId).emit(event, data);
    }
  }
}

module.exports = SocketHandlers;

