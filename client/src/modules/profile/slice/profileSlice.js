import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getProjectOwnerStatsApi,
  getProjectOwnerProjectsApi,
  getProjectOwnerReviewsApi,
  getProjectOwnerDevelopersApi,
} from './profileAction';

// Re-export user profile functions from user slice
export {
  getUserProfile,
  updateUserProfile,
  deleteUser,
  clearAuthState,
} from '../../authentication/slice/userSlice';

// Project Owner Profile Async Thunks
export const fetchProjectOwnerStats = createAsyncThunk(
  'profile/fetchProjectOwnerStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getProjectOwnerStatsApi();
      // Handle different response formats
      if (response.data && response.data.stats) {
        return response.data.stats;
      } else if (response.data) {
        return response.data;
      } else {
        return response;
      }
    } catch (error) {
      console.error('Project owner stats error:', error);
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch project owner stats');
    }
  }
);

export const fetchProjectOwnerProjects = createAsyncThunk(
  'profile/fetchProjectOwnerProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getProjectOwnerProjectsApi();
      // Handle different response formats
      if (response.data && response.data.projects) {
        return response.data.projects;
      } else if (response.data) {
        return response.data;
      } else {
        return response;
      }
    } catch (error) {
      console.error('Project owner projects error:', error);
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch project owner projects');
    }
  }
);

export const fetchProjectOwnerReviews = createAsyncThunk(
  'profile/fetchProjectOwnerReviews',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getProjectOwnerReviewsApi();
      return response.data.reviews;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch project owner reviews');
    }
  }
);

export const fetchProjectOwnerDevelopers = createAsyncThunk(
  'profile/fetchProjectOwnerDevelopers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getProjectOwnerDevelopersApi();
      return response.data.developers;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch project owner developers');
    }
  }
);



// Initial state
const initialState = {
  // Project Owner Profile Data
  projectOwnerStats: {
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalApplicants: 0,
    newApplicantsThisWeek: 0,
    avgRating: 0,
    completionRate: 0,
    developerReviews: 0
  },
  projectOwnerProjects: [],
  projectOwnerReviews: [],
  projectOwnerDevelopers: [],
  
  // Project Owner Loading States
  projectOwnerLoading: {
    stats: false,
    projects: false,
    reviews: false,
    developers: false
  },
  
  // Project Owner Error States
  projectOwnerError: {
    stats: null,
    projects: null,
    reviews: null,
    developers: null
  },

};

// Profile slice
const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    // Clear all project owner data
    clearProjectOwnerData: (state) => {
      state.projectOwnerStats = initialState.projectOwnerStats;
      state.projectOwnerProjects = [];
      state.projectOwnerReviews = [];
      state.projectOwnerDevelopers = [];
      state.projectOwnerError = initialState.projectOwnerError;
    },
    
    // Clear specific error
    clearProjectOwnerError: (state, action) => {
      const { type } = action.payload;
      state.projectOwnerError[type] = null;
    },
    
    // Update developer status (for developer management)
    updateDeveloperStatus: (state, action) => {
      const { developerId, newStatus } = action.payload;
      const developer = state.projectOwnerDevelopers.find(dev => dev.id === developerId);
      if (developer) {
        developer.status = newStatus;
      }
    },

    // Clear endorsements data
    clearEndorsementsData: (state) => {
      state.userEndorsements = [];
      state.userSkillRatings = [];
      state.endorsementsError = initialState.endorsementsError;
    },
    
    // Clear specific endorsement error
    clearEndorsementError: (state, action) => {
      const { type } = action.payload;
      state.endorsementsError[type] = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch project owner stats
    builder
      .addCase(fetchProjectOwnerStats.pending, (state) => {
        state.projectOwnerLoading.stats = true;
        state.projectOwnerError.stats = null;
      })
      .addCase(fetchProjectOwnerStats.fulfilled, (state, action) => {
        state.projectOwnerLoading.stats = false;
        state.projectOwnerStats = action.payload;
      })
      .addCase(fetchProjectOwnerStats.rejected, (state, action) => {
        state.projectOwnerLoading.stats = false;
        state.projectOwnerError.stats = action.payload;
      })
      
    // Fetch project owner projects
    builder
      .addCase(fetchProjectOwnerProjects.pending, (state) => {
        state.projectOwnerLoading.projects = true;
        state.projectOwnerError.projects = null;
      })
      .addCase(fetchProjectOwnerProjects.fulfilled, (state, action) => {
        state.projectOwnerLoading.projects = false;
        state.projectOwnerProjects = action.payload;
      })
      .addCase(fetchProjectOwnerProjects.rejected, (state, action) => {
        state.projectOwnerLoading.projects = false;
        state.projectOwnerError.projects = action.payload;
      })
      
    // Fetch project owner reviews
    builder
      .addCase(fetchProjectOwnerReviews.pending, (state) => {
        state.projectOwnerLoading.reviews = true;
        state.projectOwnerError.reviews = null;
      })
      .addCase(fetchProjectOwnerReviews.fulfilled, (state, action) => {
        state.projectOwnerLoading.reviews = false;
        state.projectOwnerReviews = action.payload;
      })
      .addCase(fetchProjectOwnerReviews.rejected, (state, action) => {
        state.projectOwnerLoading.reviews = false;
        state.projectOwnerError.reviews = action.payload;
      })
      
    // Fetch project owner developers
    builder
      .addCase(fetchProjectOwnerDevelopers.pending, (state) => {
        state.projectOwnerLoading.developers = true;
        state.projectOwnerError.developers = null;
      })
      .addCase(fetchProjectOwnerDevelopers.fulfilled, (state, action) => {
        state.projectOwnerLoading.developers = false;
        state.projectOwnerDevelopers = action.payload;
      })
      .addCase(fetchProjectOwnerDevelopers.rejected, (state, action) => {
        state.projectOwnerLoading.developers = false;
        state.projectOwnerError.developers = action.payload;
      })
      
  }
});

// Export actions
export const {
  clearProjectOwnerData,
  clearProjectOwnerError,
  updateDeveloperStatus
} = profileSlice.actions;

// Export selectors
export const selectProjectOwnerStats = (state) => state.profile.projectOwnerStats;
export const selectProjectOwnerProjects = (state) => state.profile.projectOwnerProjects;
export const selectProjectOwnerReviews = (state) => state.profile.projectOwnerReviews;
export const selectProjectOwnerDevelopers = (state) => state.profile.projectOwnerDevelopers;
export const selectProjectOwnerLoading = (state) => state.profile.projectOwnerLoading;
export const selectProjectOwnerError = (state) => state.profile.projectOwnerError;


// Export reducer
export default profileSlice.reducer;