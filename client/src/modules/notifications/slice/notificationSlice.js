import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getNotificationsApi,
  getUnreadCountApi,
  createNotificationApi,
  markNotificationAsReadApi,
  markAllNotificationsAsReadApi,
  deleteNotificationApi,
  deleteAllNotificationsApi,
} from "./notificationAction";

// Async thunks
export const getNotifications = createAsyncThunk(
  "notifications/getNotifications",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await getNotificationsApi(filters);
      // Backend returns: { success: true, data: [...], count: ... }
      // Axios wraps it, so response.data is the object above
      // response.data.data is the notifications array
      const notifications = response?.data?.data || response?.data || [];
      return Array.isArray(notifications) ? notifications : [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch notifications"
      );
    }
  }
);

export const getUnreadCount = createAsyncThunk(
  "notifications/getUnreadCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUnreadCountApi();
      return response.data.count;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch unread count"
      );
    }
  }
);

export const markAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await markNotificationAsReadApi(notificationId);
      return { notificationId, notification: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to mark notification as read"
      );
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  "notifications/markAllAsRead",
  async (_, { rejectWithValue }) => {
    try {
      await markAllNotificationsAsReadApi();
      return true;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to mark all notifications as read"
      );
    }
  }
);

export const deleteNotification = createAsyncThunk(
  "notifications/deleteNotification",
  async (notificationId, { rejectWithValue }) => {
    try {
      await deleteNotificationApi(notificationId);
      return notificationId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to delete notification"
      );
    }
  }
);

export const deleteAllNotifications = createAsyncThunk(
  "notifications/deleteAllNotifications",
  async (_, { rejectWithValue }) => {
    try {
      await deleteAllNotificationsApi();
      return true;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to delete all notifications"
      );
    }
  }
);

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  lastFetched: null,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Get notifications
    builder
      .addCase(getNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.loading = false;
        // Ensure payload is always an array
        state.notifications = Array.isArray(action.payload) ? action.payload : [];
        state.lastFetched = new Date().toISOString();
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get unread count
    builder
      .addCase(getUnreadCount.pending, (state) => {
        // Don't set loading for unread count to avoid UI flicker
      })
      .addCase(getUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload || 0;
      })
      .addCase(getUnreadCount.rejected, (state, action) => {
        console.error("Failed to fetch unread count:", action.payload);
      });

    // Mark as read
    builder
      .addCase(markAsRead.fulfilled, (state, action) => {
        const { notificationId } = action.payload;
        const notification = state.notifications.find((n) => n.id === notificationId);
        if (notification) {
          notification.read = true;
        }
        if (state.unreadCount > 0) {
          state.unreadCount -= 1;
        }
      })
      .addCase(markAsRead.rejected, (state, action) => {
        state.error = action.payload;
      });

    // Mark all as read
    builder
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications = state.notifications.map((n) => ({ ...n, read: true }));
        state.unreadCount = 0;
      })
      .addCase(markAllAsRead.rejected, (state, action) => {
        state.error = action.payload;
      });

    // Delete notification
    builder
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const notificationId = action.payload;
        const notification = state.notifications.find((n) => n.id === notificationId);
        if (notification && !notification.read) {
          if (state.unreadCount > 0) {
            state.unreadCount -= 1;
          }
        }
        state.notifications = state.notifications.filter((n) => n.id !== notificationId);
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.error = action.payload;
      });

    // Delete all notifications
    builder
      .addCase(deleteAllNotifications.fulfilled, (state) => {
        state.notifications = [];
        state.unreadCount = 0;
      })
      .addCase(deleteAllNotifications.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearNotifications, clearError } = notificationSlice.actions;
export default notificationSlice.reducer;

