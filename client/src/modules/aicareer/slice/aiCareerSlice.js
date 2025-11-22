import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getCareerRecommendationsApi,
  enhanceResumeApi,
  matchDevelopersApi,
  optimizeProjectApi,
  analyzeSkillGapApi,
  getSkillTrendsApi,
  getPlatformInsightsApi,
  analyzeTeamApi,
  getAdminCareerDashboardApi,
} from "./aiCareerAction";

// Initial state
const initialState = {
  // Career Recommendations
  careerRecommendations: [],
  careerRecommendationsLoading: false,
  
  // Resume Enhancement
  resumeSuggestions: [],
  resumeSuggestionsLoading: false,
  
  // Developer Matching
  developerMatches: [],
  developerMatchesLoading: false,
  
  // Project Optimization
  projectOptimizations: [],
  projectOptimizationsLoading: false,
  
  // Skill Gap Analysis
  skillGaps: [],
  skillGapsLoading: false,
  
  // Skill Trends
  skillTrends: [],
  skillTrendsLoading: false,
  
  // Platform Insights
  platformInsights: [],
  platformInsightsLoading: false,
  
  // Team Analysis
  teamAnalysis: [],
  teamAnalysisLoading: false,
  
  // Admin Career Dashboard
  adminCareerDashboard: null,
  adminCareerDashboardLoading: false,
  
  // General loading and error states
  loading: false,
  error: null,
};

// Async thunks - Connected to Backend APIs
export const getCareerRecommendations = createAsyncThunk(
  "aiCareer/getCareerRecommendations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCareerRecommendationsApi();
      // API returns { success: true, data: [...] }
      return response?.data?.data || response?.data || [];
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message || "Failed to fetch career recommendations",
      });
    }
  }
);

export const enhanceResume = createAsyncThunk(
  "aiCareer/enhanceResume",
  async (_, { rejectWithValue }) => {
    try {
      const response = await enhanceResumeApi();
      return response?.data?.data || response?.data || [];
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message || "Failed to enhance resume",
      });
    }
  }
);

export const matchDevelopers = createAsyncThunk(
  "aiCareer/matchDevelopers",
  async (projectId = null, { rejectWithValue }) => {
    try {
      const response = await matchDevelopersApi(projectId);
      return response?.data?.data || response?.data || [];
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message || "Failed to match developers",
      });
    }
  }
);

export const optimizeProject = createAsyncThunk(
  "aiCareer/optimizeProject",
  async (projectId, { rejectWithValue }) => {
    try {
      if (!projectId) {
        throw new Error('Project ID is required');
      }
      const response = await optimizeProjectApi(projectId);
      return response?.data?.data || response?.data || [];
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message || "Failed to optimize project",
      });
    }
  }
);

export const analyzeSkillGap = createAsyncThunk(
  "aiCareer/analyzeSkillGap",
  async (_, { rejectWithValue }) => {
    try {
      const response = await analyzeSkillGapApi();
      return response?.data?.data || response?.data || [];
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message || "Failed to analyze skill gap",
      });
    }
  }
);

export const getSkillTrends = createAsyncThunk(
  "aiCareer/getSkillTrends",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getSkillTrendsApi();
      return response?.data?.data || response?.data || [];
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message || "Failed to fetch skill trends",
      });
    }
  }
);

export const getPlatformInsights = createAsyncThunk(
  "aiCareer/getPlatformInsights",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getPlatformInsightsApi();
      return response?.data?.data || response?.data || [];
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message || "Failed to fetch platform insights",
      });
    }
  }
);

export const analyzeTeam = createAsyncThunk(
  "aiCareer/analyzeTeam",
  async ({ projectId = null, teamData = {} } = {}, { rejectWithValue }) => {
    try {
      const response = await analyzeTeamApi(projectId, teamData);
      return response?.data?.data || response?.data || [];
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message || "Failed to analyze team",
      });
    }
  }
);

export const getAdminCareerDashboard = createAsyncThunk(
  "aiCareer/getAdminCareerDashboard",
  async (timeframe = '6m', { rejectWithValue }) => {
    try {
      const response = await getAdminCareerDashboardApi(timeframe);
      return response?.data?.data || response?.data || { metrics: [], insights: [] };
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message || "Failed to fetch admin career dashboard",
      });
    }
  }
);

// Slice
const aiCareerSlice = createSlice({
  name: "aiCareer",
  initialState,
  reducers: {
    clearAiCareerState: (state) => {
      return initialState;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Career Recommendations
      .addCase(getCareerRecommendations.pending, (state) => {
        state.careerRecommendationsLoading = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(getCareerRecommendations.fulfilled, (state, action) => {
        state.careerRecommendationsLoading = false;
        state.loading = false;
        state.careerRecommendations = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(getCareerRecommendations.rejected, (state, action) => {
        state.careerRecommendationsLoading = false;
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch career recommendations";
      })
      
      // Enhance Resume
      .addCase(enhanceResume.pending, (state) => {
        state.resumeSuggestionsLoading = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(enhanceResume.fulfilled, (state, action) => {
        state.resumeSuggestionsLoading = false;
        state.loading = false;
        state.resumeSuggestions = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(enhanceResume.rejected, (state, action) => {
        state.resumeSuggestionsLoading = false;
        state.loading = false;
        state.error = action.payload?.message || "Failed to enhance resume";
      })
      
      // Match Developers
      .addCase(matchDevelopers.pending, (state) => {
        state.developerMatchesLoading = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(matchDevelopers.fulfilled, (state, action) => {
        state.developerMatchesLoading = false;
        state.loading = false;
        state.developerMatches = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(matchDevelopers.rejected, (state, action) => {
        state.developerMatchesLoading = false;
        state.loading = false;
        state.error = action.payload?.message || "Failed to match developers";
      })
      
      // Optimize Project
      .addCase(optimizeProject.pending, (state) => {
        state.projectOptimizationsLoading = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(optimizeProject.fulfilled, (state, action) => {
        state.projectOptimizationsLoading = false;
        state.loading = false;
        state.projectOptimizations = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(optimizeProject.rejected, (state, action) => {
        state.projectOptimizationsLoading = false;
        state.loading = false;
        state.error = action.payload?.message || "Failed to optimize project";
      })
      
      // Analyze Skill Gap
      .addCase(analyzeSkillGap.pending, (state) => {
        state.skillGapsLoading = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(analyzeSkillGap.fulfilled, (state, action) => {
        state.skillGapsLoading = false;
        state.loading = false;
        state.skillGaps = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(analyzeSkillGap.rejected, (state, action) => {
        state.skillGapsLoading = false;
        state.loading = false;
        state.error = action.payload?.message || "Failed to analyze skill gap";
      })
      
      // Get Skill Trends
      .addCase(getSkillTrends.pending, (state) => {
        state.skillTrendsLoading = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(getSkillTrends.fulfilled, (state, action) => {
        state.skillTrendsLoading = false;
        state.loading = false;
        state.skillTrends = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(getSkillTrends.rejected, (state, action) => {
        state.skillTrendsLoading = false;
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch skill trends";
      })
      
      // Get Platform Insights
      .addCase(getPlatformInsights.pending, (state) => {
        state.platformInsightsLoading = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(getPlatformInsights.fulfilled, (state, action) => {
        state.platformInsightsLoading = false;
        state.loading = false;
        state.platformInsights = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(getPlatformInsights.rejected, (state, action) => {
        state.platformInsightsLoading = false;
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch platform insights";
      })
      
      // Analyze Team
      .addCase(analyzeTeam.pending, (state) => {
        state.teamAnalysisLoading = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(analyzeTeam.fulfilled, (state, action) => {
        state.teamAnalysisLoading = false;
        state.loading = false;
        state.teamAnalysis = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(analyzeTeam.rejected, (state, action) => {
        state.teamAnalysisLoading = false;
        state.loading = false;
        state.error = action.payload?.message || "Failed to analyze team";
      })
      
      // Get Admin Career Dashboard
      .addCase(getAdminCareerDashboard.pending, (state) => {
        state.adminCareerDashboardLoading = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminCareerDashboard.fulfilled, (state, action) => {
        state.adminCareerDashboardLoading = false;
        state.loading = false;
        state.adminCareerDashboard = action.payload || { metrics: [], insights: [] };
        state.error = null;
      })
      .addCase(getAdminCareerDashboard.rejected, (state, action) => {
        state.adminCareerDashboardLoading = false;
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch admin career dashboard";
      });
  },
});

export const { clearAiCareerState, clearError } = aiCareerSlice.actions;
export default aiCareerSlice.reducer;

