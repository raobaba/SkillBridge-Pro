import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getSyncStatusApi,
  getIntegrationsApi,
  connectGitHubApi,
  connectStackOverflowApi,
  disconnectIntegrationApi,
  triggerSyncApi,
  getSyncHistoryApi,
  getSyncDataApi,
  getSkillScoresApi,
} from "./portfolioSyncAction";

// Initial state
const initialState = {
  syncStatus: null,
  integrations: [],
  syncHistory: [],
  syncData: [],
  skillScores: null,
  loading: false,
  syncing: false,
  error: null,
  message: null,
};

// Async thunks
export const getSyncStatus = createAsyncThunk(
  "portfolioSync/getSyncStatus",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getSyncStatusApi();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to get sync status" }
      );
    }
  }
);

export const getIntegrations = createAsyncThunk(
  "portfolioSync/getIntegrations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getIntegrationsApi();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to get integrations" }
      );
    }
  }
);

export const connectGitHub = createAsyncThunk(
  "portfolioSync/connectGitHub",
  async (data, { rejectWithValue }) => {
    try {
      const response = await connectGitHubApi(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to connect GitHub" }
      );
    }
  }
);

export const connectStackOverflow = createAsyncThunk(
  "portfolioSync/connectStackOverflow",
  async (data, { rejectWithValue }) => {
    try {
      console.log("Connecting StackOverflow with data:", data);
      const response = await connectStackOverflowApi(data);
      console.log("StackOverflow connection response:", response);
      return response.data;
    } catch (error) {
      console.error("StackOverflow connection error:", error);
      console.error("Error details:", {
        message: error?.message,
        response: error?.response,
        data: error?.response?.data,
        status: error?.response?.status,
        code: error?.code,
        name: error?.name,
      });
      
      // Handle different error types
      if (error?.response?.data) {
        // HTTP error with response
        return rejectWithValue(error.response.data);
      } else if (error?.message) {
        // Network or other error
        return rejectWithValue({ 
          message: error.message || "Failed to connect StackOverflow" 
        });
      } else {
        // Unknown error
        return rejectWithValue({ 
          message: "Failed to connect StackOverflow. Please check your connection and try again." 
        });
      }
    }
  }
);

export const disconnectIntegration = createAsyncThunk(
  "portfolioSync/disconnectIntegration",
  async (platform, { rejectWithValue }) => {
    try {
      const response = await disconnectIntegrationApi(platform);
      return { ...response.data, platform };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to disconnect integration" }
      );
    }
  }
);

export const triggerSync = createAsyncThunk(
  "portfolioSync/triggerSync",
  async (data, { rejectWithValue }) => {
    try {
      const response = await triggerSyncApi(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to trigger sync" }
      );
    }
  }
);

export const getSyncHistory = createAsyncThunk(
  "portfolioSync/getSyncHistory",
  async (limit = 10, { rejectWithValue }) => {
    try {
      const response = await getSyncHistoryApi(limit);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to get sync history" }
      );
    }
  }
);

export const getSyncData = createAsyncThunk(
  "portfolioSync/getSyncData",
  async ({ platform = null, dataType = null } = {}, { rejectWithValue }) => {
    try {
      const response = await getSyncDataApi(platform, dataType);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to get sync data" }
      );
    }
  }
);

export const getSkillScores = createAsyncThunk(
  "portfolioSync/getSkillScores",
  async (platform = null, { rejectWithValue }) => {
    try {
      const response = await getSkillScoresApi(platform);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to get skill scores" }
      );
    }
  }
);

// Slice
const portfolioSyncSlice = createSlice({
  name: "portfolioSync",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.message = null;
    },
    setSyncing: (state, action) => {
      state.syncing = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Get Sync Status
    builder
      .addCase(getSyncStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSyncStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.syncStatus = action.payload?.data || action.payload;
      })
      .addCase(getSyncStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to get sync status";
      });

    // Get Integrations
    builder
      .addCase(getIntegrations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIntegrations.fulfilled, (state, action) => {
        state.loading = false;
        state.integrations = action.payload?.data || action.payload || [];
      })
      .addCase(getIntegrations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to get integrations";
      });

    // Connect GitHub
    builder
      .addCase(connectGitHub.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(connectGitHub.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || "GitHub connected successfully";
        // Refresh integrations after connecting
      })
      .addCase(connectGitHub.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to connect GitHub";
      });

    // Connect StackOverflow
    builder
      .addCase(connectStackOverflow.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(connectStackOverflow.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || "StackOverflow connected successfully";
      })
      .addCase(connectStackOverflow.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to connect StackOverflow";
      });

    // Disconnect Integration
    builder
      .addCase(disconnectIntegration.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(disconnectIntegration.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || "Integration disconnected successfully";
        // Remove from integrations list
        state.integrations = state.integrations.filter(
          (integration) => integration.platform !== action.payload.platform
        );
      })
      .addCase(disconnectIntegration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to disconnect integration";
      });

    // Trigger Sync
    builder
      .addCase(triggerSync.pending, (state) => {
        state.syncing = true;
        state.error = null;
      })
      .addCase(triggerSync.fulfilled, (state, action) => {
        state.syncing = false;
        state.message = action.payload?.message || "Sync completed successfully";
        // Refresh sync status after sync
      })
      .addCase(triggerSync.rejected, (state, action) => {
        state.syncing = false;
        state.error = action.payload?.message || "Failed to trigger sync";
      });

    // Get Sync History
    builder
      .addCase(getSyncHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSyncHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.syncHistory = action.payload?.data || action.payload || [];
      })
      .addCase(getSyncHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to get sync history";
      });

    // Get Sync Data
    builder
      .addCase(getSyncData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSyncData.fulfilled, (state, action) => {
        state.loading = false;
        state.syncData = action.payload?.data || action.payload || [];
      })
      .addCase(getSyncData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to get sync data";
      });

    // Get Skill Scores
    builder
      .addCase(getSkillScores.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSkillScores.fulfilled, (state, action) => {
        state.loading = false;
        state.skillScores = action.payload?.data || action.payload;
      })
      .addCase(getSkillScores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to get skill scores";
      });
  },
});

export const { clearError, setSyncing } = portfolioSyncSlice.actions;
export default portfolioSyncSlice.reducer;

