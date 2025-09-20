import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginUserApi,
  registerUserApi,
  updateUserProfileApi,
  getUserProfileApi,
  deleteUserProfileApi,
  updateOAuthDetailsApi,
  emailVerification,
  changeCurrentPassword,
  resetPassword,
  forgetPassword,
  logoutApi,
} from "./userAction";
import { removeToken, setToken } from "../../../services/utils";

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  message: null,
  lastAction: null, // Track last action for debugging
};

export const loginUser = createAsyncThunk(
  "user/login",
  async (data, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(data);
      if (response.data?.token) setToken(response.data.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Login failed" }
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  "user/register",
  async (data, { rejectWithValue }) => {
    try {
      const response = await registerUserApi(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || "Registration failed");
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "profile/update",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await updateUserProfileApi(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || "Profile update failed");
    }
  }
);

export const getUserProfile = createAsyncThunk(
  "profile/get",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserProfileApi();
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || "Failed to get profile");
    }
  }
);

export const deleteUser = createAsyncThunk(
  "profile/delete",
  async (_, { rejectWithValue }) => {
    try {
      const response = await deleteUserProfileApi();
      removeToken();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Failed to delete profile"
      );
    }
  }
);

export const updateOAuth = createAsyncThunk(
  "profile/updateOAuth",
  async (data, { rejectWithValue }) => {
    try {
      const response = await updateOAuthDetailsApi(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || "OAuth update failed");
    }
  }
);

export const verifyEmail = createAsyncThunk(
  "profile/verifyEmail",
  async (id, { rejectWithValue }) => {
    try {
      const response = await emailVerification(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Email verification failed"
      );
    }
  }
);

export const changePassword = createAsyncThunk(
  "profile/changePassword",
  async (data, { rejectWithValue }) => {
    try {
      const response = await changeCurrentPassword(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || "Change password failed");
    }
  }
);

export const forgetPassPassword = createAsyncThunk(
  "profile/forgetPassword",
  async (data, { rejectWithValue }) => {
    try {
      const response = await forgetPassword(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || "Forgot password failed");
    }
  }
);

export const resetPassPassword = createAsyncThunk(
  "profile/resetPassword",
  async (params, { rejectWithValue }) => {
    try {
      const response = await resetPassword(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || "Reset password failed");
    }
  }
);

// Logout
export const logOut = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi(); // optional backend call
      removeToken();
      return {}; // reset state
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Logout failed" }
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearAuthState: (state) => {
      state.error = null;
      state.message = null;
      state.lastAction = 'clearAuthState';
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
      state.lastAction = 'setLoading';
    },
    clearError: (state) => {
      state.error = null;
      state.lastAction = 'clearError';
    },
    clearMessage: (state) => {
      state.message = null;
      state.lastAction = 'clearMessage';
    },
  },
  extraReducers: (builder) => {
    builder

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || action.payload;
        state.isAuthenticated = true;
        state.message = action.payload.message || "Login successful";
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Login failed";
        state.isAuthenticated = false;
        state.message = null;
      })

      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || action.payload;
        state.isAuthenticated = true;
        state.message = action.payload.message || "Registration successful";
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Registration failed";
        state.message = null;
      })

      // Logout
      .addCase(logOut.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(logOut.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.message = "Logout successful";
        state.error = null;
      })
      .addCase(logOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Logout failed";
        state.message = null;
      })

      // Update Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || action.payload;
        state.message =
          action.payload.message || "Profile updated successfully";
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Profile update failed";
        state.message = null;
      })

      // Get Profile
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || action.payload;
        state.error = null;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Failed to get profile";
        state.message = null;
      })

      // Delete Profile
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.message = "Profile deleted successfully";
        state.error = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Failed to delete profile";
        state.message = null;
      })

      // Update OAuth
      .addCase(updateOAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(updateOAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || action.payload;
        state.message =
          action.payload.message || "OAuth details updated successfully";
        state.error = null;
      })
      .addCase(updateOAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "OAuth update failed";
        state.message = null;
      })

      // Verify Email
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || "Email verified successfully";
        state.error = null;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Email verification failed";
        state.message = null;
      })

      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message =
          action.payload.message || "Password changed successfully";
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Change password failed";
        state.message = null;
      })

      // Forget Password
      .addCase(forgetPassPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(forgetPassPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message =
          action.payload.message || "Password reset email sent successfully";
        state.error = null;
      })
      .addCase(forgetPassPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Forgot password failed";
        state.message = null;
      })

      // Reset Password
      .addCase(resetPassPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(resetPassPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || "Password reset successfully";
        state.error = null;
      })
      .addCase(resetPassPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Reset password failed";
        state.message = null;
      });
  },
});

export const { clearAuthState, setLoading, clearError, clearMessage } = userSlice.actions;
export default userSlice.reducer;
