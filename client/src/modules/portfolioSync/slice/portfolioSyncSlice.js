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
  getDevelopersApi,
  getDeveloperPortfolioSyncDataApi,
} from "./portfolioSyncAction";

// Initial state
const initialState = {
  syncStatus: null,
  integrations: [],
  syncHistory: [],
  syncData: [],
  skillScores: null,
  developers: [], // Developers list with portfolio sync data (for project owners)
  developersLoading: false,
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

// Get developers with portfolio sync data (for project owners)
export const getDevelopersWithPortfolioData = createAsyncThunk(
  "portfolioSync/getDevelopersWithPortfolioData",
  async (params = {}, { rejectWithValue }) => {
    try {
      // Fetch developers list
      const developersResponse = await getDevelopersApi(params);
      
      if (!developersResponse.data?.success || !developersResponse.data?.developers) {
        return { developers: [] };
      }

      const developersList = developersResponse.data.developers;
      
      // For each developer, try to fetch their portfolio sync data
      // Note: Currently portfolio sync APIs only work for authenticated user
      // This will be populated when backend supports querying other users' data
      const developersWithPortfolioData = await Promise.all(
        developersList.map(async (developer) => {
          try {
            // Try to get portfolio sync data from API
            const portfolioDataResponse = await getDeveloperPortfolioSyncDataApi(developer.id);
            const portfolioData = portfolioDataResponse?.data?.data || portfolioDataResponse?.data || null;
            
            // Extract skills from portfolio sync data or developer's profile
            let topSkills = ["No skills data"];
            if (portfolioData?.skills && Object.keys(portfolioData.skills).length > 0) {
              // Use skills from portfolio sync data
              topSkills = Object.keys(portfolioData.skills).slice(0, 4);
            } else if (developer.skills && typeof developer.skills === 'object') {
              // Fallback to developer's profile skills
              topSkills = Object.keys(developer.skills).slice(0, 4);
            } else if (developer.domainPreferences) {
              // Fallback to domainPreferences
              topSkills = developer.domainPreferences
                .split(',')
                .map(d => d.trim())
                .filter(d => d.length > 0)
                .slice(0, 4);
            }

            // Get portfolio sync data from API response
            const githubSyncData = portfolioData?.integrations?.github || {};
            const stackoverflowSyncData = portfolioData?.integrations?.stackoverflow || {};
            const overallScore = portfolioData?.overallScore || 0;

            // Check if platforms are connected (from API or URL presence)
            const githubConnected = githubSyncData.connected || !!(developer.githubUrl && developer.githubUrl.trim());
            const linkedinConnected = !!(developer.linkedinUrl && developer.linkedinUrl.trim());
            const stackoverflowConnected = stackoverflowSyncData.connected || !!(developer.stackoverflowUrl && developer.stackoverflowUrl.trim());
            const portfolioConnected = !!(developer.portfolioUrl && developer.portfolioUrl.trim());

            // Format last sync date
            const formatLastSync = (dateString) => {
              if (!dateString) return "Never";
              const date = new Date(dateString);
              const hoursAgo = Math.floor((new Date() - date) / (1000 * 60 * 60));
              if (hoursAgo < 24) return `${hoursAgo} ${hoursAgo === 1 ? 'hour' : 'hours'} ago`;
              if (hoursAgo < 168) return `${Math.floor(hoursAgo / 24)} ${Math.floor(hoursAgo / 24) === 1 ? 'day' : 'days'} ago`;
              return `${Math.floor(hoursAgo / 168)} ${Math.floor(hoursAgo / 168) === 1 ? 'week' : 'weeks'} ago`;
            };

            // Transform to component format
            return {
              id: developer.id,
              name: developer.name || "Unknown",
              title: developer.bio || developer.domainPreferences || "Developer",
              location: developer.location || "Not specified",
              rating: overallScore || developer.portfolioScore || 0, // Use overallScore from portfolio sync
              experience: developer.experience || "Not specified",
              avatarUrl: developer.avatarUrl || null,
              skills: topSkills,
              github: {
                connected: githubConnected,
                url: developer.githubUrl || null,
                projects: githubSyncData.dataCount || 0,
                commits: 0,
                stars: 0,
                skillScore: overallScore || 0,
                lastSync: formatLastSync(githubSyncData.lastSync)
              },
              linkedin: {
                connected: linkedinConnected,
                url: developer.linkedinUrl || null,
                connections: 0,
                skillScore: 0
              },
              stackoverflow: {
                connected: stackoverflowConnected,
                url: developer.stackoverflowUrl || null,
                reputation: 0,
                answers: stackoverflowSyncData.dataCount || 0,
                skillScore: overallScore || 0,
                lastSync: formatLastSync(stackoverflowSyncData.lastSync)
              },
              portfolio: {
                connected: portfolioConnected,
                url: developer.portfolioUrl || null,
                projects: [],
                contributions: 0,
                lastActivity: "Never"
              }
            };
          } catch (error) {
            // Return developer with basic data if portfolio sync fails
            // Extract skills from developer's profile
            let topSkills = ["No skills data"];
            if (developer.skills && typeof developer.skills === 'object') {
              topSkills = Object.keys(developer.skills).slice(0, 4);
            } else if (developer.domainPreferences) {
              topSkills = developer.domainPreferences
                .split(',')
                .map(d => d.trim())
                .filter(d => d.length > 0)
                .slice(0, 4);
            }

            // Check if platforms are connected based on URL presence
            const githubConnected = !!(developer.githubUrl && developer.githubUrl.trim());
            const linkedinConnected = !!(developer.linkedinUrl && developer.linkedinUrl.trim());
            const stackoverflowConnected = !!(developer.stackoverflowUrl && developer.stackoverflowUrl.trim());
            const portfolioConnected = !!(developer.portfolioUrl && developer.portfolioUrl.trim());

            return {
              id: developer.id,
              name: developer.name || "Unknown",
              title: developer.bio || developer.domainPreferences || "Developer",
              location: developer.location || "Not specified",
              rating: developer.portfolioScore || 0,
              experience: developer.experience || "Not specified",
              avatarUrl: developer.avatarUrl || null,
              skills: topSkills,
              github: {
                connected: githubConnected,
                url: developer.githubUrl || null,
                projects: 0,
                commits: 0,
                stars: 0,
                skillScore: 0
              },
              linkedin: {
                connected: linkedinConnected,
                url: developer.linkedinUrl || null,
                connections: 0,
                skillScore: 0
              },
              stackoverflow: {
                connected: stackoverflowConnected,
                url: developer.stackoverflowUrl || null,
                reputation: 0,
                answers: 0,
                skillScore: 0
              },
              portfolio: {
                connected: portfolioConnected,
                url: developer.portfolioUrl || null,
                projects: [],
                contributions: 0,
                lastActivity: "Never"
              }
            };
          }
        })
      );

      return { developers: developersWithPortfolioData };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to fetch developers with portfolio data" }
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

    // Get Developers with Portfolio Data
    builder
      .addCase(getDevelopersWithPortfolioData.pending, (state) => {
        state.developersLoading = true;
        state.error = null;
      })
      .addCase(getDevelopersWithPortfolioData.fulfilled, (state, action) => {
        state.developersLoading = false;
        state.developers = action.payload?.developers || [];
      })
      .addCase(getDevelopersWithPortfolioData.rejected, (state, action) => {
        state.developersLoading = false;
        state.error = action.payload?.message || "Failed to fetch developers with portfolio data";
        state.developers = [];
      });
  },
});

export const { clearError, setSyncing } = portfolioSyncSlice.actions;
export default portfolioSyncSlice.reducer;

