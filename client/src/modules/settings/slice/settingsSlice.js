import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getNotificationSettingsApi,
  updateNotificationSettingsApi,
  getNotificationFrequencyApi,
  updateNotificationFrequencyApi,
  getQuietHoursApi,
  updateQuietHoursApi,
  getPrivacySettingsApi,
  updatePrivacySettingsApi,
  getIntegrationsApi,
  updateIntegrationsApi,
  getSubscriptionApi,
  updateSubscriptionApi,
} from "./settingsAction";

// Initial state
const initialState = {
  // Notification settings
  notificationSettings: {
    email: true,
    sms: false,
    push: true,
    reminders: true,
    projectUpdates: true,
    xpNotifications: true,
    aiSuggestions: true,
    profileReminders: false,
    securityAlerts: true,
    soundEnabled: true,
  },
  
  // Notification frequency
  notificationFrequency: {
    email: "daily",
    push: "immediate",
    reminders: "weekly"
  },
  
  // Quiet hours
  quietHours: {
    enabled: false,
    start: "22:00",
    end: "08:00"
  },
  
  // Privacy settings
  privacySettings: {
    profilePublic: true,
    dataSharing: false,
    searchVisibility: true,
    personalizedAds: false,
  },
  
  // Integrations
  integrations: {
    github: false,
    linkedin: false,
    googleCalendar: false,
  },
  
  // Subscription
  subscription: {
    plan: "free",
    status: "active",
    currentPeriodStart: null,
    currentPeriodEnd: null,
  },
  
  // Loading states
  loading: false,
  notificationLoading: false,
  privacyLoading: false,
  integrationLoading: false,
  subscriptionLoading: false,
  
  // Error states
  error: null,
  notificationError: null,
  privacyError: null,
  integrationError: null,
  subscriptionError: null,
  
  // Success states
  notificationSuccess: false,
  privacySuccess: false,
  integrationSuccess: false,
  subscriptionSuccess: false,
};

// Async thunks for notification settings
export const getNotificationSettings = createAsyncThunk(
  "settings/getNotificationSettings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getNotificationSettingsApi();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to fetch notification settings" }
      );
    }
  }
);

export const updateNotificationSettings = createAsyncThunk(
  "settings/updateNotificationSettings",
  async (data, { rejectWithValue }) => {
    try {
      const response = await updateNotificationSettingsApi(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to update notification settings" }
      );
    }
  }
);

// Async thunks for notification frequency
export const getNotificationFrequency = createAsyncThunk(
  "settings/getNotificationFrequency",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getNotificationFrequencyApi();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to fetch notification frequency" }
      );
    }
  }
);

export const updateNotificationFrequency = createAsyncThunk(
  "settings/updateNotificationFrequency",
  async (data, { rejectWithValue }) => {
    try {
      const response = await updateNotificationFrequencyApi(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to update notification frequency" }
      );
    }
  }
);

// Async thunks for quiet hours
export const getQuietHours = createAsyncThunk(
  "settings/getQuietHours",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getQuietHoursApi();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to fetch quiet hours" }
      );
    }
  }
);

export const updateQuietHours = createAsyncThunk(
  "settings/updateQuietHours",
  async (data, { rejectWithValue }) => {
    try {
      const response = await updateQuietHoursApi(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to update quiet hours" }
      );
    }
  }
);

// Async thunks for privacy settings
export const getPrivacySettings = createAsyncThunk(
  "settings/getPrivacySettings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getPrivacySettingsApi();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to fetch privacy settings" }
      );
    }
  }
);

export const updatePrivacySettings = createAsyncThunk(
  "settings/updatePrivacySettings",
  async (data, { rejectWithValue }) => {
    try {
      const response = await updatePrivacySettingsApi(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to update privacy settings" }
      );
    }
  }
);

// Async thunks for integrations
export const getIntegrations = createAsyncThunk(
  "settings/getIntegrations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getIntegrationsApi();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to fetch integrations" }
      );
    }
  }
);

export const updateIntegrations = createAsyncThunk(
  "settings/updateIntegrations",
  async (data, { rejectWithValue }) => {
    try {
      const response = await updateIntegrationsApi(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to update integrations" }
      );
    }
  }
);

// Async thunks for subscription
export const getSubscription = createAsyncThunk(
  "settings/getSubscription",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getSubscriptionApi();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to fetch subscription" }
      );
    }
  }
);

export const updateSubscription = createAsyncThunk(
  "settings/updateSubscription",
  async (data, { rejectWithValue }) => {
    try {
      const response = await updateSubscriptionApi(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to update subscription" }
      );
    }
  }
);

// Settings slice
const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    // Local state updates for immediate UI feedback
    updateNotificationPreference: (state, action) => {
      const { key, value } = action.payload;
      state.notificationSettings[key] = value;
    },
    
    updateNotificationFrequencyLocal: (state, action) => {
      const { key, value } = action.payload;
      state.notificationFrequency[key] = value;
    },
    
    updateQuietHoursLocal: (state, action) => {
      const { key, value } = action.payload;
      state.quietHours[key] = value;
    },
    
    updatePrivacyPreference: (state, action) => {
      const { key, value } = action.payload;
      state.privacySettings[key] = value;
    },
    
    updateIntegrationPreference: (state, action) => {
      const { key, value } = action.payload;
      state.integrations[key] = value;
    },
    
    // Reset success states
    resetNotificationSuccess: (state) => {
      state.notificationSuccess = false;
    },
    
    resetPrivacySuccess: (state) => {
      state.privacySuccess = false;
    },
    
    resetIntegrationSuccess: (state) => {
      state.integrationSuccess = false;
    },
    
    resetSubscriptionSuccess: (state) => {
      state.subscriptionSuccess = false;
    },
    
    // Clear errors
    clearErrors: (state) => {
      state.error = null;
      state.notificationError = null;
      state.privacyError = null;
      state.integrationError = null;
      state.subscriptionError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Notification settings
      .addCase(getNotificationSettings.pending, (state) => {
        state.notificationLoading = true;
        state.notificationError = null;
      })
      .addCase(getNotificationSettings.fulfilled, (state, action) => {
        state.notificationLoading = false;
        state.notificationSettings = { ...state.notificationSettings, ...action.payload };
        state.notificationError = null;
      })
      .addCase(getNotificationSettings.rejected, (state, action) => {
        state.notificationLoading = false;
        state.notificationError = action.payload.message;
      })
      
      .addCase(updateNotificationSettings.pending, (state) => {
        state.notificationLoading = true;
        state.notificationError = null;
      })
      .addCase(updateNotificationSettings.fulfilled, (state, action) => {
        state.notificationLoading = false;
        state.notificationSettings = { ...state.notificationSettings, ...action.payload };
        state.notificationSuccess = true;
        state.notificationError = null;
      })
      .addCase(updateNotificationSettings.rejected, (state, action) => {
        state.notificationLoading = false;
        state.notificationError = action.payload.message;
      })
      
      // Notification frequency
      .addCase(getNotificationFrequency.pending, (state) => {
        state.notificationLoading = true;
        state.notificationError = null;
      })
      .addCase(getNotificationFrequency.fulfilled, (state, action) => {
        state.notificationLoading = false;
        state.notificationFrequency = { ...state.notificationFrequency, ...action.payload };
        state.notificationError = null;
      })
      .addCase(getNotificationFrequency.rejected, (state, action) => {
        state.notificationLoading = false;
        state.notificationError = action.payload.message;
      })
      
      .addCase(updateNotificationFrequency.pending, (state) => {
        state.notificationLoading = true;
        state.notificationError = null;
      })
      .addCase(updateNotificationFrequency.fulfilled, (state, action) => {
        state.notificationLoading = false;
        state.notificationFrequency = { ...state.notificationFrequency, ...action.payload };
        state.notificationSuccess = true;
        state.notificationError = null;
      })
      .addCase(updateNotificationFrequency.rejected, (state, action) => {
        state.notificationLoading = false;
        state.notificationError = action.payload.message;
      })
      
      // Quiet hours
      .addCase(getQuietHours.pending, (state) => {
        state.notificationLoading = true;
        state.notificationError = null;
      })
      .addCase(getQuietHours.fulfilled, (state, action) => {
        state.notificationLoading = false;
        state.quietHours = { ...state.quietHours, ...action.payload };
        state.notificationError = null;
      })
      .addCase(getQuietHours.rejected, (state, action) => {
        state.notificationLoading = false;
        state.notificationError = action.payload.message;
      })
      
      .addCase(updateQuietHours.pending, (state) => {
        state.notificationLoading = true;
        state.notificationError = null;
      })
      .addCase(updateQuietHours.fulfilled, (state, action) => {
        state.notificationLoading = false;
        state.quietHours = { ...state.quietHours, ...action.payload };
        state.notificationSuccess = true;
        state.notificationError = null;
      })
      .addCase(updateQuietHours.rejected, (state, action) => {
        state.notificationLoading = false;
        state.notificationError = action.payload.message;
      })
      
      // Privacy settings
      .addCase(getPrivacySettings.pending, (state) => {
        state.privacyLoading = true;
        state.privacyError = null;
      })
      .addCase(getPrivacySettings.fulfilled, (state, action) => {
        state.privacyLoading = false;
        state.privacySettings = { ...state.privacySettings, ...action.payload };
        state.privacyError = null;
      })
      .addCase(getPrivacySettings.rejected, (state, action) => {
        state.privacyLoading = false;
        state.privacyError = action.payload.message;
      })
      
      .addCase(updatePrivacySettings.pending, (state) => {
        state.privacyLoading = true;
        state.privacyError = null;
      })
      .addCase(updatePrivacySettings.fulfilled, (state, action) => {
        state.privacyLoading = false;
        state.privacySettings = { ...state.privacySettings, ...action.payload };
        state.privacySuccess = true;
        state.privacyError = null;
      })
      .addCase(updatePrivacySettings.rejected, (state, action) => {
        state.privacyLoading = false;
        state.privacyError = action.payload.message;
      })
      
      // Integrations
      .addCase(getIntegrations.pending, (state) => {
        state.integrationLoading = true;
        state.integrationError = null;
      })
      .addCase(getIntegrations.fulfilled, (state, action) => {
        state.integrationLoading = false;
        state.integrations = { ...state.integrations, ...action.payload };
        state.integrationError = null;
      })
      .addCase(getIntegrations.rejected, (state, action) => {
        state.integrationLoading = false;
        state.integrationError = action.payload.message;
      })
      
      .addCase(updateIntegrations.pending, (state) => {
        state.integrationLoading = true;
        state.integrationError = null;
      })
      .addCase(updateIntegrations.fulfilled, (state, action) => {
        state.integrationLoading = false;
        state.integrations = { ...state.integrations, ...action.payload };
        state.integrationSuccess = true;
        state.integrationError = null;
      })
      .addCase(updateIntegrations.rejected, (state, action) => {
        state.integrationLoading = false;
        state.integrationError = action.payload.message;
      })
      
      // Subscription
      .addCase(getSubscription.pending, (state) => {
        state.subscriptionLoading = true;
        state.subscriptionError = null;
      })
      .addCase(getSubscription.fulfilled, (state, action) => {
        state.subscriptionLoading = false;
        state.subscription = { ...state.subscription, ...action.payload };
        state.subscriptionError = null;
      })
      .addCase(getSubscription.rejected, (state, action) => {
        state.subscriptionLoading = false;
        state.subscriptionError = action.payload.message;
      })
      
      .addCase(updateSubscription.pending, (state) => {
        state.subscriptionLoading = true;
        state.subscriptionError = null;
      })
      .addCase(updateSubscription.fulfilled, (state, action) => {
        state.subscriptionLoading = false;
        state.subscription = { ...state.subscription, ...action.payload };
        state.subscriptionSuccess = true;
        state.subscriptionError = null;
      })
      .addCase(updateSubscription.rejected, (state, action) => {
        state.subscriptionLoading = false;
        state.subscriptionError = action.payload.message;
      });
  },
});

export const {
  updateNotificationPreference,
  updateNotificationFrequencyLocal,
  updateQuietHoursLocal,
  updatePrivacyPreference,
  updateIntegrationPreference,
  resetNotificationSuccess,
  resetPrivacySuccess,
  resetIntegrationSuccess,
  resetSubscriptionSuccess,
  clearErrors,
} = settingsSlice.actions;

export default settingsSlice.reducer;
