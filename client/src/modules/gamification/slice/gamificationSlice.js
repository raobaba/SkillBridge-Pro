import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getDeveloperStatsApi,
  getDeveloperReviewsApi,
  getDeveloperEndorsementsApi,
  getLeaderboardApi,
  getDeveloperAchievementsApi,
} from "./gamificationAction";

// Initial state
const initialState = {
  // Developer stats
  stats: null,
  reviews: [],
  endorsements: [],
  leaderboard: [],
  achievements: [],
  
  // Loading states
  loading: false,
  statsLoading: false,
  reviewsLoading: false,
  endorsementsLoading: false,
  leaderboardLoading: false,
  achievementsLoading: false,
  
  // Error states
  error: null,
};

// Async thunks
export const getDeveloperStats = createAsyncThunk(
  "gamification/getDeveloperStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getDeveloperStatsApi();
      return response.data;
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
      return response.data;
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
      return response.data;
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
      return response.data;
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
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message || "Failed to fetch developer achievements",
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
        // Ensure reviews is always an array
        const payload = action.payload;
        state.reviews = Array.isArray(payload) ? payload : (Array.isArray(payload?.data) ? payload.data : []);
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
        // Ensure endorsements is always an array
        const payload = action.payload;
        state.endorsements = Array.isArray(payload) ? payload : (Array.isArray(payload?.data) ? payload.data : []);
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
        // Ensure leaderboard is always an array
        const payload = action.payload;
        state.leaderboard = Array.isArray(payload) ? payload : (Array.isArray(payload?.data) ? payload.data : []);
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
        // Ensure achievements is always an array
        const payload = action.payload;
        state.achievements = Array.isArray(payload) ? payload : (Array.isArray(payload?.data) ? payload.data : []);
        state.error = null;
      })
      .addCase(getDeveloperAchievements.rejected, (state, action) => {
        state.achievementsLoading = false;
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch developer achievements";
      });
  },
});

export const { clearGamificationState, clearError } = gamificationSlice.actions;
export default gamificationSlice.reducer;
