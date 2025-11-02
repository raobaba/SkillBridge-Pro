import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getConversationsApi,
  getOrCreateDirectConversationApi,
  getMessagesApi,
  sendMessageApi,
  markAsReadApi,
  deleteMessageApi,
  editMessageApi,
  createGroupConversationApi,
  updateParticipantSettingsApi,
  flagConversationApi,
  unflagConversationApi,
} from "./chatAction";

const initialState = {
  conversations: [],
  activeConversation: null,
  messages: {},
  loading: false,
  sendingMessage: false,
  error: null,
  filters: {
    type: "all",
    archived: false,
    favorites: false,
    flagged: false,
    search: "",
  },
};

// Async thunks
export const getConversations = createAsyncThunk(
  "chat/getConversations",
  async (filters, { rejectWithValue }) => {
    try {
      const response = await getConversationsApi(filters);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch conversations");
    }
  }
);

export const getOrCreateDirectConversation = createAsyncThunk(
  "chat/getOrCreateDirectConversation",
  async (otherUserId, { rejectWithValue }) => {
    try {
      const response = await getOrCreateDirectConversationApi(otherUserId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to get/create conversation");
    }
  }
);

export const getMessages = createAsyncThunk(
  "chat/getMessages",
  async ({ conversationId, limit, offset }, { rejectWithValue }) => {
    try {
      const response = await getMessagesApi(conversationId, limit, offset);
      return { conversationId, ...response };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch messages");
    }
  }
);

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (messageData, { rejectWithValue }) => {
    try {
      const response = await sendMessageApi(messageData);
      return { conversationId: messageData.conversationId, message: response };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to send message");
    }
  }
);

export const markAsRead = createAsyncThunk(
  "chat/markAsRead",
  async ({ conversationId, messageIds }, { rejectWithValue }) => {
    try {
      await markAsReadApi(conversationId, messageIds);
      return { conversationId };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to mark as read");
    }
  }
);

export const deleteMessage = createAsyncThunk(
  "chat/deleteMessage",
  async ({ messageId, conversationId }, { rejectWithValue }) => {
    try {
      await deleteMessageApi(messageId);
      return { messageId, conversationId };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to delete message");
    }
  }
);

export const editMessage = createAsyncThunk(
  "chat/editMessage",
  async ({ messageId, content, conversationId }, { rejectWithValue }) => {
    try {
      const response = await editMessageApi(messageId, content);
      return { messageId, conversationId, message: response };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to edit message");
    }
  }
);

export const createGroupConversation = createAsyncThunk(
  "chat/createGroupConversation",
  async (groupData, { rejectWithValue }) => {
    try {
      const response = await createGroupConversationApi(groupData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to create group conversation");
    }
  }
);

export const updateParticipantSettings = createAsyncThunk(
  "chat/updateParticipantSettings",
  async ({ conversationId, settings }, { rejectWithValue }) => {
    try {
      const response = await updateParticipantSettingsApi(conversationId, settings);
      return { conversationId, settings: response };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update settings");
    }
  }
);

export const flagConversation = createAsyncThunk(
  "chat/flagConversation",
  async ({ conversationId, reason }, { rejectWithValue }) => {
    try {
      const response = await flagConversationApi(conversationId, reason);
      return { conversationId, conversation: response };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to flag conversation");
    }
  }
);

export const unflagConversation = createAsyncThunk(
  "chat/unflagConversation",
  async (conversationId, { rejectWithValue }) => {
    try {
      const response = await unflagConversationApi(conversationId);
      return { conversationId, conversation: response };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to unflag conversation");
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveConversation: (state, action) => {
      state.activeConversation = action.payload;
    },
    clearActiveConversation: (state) => {
      state.activeConversation = null;
    },
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearChatState: (state) => {
      state.conversations = [];
      state.activeConversation = null;
      state.messages = {};
      state.error = null;
      state.filters = initialState.filters;
    },
    addMessageOptimistically: (state, action) => {
      const { conversationId, message } = action.payload;
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }
      state.messages[conversationId].push(message);
    },
    updateMessageOptimistically: (state, action) => {
      const { conversationId, messageId, updates } = action.payload;
      if (state.messages[conversationId]) {
        const index = state.messages[conversationId].findIndex(
          (msg) => msg.id === messageId
        );
        if (index !== -1) {
          state.messages[conversationId][index] = {
            ...state.messages[conversationId][index],
            ...updates,
          };
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Get conversations
      .addCase(getConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload?.data || [];
      })
      .addCase(getConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get or create direct conversation
      .addCase(getOrCreateDirectConversation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrCreateDirectConversation.fulfilled, (state, action) => {
        state.loading = false;
        const conversation = action.payload?.data;
        if (conversation) {
          // Add to conversations if not already present
          const exists = state.conversations.some((c) => c.id === conversation.id);
          if (!exists) {
            state.conversations.unshift(conversation);
          }
          state.activeConversation = conversation;
        }
      })
      .addCase(getOrCreateDirectConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get messages
      .addCase(getMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.loading = false;
        const { conversationId, data } = action.payload;
        state.messages[conversationId] = data || [];
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.sendingMessage = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sendingMessage = false;
        const { conversationId, message } = action.payload;
        const messageData = message?.data;
        
        if (messageData) {
          if (!state.messages[conversationId]) {
            state.messages[conversationId] = [];
          }
          state.messages[conversationId].push(messageData);
          
          // Update last message in conversation
          const convIndex = state.conversations.findIndex((c) => c.id === conversationId);
          if (convIndex !== -1) {
            state.conversations[convIndex].lastMessage = {
              id: messageData.id,
              content: messageData.content,
              senderId: messageData.senderId,
              timestamp: messageData.createdAt,
            };
            state.conversations[convIndex].updatedAt = messageData.createdAt;
          }
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sendingMessage = false;
        state.error = action.payload;
      })
      
      // Mark as read
      .addCase(markAsRead.fulfilled, (state, action) => {
        const { conversationId } = action.payload;
        // Update unread count in conversation
        const convIndex = state.conversations.findIndex((c) => c.id === conversationId);
        if (convIndex !== -1) {
          state.conversations[convIndex].participant.unreadCount = 0;
        }
      })
      
      // Delete message
      .addCase(deleteMessage.fulfilled, (state, action) => {
        const { messageId, conversationId } = action.payload;
        if (state.messages[conversationId]) {
          state.messages[conversationId] = state.messages[conversationId].filter(
            (msg) => msg.id !== messageId
          );
        }
      })
      
      // Edit message
      .addCase(editMessage.fulfilled, (state, action) => {
        const { conversationId, messageId, message } = action.payload;
        const updatedMessage = message?.data;
        if (state.messages[conversationId] && updatedMessage) {
          const index = state.messages[conversationId].findIndex(
            (msg) => msg.id === messageId
          );
          if (index !== -1) {
            state.messages[conversationId][index] = updatedMessage;
          }
        }
      })
      
      // Create group conversation
      .addCase(createGroupConversation.fulfilled, (state, action) => {
        const conversation = action.payload?.data;
        if (conversation) {
          state.conversations.unshift(conversation);
          state.activeConversation = conversation;
        }
      })
      
      // Update participant settings
      .addCase(updateParticipantSettings.fulfilled, (state, action) => {
        const { conversationId, settings } = action.payload;
        const convIndex = state.conversations.findIndex((c) => c.id === conversationId);
        if (convIndex !== -1) {
          state.conversations[convIndex].participant = {
            ...state.conversations[convIndex].participant,
            ...settings.data,
          };
        }
      })
      
      // Flag conversation
      .addCase(flagConversation.fulfilled, (state, action) => {
        const { conversationId, conversation } = action.payload;
        const convIndex = state.conversations.findIndex((c) => c.id === conversationId);
        if (convIndex !== -1 && conversation?.data) {
          state.conversations[convIndex] = { ...state.conversations[convIndex], ...conversation.data };
        }
      })
      
      // Unflag conversation
      .addCase(unflagConversation.fulfilled, (state, action) => {
        const { conversationId, conversation } = action.payload;
        const convIndex = state.conversations.findIndex((c) => c.id === conversationId);
        if (convIndex !== -1 && conversation?.data) {
          state.conversations[convIndex] = { ...state.conversations[convIndex], ...conversation.data };
        }
      });
  },
});

export const {
  setActiveConversation,
  clearActiveConversation,
  updateFilters,
  clearFilters,
  clearChatState,
  addMessageOptimistically,
  updateMessageOptimistically,
} = chatSlice.actions;

export default chatSlice.reducer;

