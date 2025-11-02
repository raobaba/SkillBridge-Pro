const express = require("express");
const chatController = require("../controllers/chat.controller");
const authenticate = require("shared/middleware/auth.middleware");
const { requireRole } = require("shared/middleware/roleAuth.middleware");

const chatRouter = express.Router();

// All routes require authentication
chatRouter.use(authenticate);

// Get all conversations for authenticated user
chatRouter.get("/conversations", chatController.getConversations);

// Get or create direct conversation between two users
chatRouter.get("/conversations/direct/:otherUserId", chatController.getOrCreateDirectConversation);

// Create group conversation (project owners only)
chatRouter.post(
  "/conversations/group",
  requireRole(["project-owner"]),
  chatController.createGroupConversation
);

// Add participants to group (project owners only)
chatRouter.post(
  "/conversations/:conversationId/participants",
  requireRole(["project-owner"]),
  chatController.addParticipantsToGroup
);

// Remove participant from group (project owners only)
chatRouter.delete(
  "/conversations/:conversationId/participants/:participantId",
  requireRole(["project-owner"]),
  chatController.removeParticipantFromGroup
);

// Get messages for a conversation
chatRouter.get("/conversations/:conversationId/messages", chatController.getMessages);

// Send a message
chatRouter.post("/messages", chatController.sendMessage);

// Mark messages as read
chatRouter.post("/conversations/:conversationId/read", chatController.markAsRead);

// Delete a message
chatRouter.delete("/messages/:messageId", chatController.deleteMessage);

// Edit a message
chatRouter.put("/messages/:messageId", chatController.editMessage);

// Update participant settings (archive, favorite, mute)
chatRouter.put("/conversations/:conversationId/participant", chatController.updateParticipantSettings);

// Flag conversation (admin only)
chatRouter.post(
  "/conversations/:conversationId/flag",
  requireRole(["admin"]),
  chatController.flagConversation
);

// Unflag conversation (admin only)
chatRouter.delete(
  "/conversations/:conversationId/flag",
  requireRole(["admin"]),
  chatController.unflagConversation
);

module.exports = chatRouter;

