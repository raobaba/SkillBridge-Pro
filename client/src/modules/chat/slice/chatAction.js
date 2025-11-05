import fetchFromApiServer from "../../../services/api";

// Get chat users (developers and project owners)
export const getChatUsersApi = async (params = {}) => {
  const { search, limit } = params;
  const queryParams = new URLSearchParams();

  if (search) queryParams.append("search", search);
  if (limit) queryParams.append("limit", limit);

  const url = `api/v1/user/chat/users${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  return await fetchFromApiServer("GET", url);
};

// Get all conversations for the authenticated user
export const getConversationsApi = async (filters = {}) => {
  const { type, archived, favorites, flagged, search, role } = filters;
  const queryParams = new URLSearchParams();
  
  if (type) queryParams.append("type", type);
  if (archived !== undefined) queryParams.append("archived", archived);
  if (favorites !== undefined) queryParams.append("favorites", favorites);
  if (flagged !== undefined) queryParams.append("flagged", flagged);
  if (search) queryParams.append("search", search);
  if (role) queryParams.append("role", role); // Filter by participant role (e.g., 'admin' for project owners)
  
  // Add cache-busting parameter to prevent 304 Not Modified responses
  queryParams.append("_t", Date.now().toString());
  
  const url = `api/v1/chat/conversations?${queryParams.toString()}`;
  return await fetchFromApiServer("GET", url);
};

// Get or create direct conversation
export const getOrCreateDirectConversationApi = async (otherUserId) => {
  const url = `api/v1/chat/conversations/direct/${otherUserId}`;
  return await fetchFromApiServer("GET", url);
};

// Get messages for a conversation
export const getMessagesApi = async (conversationId, limit = 50, offset = 0) => {
  const url = `api/v1/chat/conversations/${conversationId}/messages?limit=${limit}&offset=${offset}`;
  return await fetchFromApiServer("GET", url);
};

// Send a message
export const sendMessageApi = async (messageData) => {
  const url = `api/v1/chat/messages`;
  return await fetchFromApiServer("POST", url, messageData);
};

// Mark messages as read
export const markAsReadApi = async (conversationId, messageIds = null) => {
  const url = `api/v1/chat/conversations/${conversationId}/read`;
  const body = messageIds ? { messageIds } : {};
  return await fetchFromApiServer("POST", url, body);
};

// Delete a message
export const deleteMessageApi = async (messageId) => {
  const url = `api/v1/chat/messages/${messageId}`;
  return await fetchFromApiServer("DELETE", url);
};

// Edit a message
export const editMessageApi = async (messageId, content) => {
  const url = `api/v1/chat/messages/${messageId}`;
  return await fetchFromApiServer("PUT", url, { content });
};

// Create group conversation
export const createGroupConversationApi = async (groupData) => {
  const url = `api/v1/chat/conversations/group`;
  return await fetchFromApiServer("POST", url, groupData);
};

// Update participant settings (archive, favorite, mute)
export const updateParticipantSettingsApi = async (conversationId, settings) => {
  const url = `api/v1/chat/conversations/${conversationId}/participant`;
  return await fetchFromApiServer("PUT", url, settings);
};

// Flag conversation (admin only)
export const flagConversationApi = async (conversationId, reason) => {
  const url = `api/v1/chat/conversations/${conversationId}/flag`;
  return await fetchFromApiServer("POST", url, { reason });
};

// Unflag conversation (admin only)
export const unflagConversationApi = async (conversationId) => {
  const url = `api/v1/chat/conversations/${conversationId}/flag`;
  return await fetchFromApiServer("DELETE", url);
};

// Get participants of a conversation
export const getConversationParticipantsApi = async (conversationId) => {
  const url = `api/v1/chat/conversations/${conversationId}/participants`;
  return await fetchFromApiServer("GET", url);
};

