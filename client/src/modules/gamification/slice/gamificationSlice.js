import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getDeveloperStatsApi,
  getDeveloperReviewsApi,
  getDeveloperEndorsementsApi,
  getLeaderboardApi,
  getDeveloperAchievementsApi,
  getProjectOwnerStatsApi,
  getPendingEvaluationsApi,
  getEvaluationHistoryApi,
  submitEvaluationApi,
  getFlaggedReviewsApi,
  moderateReviewApi,
  getPendingVerificationsApi,
  verifyItemApi,
  getProjectOwnerLeaderboardApi,
  getAdminGamificationStatsApi,
} from "./gamificationAction";

// Initial state
const initialState = {
  // Developer stats
  stats: null,
  reviews: [],
  endorsements: [],
  leaderboard: [],
  achievements: [],
  
  // Project Owner stats
  projectOwnerStats: null,
  pendingEvaluations: [],
  evaluationHistory: [],
  
  // Admin Gamification
  flaggedReviews: [],
  pendingVerifications: [],
  projectOwnerLeaderboard: [],
  adminGamificationStats: null,
  
  // Loading states
  loading: false,
  statsLoading: false,
  reviewsLoading: false,
  endorsementsLoading: false,
  leaderboardLoading: false,
  achievementsLoading: false,
  projectOwnerStatsLoading: false,
  pendingEvaluationsLoading: false,
  evaluationHistoryLoading: false,
  submittingEvaluation: false,
  flaggedReviewsLoading: false,
  pendingVerificationsLoading: false,
  projectOwnerLeaderboardLoading: false,
  adminGamificationStatsLoading: false,
  moderatingReview: false,
  verifyingItem: false,
  
  // Error states
  error: null,
};

// Async thunks
export const getDeveloperStats = createAsyncThunk(
  "gamification/getDeveloperStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getDeveloperStatsApi();
      // Backend returns: { success: true, data: {...} }
      // Axios wraps it, so response.data is the object above
      // response.data.data is the stats object
      return response?.data?.data || response?.data || {};
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message || "Failed to fetch developer stats",
      });
    }
  }
);

export const getDeveloperReviews = createAsyncThunk(
  "gamification/getDeveloperReviews",
  async (limit = 10, { rejectWithValue }) => {
    try {
      const response = await getDeveloperReviewsApi(limit);
      // Backend returns: { success: true, data: [...] }
      const reviews = response?.data?.data || response?.data || [];
      return Array.isArray(reviews) ? reviews : [];
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message || "Failed to fetch developer reviews",
      });
    }
  }
);

export const getDeveloperEndorsements = createAsyncThunk(
  "gamification/getDeveloperEndorsements",
  async (limit = 10, { rejectWithValue }) => {
    try {
      const response = await getDeveloperEndorsementsApi(limit);
      // Backend returns: { success: true, data: [...] }
      const endorsements = response?.data?.data || response?.data || [];
      return Array.isArray(endorsements) ? endorsements : [];
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message || "Failed to fetch developer endorsements",
      });
    }
  }
);

export const getLeaderboard = createAsyncThunk(
  "gamification/getLeaderboard",
  async (limit = 10, { rejectWithValue }) => {
    try {
      const response = await getLeaderboardApi(limit);
      // Backend returns: { success: true, data: [...] }
      const leaderboard = response?.data?.data || response?.data || [];
      return Array.isArray(leaderboard) ? leaderboard : [];
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message || "Failed to fetch leaderboard",
      });
    }
  }
);

export const getDeveloperAchievements = createAsyncThunk(
  "gamification/getDeveloperAchievements",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getDeveloperAchievementsApi();
      // Backend returns: { success: true, data: [...] }
      const achievements = response?.data?.data || response?.data || [];
      return Array.isArray(achievements) ? achievements : [];
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message || "Failed to fetch developer achievements",
      });
    }
  }
);

// Project Owner Dashboard thunks
export const getProjectOwnerStats = createAsyncThunk(
  "gamification/getProjectOwnerStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getProjectOwnerStatsApi();
      // Backend returns: { success: true, stats: {...} }
      return response?.data?.stats || response?.data || {};
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message || "Failed to fetch project owner stats",
      });
    }
  }
);

export const getPendingEvaluations = createAsyncThunk(
  "gamification/getPendingEvaluations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getPendingEvaluationsApi();
      // Backend returns: { success: true, data: [...] }
      const evaluations = response?.data?.data || response?.data || [];
      return Array.isArray(evaluations) ? evaluations : [];
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message || "Failed to fetch pending evaluations",
      });
    }
  }
);

export const getEvaluationHistory = createAsyncThunk(
  "gamification/getEvaluationHistory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getEvaluationHistoryApi();
      // Backend returns: { success: true, data: [...] }
      const history = response?.data?.data || response?.data || [];
      return Array.isArray(history) ? history : [];
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message || "Failed to fetch evaluation history",
      });
    }
  }
);

export const submitEvaluation = createAsyncThunk(
  "gamification/submitEvaluation",
  async (evaluationData, { rejectWithValue }) => {
    try {
      const response = await submitEvaluationApi(evaluationData);
      return response.data || response;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message || "Failed to submit evaluation",
      });
    }
  }
);

// Admin Gamification thunks
export const getFlaggedReviews = createAsyncThunk(
  "gamification/getFlaggedReviews",
  async (status = 'all', { rejectWithValue }) => {
    try {
      const response = await getFlaggedReviewsApi(status);
      const reviews = response?.data?.data || response?.data || [];
      return Array.isArray(reviews) ? reviews : [];
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message || "Failed to fetch flagged reviews",
      });
    }
  }
);

export const moderateReview = createAsyncThunk(
  "gamification/moderateReview",
  async ({ reviewId, action }, { rejectWithValue }) => {
    try {
      const response = await moderateReviewApi(reviewId, action);
      return { reviewId, status: action, data: response?.data || response };
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message || "Failed to moderate review",
      });
    }
  }
);

export const getPendingVerifications = createAsyncThunk(
  "gamification/getPendingVerifications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getPendingVerificationsApi();
      const verifications = response?.data?.data || response?.data || [];
      return Array.isArray(verifications) ? verifications : [];
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message || "Failed to fetch pending verifications",
      });
    }
  }
);

export const verifyItem = createAsyncThunk(
  "gamification/verifyItem",
  async ({ itemId, action }, { rejectWithValue }) => {
    try {
      const response = await verifyItemApi(itemId, action);
      return { itemId, status: action, data: response?.data || response };
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message || "Failed to verify item",
      });
    }
  }
);

export const getProjectOwnerLeaderboard = createAsyncThunk(
  "gamification/getProjectOwnerLeaderboard",
  async (limit = 10, { rejectWithValue }) => {
    try {
      const response = await getProjectOwnerLeaderboardApi(limit);
      const leaderboard = response?.data?.data || response?.data || [];
      return Array.isArray(leaderboard) ? leaderboard : [];
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message || "Failed to fetch project owner leaderboard",
      });
    }
  }
);

export const getAdminGamificationStats = createAsyncThunk(
  "gamification/getAdminGamificationStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAdminGamificationStatsApi();
      return response?.data?.data || response?.data || {};
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message || "Failed to fetch admin gamification stats",
      });
    }
  }
);

// Slice
const gamificationSlice = createSlice({
  name: "gamification",
  initialState,
  reducers: {
    clearGamificationState: (state) => {
      return initialState;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Developer Stats
      .addCase(getDeveloperStats.pending, (state) => {
        state.statsLoading = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(getDeveloperStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.loading = false;
        state.stats = action.payload;
        state.error = null;
      })
      .addCase(getDeveloperStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch developer stats";
      })
      
      // Get Developer Reviews
      .addCase(getDeveloperReviews.pending, (state) => {
        state.reviewsLoading = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(getDeveloperReviews.fulfilled, (state, action) => {
        state.reviewsLoading = false;
        state.loading = false;
        // Payload is already an array from the thunk
        state.reviews = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(getDeveloperReviews.rejected, (state, action) => {
        state.reviewsLoading = false;
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch developer reviews";
      })
      
      // Get Developer Endorsements
      .addCase(getDeveloperEndorsements.pending, (state) => {
        state.endorsementsLoading = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(getDeveloperEndorsements.fulfilled, (state, action) => {
        state.endorsementsLoading = false;
        state.loading = false;
        // Payload is already an array from the thunk
        state.endorsements = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(getDeveloperEndorsements.rejected, (state, action) => {
        state.endorsementsLoading = false;
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch developer endorsements";
      })
      
      // Get Leaderboard
      .addCase(getLeaderboard.pending, (state) => {
        state.leaderboardLoading = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(getLeaderboard.fulfilled, (state, action) => {
        state.leaderboardLoading = false;
        state.loading = false;
        // Payload is already an array from the thunk
        state.leaderboard = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(getLeaderboard.rejected, (state, action) => {
        state.leaderboardLoading = false;
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch leaderboard";
      })
      
      // Get Developer Achievements
      .addCase(getDeveloperAchievements.pending, (state) => {
        state.achievementsLoading = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(getDeveloperAchievements.fulfilled, (state, action) => {
        state.achievementsLoading = false;
        state.loading = false;
        // Payload is already an array from the thunk
        state.achievements = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(getDeveloperAchievements.rejected, (state, action) => {
        state.achievementsLoading = false;
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch developer achievements";
      })
      
      // Get Project Owner Stats
      .addCase(getProjectOwnerStats.pending, (state) => {
        state.projectOwnerStatsLoading = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(getProjectOwnerStats.fulfilled, (state, action) => {
        state.projectOwnerStatsLoading = false;
        state.loading = false;
        state.projectOwnerStats = action.payload;
        state.error = null;
      })
      .addCase(getProjectOwnerStats.rejected, (state, action) => {
        state.projectOwnerStatsLoading = false;
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch project owner stats";
      })
      
      // Get Pending Evaluations
      .addCase(getPendingEvaluations.pending, (state) => {
        state.pendingEvaluationsLoading = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(getPendingEvaluations.fulfilled, (state, action) => {
        state.pendingEvaluationsLoading = false;
        state.loading = false;
        state.pendingEvaluations = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(getPendingEvaluations.rejected, (state, action) => {
        state.pendingEvaluationsLoading = false;
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch pending evaluations";
      })
      
      // Get Evaluation History
      .addCase(getEvaluationHistory.pending, (state) => {
        state.evaluationHistoryLoading = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(getEvaluationHistory.fulfilled, (state, action) => {
        state.evaluationHistoryLoading = false;
        state.loading = false;
        state.evaluationHistory = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(getEvaluationHistory.rejected, (state, action) => {
        state.evaluationHistoryLoading = false;
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch evaluation history";
      })
      
      // Submit Evaluation
      .addCase(submitEvaluation.pending, (state) => {
        state.submittingEvaluation = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(submitEvaluation.fulfilled, (state, action) => {
        state.submittingEvaluation = false;
        state.loading = false;
        state.error = null;
        // Remove from pending and add to history optimistically
        // The component will refresh the data
      })
      .addCase(submitEvaluation.rejected, (state, action) => {
        state.submittingEvaluation = false;
        state.loading = false;
        state.error = action.payload?.message || "Failed to submit evaluation";
      })
      
      // Get Flagged Reviews
      .addCase(getFlaggedReviews.pending, (state) => {
        state.flaggedReviewsLoading = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(getFlaggedReviews.fulfilled, (state, action) => {
        state.flaggedReviewsLoading = false;
        state.loading = false;
        state.flaggedReviews = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(getFlaggedReviews.rejected, (state, action) => {
        state.flaggedReviewsLoading = false;
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch flagged reviews";
      })
      
      // Moderate Review
      .addCase(moderateReview.pending, (state) => {
        state.moderatingReview = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(moderateReview.fulfilled, (state, action) => {
        state.moderatingReview = false;
        state.loading = false;
        // Update the review status in flaggedReviews
        const { reviewId, status } = action.payload;
        state.flaggedReviews = state.flaggedReviews.map(review =>
          review.id === reviewId ? { ...review, status } : review
        );
        state.error = null;
      })
      .addCase(moderateReview.rejected, (state, action) => {
        state.moderatingReview = false;
        state.loading = false;
        state.error = action.payload?.message || "Failed to moderate review";
      })
      
      // Get Pending Verifications
      .addCase(getPendingVerifications.pending, (state) => {
        state.pendingVerificationsLoading = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(getPendingVerifications.fulfilled, (state, action) => {
        state.pendingVerificationsLoading = false;
        state.loading = false;
        state.pendingVerifications = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(getPendingVerifications.rejected, (state, action) => {
        state.pendingVerificationsLoading = false;
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch pending verifications";
      })
      
      // Verify Item
      .addCase(verifyItem.pending, (state) => {
        state.verifyingItem = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyItem.fulfilled, (state, action) => {
        state.verifyingItem = false;
        state.loading = false;
        // Update the item status in pendingVerifications
        const { itemId, status } = action.payload;
        state.pendingVerifications = state.pendingVerifications.map(item =>
          item.id === itemId ? { ...item, status } : item
        );
        state.error = null;
      })
      .addCase(verifyItem.rejected, (state, action) => {
        state.verifyingItem = false;
        state.loading = false;
        state.error = action.payload?.message || "Failed to verify item";
      })
      
      // Get Project Owner Leaderboard
      .addCase(getProjectOwnerLeaderboard.pending, (state) => {
        state.projectOwnerLeaderboardLoading = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(getProjectOwnerLeaderboard.fulfilled, (state, action) => {
        state.projectOwnerLeaderboardLoading = false;
        state.loading = false;
        state.projectOwnerLeaderboard = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(getProjectOwnerLeaderboard.rejected, (state, action) => {
        state.projectOwnerLeaderboardLoading = false;
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch project owner leaderboard";
      })
      
      // Get Admin Gamification Stats
      .addCase(getAdminGamificationStats.pending, (state) => {
        state.adminGamificationStatsLoading = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminGamificationStats.fulfilled, (state, action) => {
        state.adminGamificationStatsLoading = false;
        state.loading = false;
        state.adminGamificationStats = action.payload || {};
        state.error = null;
      })
      .addCase(getAdminGamificationStats.rejected, (state, action) => {
        state.adminGamificationStatsLoading = false;
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch admin gamification stats";
      });
  },
});

export const { clearGamificationState, clearError } = gamificationSlice.actions;
export default gamificationSlice.reducer;
