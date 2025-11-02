// Conversations
const {
  conversationsTable,
  conversationTypeEnum,
  conversationStatusEnum,
  ConversationsModel,
} = require("./conversations.model");

// Conversation Participants
const {
  conversationParticipantsTable,
  ConversationParticipantsModel,
} = require("./conversation-participants.model");

// Messages
const {
  messagesTable,
  MessagesModel,
} = require("./messages.model");

// Message Read Receipts
const {
  messageReadReceiptsTable,
  MessageReadReceiptsModel,
} = require("./message-read-receipts.model");

module.exports = {
  // Tables (for database operations)
  conversationsTable,
  conversationParticipantsTable,
  messagesTable,
  messageReadReceiptsTable,
  
  // Enums
  conversationTypeEnum,
  conversationStatusEnum,
  
  // Model Classes (for business logic)
  ConversationsModel,
  ConversationParticipantsModel,
  MessagesModel,
  MessageReadReceiptsModel,
};
