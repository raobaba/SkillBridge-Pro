import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAdminAnalyticsApi } from "./DashboardAction";

// Get admin analytics
export const getAdminAnalytics = createAsyncThunk(
  "dashboard/getAdminAnalytics",
  async (timeframe = '6m', { rejectWithValue }) => {
    try {
      const response = await getAdminAnalyticsApi(timeframe);
      // Backend returns: { success: true, data: {...}, ... }
      // Axios wraps it, so response.data is the object above
      // response.data.data is the analytics object
      const analytics = response?.data?.data || response?.data || {};
      return analytics;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch admin analytics"
      );
    }
  }
);

// Initial state
const initialState = {
  adminAnalytics: null,
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAnalytics: (state) => {
      state.adminAnalytics = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get admin analytics
      .addCase(getAdminAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.adminAnalytics = action.payload;
        state.error = null;
      })
      .addCase(getAdminAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearAnalytics } = dashboardSlice.actions;
export default dashboardSlice.reducer;

