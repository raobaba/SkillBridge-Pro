import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createProjectApi,
  getProjectApi,
  listProjectsApi,
  updateProjectApi,
  deleteProjectApi,
  applyToProjectApi,
  updateApplicantStatusApi,
  listApplicantsApi,
  createInviteApi,
  getMyInvitesApi,
  respondInviteApi,
  addFileApi,
  getProjectFilesApi,
  addUpdateApi,
  addReviewApi,
  addBoostApi,
  getProjectUpdatesApi,
  getProjectReviewsApi,
  getProjectBoostsApi,
  getProjectStatsApi,
  searchProjectsApi,
  getProjectRecommendationsApi,
  addProjectFavoriteApi,
  removeProjectFavoriteApi,
  getProjectFavoritesApi,
  addProjectCommentApi,
  getProjectCommentsApi,
  updateProjectCommentApi,
  deleteProjectCommentApi,
} from "./projectAction";

// Initial state
const initialState = {
  // Project data
  projects: [],
  currentProject: null,
  projectFiles: [],
  projectApplicants: [],
  myInvites: [],
  projectUpdates: [],
  projectReviews: [],
  projectBoosts: [],
  projectStats: null,
  searchResults: [],
  recommendations: [],
  favorites: [],
  projectComments: [],
  
  // Loading states
  loading: false,
  projectsLoading: false,
  projectLoading: false,
  applicantsLoading: false,
  invitesLoading: false,
  filesLoading: false,
  updatesLoading: false,
  reviewsLoading: false,
  boostsLoading: false,
  statsLoading: false,
  searchLoading: false,
  recommendationsLoading: false,
  favoritesLoading: false,
  commentsLoading: false,
  
  // Error and message states
  error: null,
  message: null,
  lastAction: null,
};

// Project CRUD Operations
export const createProject = createAsyncThunk(
  "project/create",
  async (data, { rejectWithValue }) => {
    try {
      const response = await createProjectApi(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Project creation failed" }
      );
    }
  }
);

export const getProject = createAsyncThunk(
  "project/get",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getProjectApi(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to fetch project" }
      );
    }
  }
);

export const listProjects = createAsyncThunk(
  "project/list",
  async (params, { rejectWithValue }) => {
    try {
      const response = await listProjectsApi(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to fetch projects" }
      );
    }
  }
);

export const updateProject = createAsyncThunk(
  "project/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await updateProjectApi(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Project update failed" }
      );
    }
  }
);

export const deleteProject = createAsyncThunk(
  "project/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteProjectApi(id);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Project deletion failed" }
      );
    }
  }
);

// Application Management
export const applyToProject = createAsyncThunk(
  "project/apply",
  async (data, { rejectWithValue }) => {
    try {
      const response = await applyToProjectApi(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Application failed" }
      );
    }
  }
);

export const updateApplicantStatus = createAsyncThunk(
  "project/updateApplicantStatus",
  async (data, { rejectWithValue }) => {
    try {
      const response = await updateApplicantStatusApi(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to update applicant status" }
      );
    }
  }
);

export const listApplicants = createAsyncThunk(
  "project/listApplicants",
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await listApplicantsApi(projectId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to fetch applicants" }
      );
    }
  }
);

// Invitation Management
export const createInvite = createAsyncThunk(
  "project/createInvite",
  async (data, { rejectWithValue }) => {
    try {
      const response = await createInviteApi(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Invite creation failed" }
      );
    }
  }
);

export const getMyInvites = createAsyncThunk(
  "project/getMyInvites",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getMyInvitesApi();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to fetch invites" }
      );
    }
  }
);

export const respondInvite = createAsyncThunk(
  "project/respondInvite",
  async (data, { rejectWithValue }) => {
    try {
      const response = await respondInviteApi(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to respond to invite" }
      );
    }
  }
);

// File Management
export const addFile = createAsyncThunk(
  "project/addFile",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await addFileApi(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "File upload failed" }
      );
    }
  }
);

export const getProjectFiles = createAsyncThunk(
  "project/getProjectFiles",
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await getProjectFilesApi(projectId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to fetch project files" }
      );
    }
  }
);

// Project Updates
export const addUpdate = createAsyncThunk(
  "project/addUpdate",
  async (data, { rejectWithValue }) => {
    try {
      const response = await addUpdateApi(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to add update" }
      );
    }
  }
);

// Reviews
export const addReview = createAsyncThunk(
  "project/addReview",
  async (data, { rejectWithValue }) => {
    try {
      const response = await addReviewApi(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to add review" }
      );
    }
  }
);

// Project Boosting
export const addBoost = createAsyncThunk(
  "project/addBoost",
  async (data, { rejectWithValue }) => {
    try {
      const response = await addBoostApi(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to add boost" }
      );
    }
  }
);

// Get project updates
export const getProjectUpdates = createAsyncThunk(
  "project/getUpdates",
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await getProjectUpdatesApi(projectId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to fetch project updates" }
      );
    }
  }
);

// Get project reviews
export const getProjectReviews = createAsyncThunk(
  "project/getReviews",
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await getProjectReviewsApi(projectId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to fetch project reviews" }
      );
    }
  }
);

// Get project boosts
export const getProjectBoosts = createAsyncThunk(
  "project/getBoosts",
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await getProjectBoostsApi(projectId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to fetch project boosts" }
      );
    }
  }
);

// Get project statistics
export const getProjectStats = createAsyncThunk(
  "project/getStats",
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await getProjectStatsApi(projectId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to fetch project stats" }
      );
    }
  }
);

// Search projects
export const searchProjects = createAsyncThunk(
  "project/search",
  async (filters, { rejectWithValue }) => {
    try {
      const response = await searchProjectsApi(filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to search projects" }
      );
    }
  }
);

// Get project recommendations
export const getProjectRecommendations = createAsyncThunk(
  "project/getRecommendations",
  async (limit, { rejectWithValue }) => {
    try {
      const response = await getProjectRecommendationsApi(limit);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to fetch recommendations" }
      );
    }
  }
);

// Add project to favorites
export const addProjectFavorite = createAsyncThunk(
  "project/addFavorite",
  async (data, { rejectWithValue }) => {
    try {
      const response = await addProjectFavoriteApi(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to add favorite" }
      );
    }
  }
);

// Remove project from favorites
export const removeProjectFavorite = createAsyncThunk(
  "project/removeFavorite",
  async (data, { rejectWithValue }) => {
    try {
      const response = await removeProjectFavoriteApi(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to remove favorite" }
      );
    }
  }
);

// Get user's favorite projects
export const getProjectFavorites = createAsyncThunk(
  "project/getFavorites",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getProjectFavoritesApi();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to fetch favorites" }
      );
    }
  }
);

// Add project comment
export const addProjectComment = createAsyncThunk(
  "project/addComment",
  async (data, { rejectWithValue }) => {
    try {
      const response = await addProjectCommentApi(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to add comment" }
      );
    }
  }
);

// Get project comments
export const getProjectComments = createAsyncThunk(
  "project/getComments",
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await getProjectCommentsApi(projectId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to fetch comments" }
      );
    }
  }
);

// Update project comment
export const updateProjectComment = createAsyncThunk(
  "project/updateComment",
  async ({ commentId, data }, { rejectWithValue }) => {
    try {
      const response = await updateProjectCommentApi(commentId, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to update comment" }
      );
    }
  }
);

// Delete project comment
export const deleteProjectComment = createAsyncThunk(
  "project/deleteComment",
  async (commentId, { rejectWithValue }) => {
    try {
      const response = await deleteProjectCommentApi(commentId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to delete comment" }
      );
    }
  }
);

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    clearProjectState: (state) => {
      state.error = null;
      state.message = null;
      state.lastAction = 'clearProjectState';
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
    clearCurrentProject: (state) => {
      state.currentProject = null;
      state.lastAction = 'clearCurrentProject';
    },
    clearProjectFiles: (state) => {
      state.projectFiles = [];
      state.lastAction = 'clearProjectFiles';
    },
    clearProjectApplicants: (state) => {
      state.projectApplicants = [];
      state.lastAction = 'clearProjectApplicants';
    },
    clearMyInvites: (state) => {
      state.myInvites = [];
      state.lastAction = 'clearMyInvites';
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Project
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
        state.lastAction = 'createProject.pending';
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects.unshift(action.payload.project);
        state.message = action.payload.message || "Project created successfully";
        state.error = null;
        state.lastAction = 'createProject.fulfilled';
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Project creation failed";
        state.message = null;
        state.lastAction = 'createProject.rejected';
      })

      // Get Project
      .addCase(getProject.pending, (state) => {
        state.projectLoading = true;
        state.error = null;
        state.message = null;
        state.lastAction = 'getProject.pending';
      })
      .addCase(getProject.fulfilled, (state, action) => {
        state.projectLoading = false;
        state.currentProject = action.payload.project;
        state.error = null;
        state.lastAction = 'getProject.fulfilled';
      })
      .addCase(getProject.rejected, (state, action) => {
        state.projectLoading = false;
        state.error = action.payload.message || "Failed to fetch project";
        state.message = null;
        state.lastAction = 'getProject.rejected';
      })

      // List Projects
      .addCase(listProjects.pending, (state) => {
        state.projectsLoading = true;
        state.error = null;
        state.message = null;
        state.lastAction = 'listProjects.pending';
      })
      .addCase(listProjects.fulfilled, (state, action) => {
        state.projectsLoading = false;
        state.projects = action.payload.projects || [];
        state.error = null;
        state.lastAction = 'listProjects.fulfilled';
      })
      .addCase(listProjects.rejected, (state, action) => {
        state.projectsLoading = false;
        state.error = action.payload.message || "Failed to fetch projects";
        state.message = null;
        state.lastAction = 'listProjects.rejected';
      })

      // Update Project
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
        state.lastAction = 'updateProject.pending';
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false;
        const updatedProject = action.payload.project;
        const index = state.projects.findIndex(p => p.id === updatedProject.id);
        if (index !== -1) {
          state.projects[index] = updatedProject;
        }
        if (state.currentProject && state.currentProject.id === updatedProject.id) {
          state.currentProject = updatedProject;
        }
        state.message = action.payload.message || "Project updated successfully";
        state.error = null;
        state.lastAction = 'updateProject.fulfilled';
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Project update failed";
        state.message = null;
        state.lastAction = 'updateProject.rejected';
      })

      // Delete Project
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
        state.lastAction = 'deleteProject.pending';
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = state.projects.filter(p => p.id !== action.payload.id);
        if (state.currentProject && state.currentProject.id === action.payload.id) {
          state.currentProject = null;
        }
        state.message = action.payload.message || "Project deleted successfully";
        state.error = null;
        state.lastAction = 'deleteProject.fulfilled';
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Project deletion failed";
        state.message = null;
        state.lastAction = 'deleteProject.rejected';
      })

      // Apply to Project
      .addCase(applyToProject.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
        state.lastAction = 'applyToProject.pending';
      })
      .addCase(applyToProject.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || "Application submitted successfully";
        state.error = null;
        state.lastAction = 'applyToProject.fulfilled';
      })
      .addCase(applyToProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Application failed";
        state.message = null;
        state.lastAction = 'applyToProject.rejected';
      })

      // Update Applicant Status
      .addCase(updateApplicantStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
        state.lastAction = 'updateApplicantStatus.pending';
      })
      .addCase(updateApplicantStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || "Applicant status updated successfully";
        state.error = null;
        state.lastAction = 'updateApplicantStatus.fulfilled';
      })
      .addCase(updateApplicantStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Failed to update applicant status";
        state.message = null;
        state.lastAction = 'updateApplicantStatus.rejected';
      })

      // List Applicants
      .addCase(listApplicants.pending, (state) => {
        state.applicantsLoading = true;
        state.error = null;
        state.message = null;
        state.lastAction = 'listApplicants.pending';
      })
      .addCase(listApplicants.fulfilled, (state, action) => {
        state.applicantsLoading = false;
        state.projectApplicants = action.payload.applicants || [];
        state.error = null;
        state.lastAction = 'listApplicants.fulfilled';
      })
      .addCase(listApplicants.rejected, (state, action) => {
        state.applicantsLoading = false;
        state.error = action.payload.message || "Failed to fetch applicants";
        state.message = null;
        state.lastAction = 'listApplicants.rejected';
      })

      // Create Invite
      .addCase(createInvite.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
        state.lastAction = 'createInvite.pending';
      })
      .addCase(createInvite.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || "Invite created successfully";
        state.error = null;
        state.lastAction = 'createInvite.fulfilled';
      })
      .addCase(createInvite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Invite creation failed";
        state.message = null;
        state.lastAction = 'createInvite.rejected';
      })

      // Get My Invites
      .addCase(getMyInvites.pending, (state) => {
        state.invitesLoading = true;
        state.error = null;
        state.message = null;
        state.lastAction = 'getMyInvites.pending';
      })
      .addCase(getMyInvites.fulfilled, (state, action) => {
        state.invitesLoading = false;
        state.myInvites = action.payload.invites || [];
        state.error = null;
        state.lastAction = 'getMyInvites.fulfilled';
      })
      .addCase(getMyInvites.rejected, (state, action) => {
        state.invitesLoading = false;
        state.error = action.payload.message || "Failed to fetch invites";
        state.message = null;
        state.lastAction = 'getMyInvites.rejected';
      })

      // Respond Invite
      .addCase(respondInvite.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
        state.lastAction = 'respondInvite.pending';
      })
      .addCase(respondInvite.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || "Invite response submitted successfully";
        state.error = null;
        state.lastAction = 'respondInvite.fulfilled';
      })
      .addCase(respondInvite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Failed to respond to invite";
        state.message = null;
        state.lastAction = 'respondInvite.rejected';
      })

      // Add File
      .addCase(addFile.pending, (state) => {
        state.filesLoading = true;
        state.error = null;
        state.message = null;
        state.lastAction = 'addFile.pending';
      })
      .addCase(addFile.fulfilled, (state, action) => {
        state.filesLoading = false;
        state.projectFiles.push(action.payload.file);
        state.message = action.payload.message || "File uploaded successfully";
        state.error = null;
        state.lastAction = 'addFile.fulfilled';
      })
      .addCase(addFile.rejected, (state, action) => {
        state.filesLoading = false;
        state.error = action.payload.message || "File upload failed";
        state.message = null;
        state.lastAction = 'addFile.rejected';
      })

      // Get Project Files
      .addCase(getProjectFiles.pending, (state) => {
        state.filesLoading = true;
        state.error = null;
        state.message = null;
        state.lastAction = 'getProjectFiles.pending';
      })
      .addCase(getProjectFiles.fulfilled, (state, action) => {
        state.filesLoading = false;
        state.projectFiles = action.payload.files || [];
        state.error = null;
        state.lastAction = 'getProjectFiles.fulfilled';
      })
      .addCase(getProjectFiles.rejected, (state, action) => {
        state.filesLoading = false;
        state.error = action.payload.message || "Failed to fetch project files";
        state.message = null;
        state.lastAction = 'getProjectFiles.rejected';
      })

      // Add Update
      .addCase(addUpdate.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
        state.lastAction = 'addUpdate.pending';
      })
      .addCase(addUpdate.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || "Update added successfully";
        state.error = null;
        state.lastAction = 'addUpdate.fulfilled';
      })
      .addCase(addUpdate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Failed to add update";
        state.message = null;
        state.lastAction = 'addUpdate.rejected';
      })

      // Add Review
      .addCase(addReview.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
        state.lastAction = 'addReview.pending';
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || "Review added successfully";
        state.error = null;
        state.lastAction = 'addReview.fulfilled';
      })
      .addCase(addReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Failed to add review";
        state.message = null;
        state.lastAction = 'addReview.rejected';
      })

      // Add Boost
      .addCase(addBoost.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
        state.lastAction = 'addBoost.pending';
      })
      .addCase(addBoost.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || "Boost added successfully";
        state.error = null;
        state.lastAction = 'addBoost.fulfilled';
      })
      .addCase(addBoost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Failed to add boost";
        state.message = null;
        state.lastAction = 'addBoost.rejected';
      })

      // Get Project Updates
      .addCase(getProjectUpdates.pending, (state) => {
        state.updatesLoading = true;
        state.error = null;
        state.lastAction = 'getProjectUpdates.pending';
      })
      .addCase(getProjectUpdates.fulfilled, (state, action) => {
        state.updatesLoading = false;
        state.projectUpdates = action.payload.updates || [];
        state.error = null;
        state.lastAction = 'getProjectUpdates.fulfilled';
      })
      .addCase(getProjectUpdates.rejected, (state, action) => {
        state.updatesLoading = false;
        state.error = action.payload.message || "Failed to fetch project updates";
        state.lastAction = 'getProjectUpdates.rejected';
      })

      // Get Project Reviews
      .addCase(getProjectReviews.pending, (state) => {
        state.reviewsLoading = true;
        state.error = null;
        state.lastAction = 'getProjectReviews.pending';
      })
      .addCase(getProjectReviews.fulfilled, (state, action) => {
        state.reviewsLoading = false;
        state.projectReviews = action.payload.reviews || [];
        state.error = null;
        state.lastAction = 'getProjectReviews.fulfilled';
      })
      .addCase(getProjectReviews.rejected, (state, action) => {
        state.reviewsLoading = false;
        state.error = action.payload.message || "Failed to fetch project reviews";
        state.lastAction = 'getProjectReviews.rejected';
      })

      // Get Project Boosts
      .addCase(getProjectBoosts.pending, (state) => {
        state.boostsLoading = true;
        state.error = null;
        state.lastAction = 'getProjectBoosts.pending';
      })
      .addCase(getProjectBoosts.fulfilled, (state, action) => {
        state.boostsLoading = false;
        state.projectBoosts = action.payload.boosts || [];
        state.error = null;
        state.lastAction = 'getProjectBoosts.fulfilled';
      })
      .addCase(getProjectBoosts.rejected, (state, action) => {
        state.boostsLoading = false;
        state.error = action.payload.message || "Failed to fetch project boosts";
        state.lastAction = 'getProjectBoosts.rejected';
      })

      // Get Project Stats
      .addCase(getProjectStats.pending, (state) => {
        state.statsLoading = true;
        state.error = null;
        state.lastAction = 'getProjectStats.pending';
      })
      .addCase(getProjectStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.projectStats = action.payload.stats;
        state.error = null;
        state.lastAction = 'getProjectStats.fulfilled';
      })
      .addCase(getProjectStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.error = action.payload.message || "Failed to fetch project stats";
        state.lastAction = 'getProjectStats.rejected';
      })

      // Search Projects
      .addCase(searchProjects.pending, (state) => {
        state.searchLoading = true;
        state.error = null;
        state.lastAction = 'searchProjects.pending';
      })
      .addCase(searchProjects.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload.projects || [];
        state.error = null;
        state.lastAction = 'searchProjects.fulfilled';
      })
      .addCase(searchProjects.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.payload.message || "Failed to search projects";
        state.lastAction = 'searchProjects.rejected';
      })

      // Get Project Recommendations
      .addCase(getProjectRecommendations.pending, (state) => {
        state.recommendationsLoading = true;
        state.error = null;
        state.lastAction = 'getProjectRecommendations.pending';
      })
      .addCase(getProjectRecommendations.fulfilled, (state, action) => {
        state.recommendationsLoading = false;
        state.recommendations = action.payload.recommendations || [];
        state.error = null;
        state.lastAction = 'getProjectRecommendations.fulfilled';
      })
      .addCase(getProjectRecommendations.rejected, (state, action) => {
        state.recommendationsLoading = false;
        state.error = action.payload.message || "Failed to fetch recommendations";
        state.lastAction = 'getProjectRecommendations.rejected';
      })

      // Add Project Favorite
      .addCase(addProjectFavorite.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
        state.lastAction = 'addProjectFavorite.pending';
      })
      .addCase(addProjectFavorite.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || "Project added to favorites";
        state.error = null;
        state.lastAction = 'addProjectFavorite.fulfilled';
      })
      .addCase(addProjectFavorite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Failed to add favorite";
        state.message = null;
        state.lastAction = 'addProjectFavorite.rejected';
      })

      // Remove Project Favorite
      .addCase(removeProjectFavorite.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
        state.lastAction = 'removeProjectFavorite.pending';
      })
      .addCase(removeProjectFavorite.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || "Project removed from favorites";
        state.error = null;
        state.lastAction = 'removeProjectFavorite.fulfilled';
      })
      .addCase(removeProjectFavorite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Failed to remove favorite";
        state.message = null;
        state.lastAction = 'removeProjectFavorite.rejected';
      })

      // Get Project Favorites
      .addCase(getProjectFavorites.pending, (state) => {
        state.favoritesLoading = true;
        state.error = null;
        state.lastAction = 'getProjectFavorites.pending';
      })
      .addCase(getProjectFavorites.fulfilled, (state, action) => {
        state.favoritesLoading = false;
        state.favorites = action.payload.favorites || [];
        state.error = null;
        state.lastAction = 'getProjectFavorites.fulfilled';
      })
      .addCase(getProjectFavorites.rejected, (state, action) => {
        state.favoritesLoading = false;
        state.error = action.payload.message || "Failed to fetch favorites";
        state.lastAction = 'getProjectFavorites.rejected';
      })

      // Add Project Comment
      .addCase(addProjectComment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
        state.lastAction = 'addProjectComment.pending';
      })
      .addCase(addProjectComment.fulfilled, (state, action) => {
        state.loading = false;
        state.projectComments.unshift(action.payload.comment);
        state.message = action.payload.message || "Comment added successfully";
        state.error = null;
        state.lastAction = 'addProjectComment.fulfilled';
      })
      .addCase(addProjectComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Failed to add comment";
        state.message = null;
        state.lastAction = 'addProjectComment.rejected';
      })

      // Get Project Comments
      .addCase(getProjectComments.pending, (state) => {
        state.commentsLoading = true;
        state.error = null;
        state.lastAction = 'getProjectComments.pending';
      })
      .addCase(getProjectComments.fulfilled, (state, action) => {
        state.commentsLoading = false;
        state.projectComments = action.payload.comments || [];
        state.error = null;
        state.lastAction = 'getProjectComments.fulfilled';
      })
      .addCase(getProjectComments.rejected, (state, action) => {
        state.commentsLoading = false;
        state.error = action.payload.message || "Failed to fetch comments";
        state.lastAction = 'getProjectComments.rejected';
      })

      // Update Project Comment
      .addCase(updateProjectComment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
        state.lastAction = 'updateProjectComment.pending';
      })
      .addCase(updateProjectComment.fulfilled, (state, action) => {
        state.loading = false;
        const updatedComment = action.payload.comment;
        const index = state.projectComments.findIndex(c => c.id === updatedComment.id);
        if (index !== -1) {
          state.projectComments[index] = updatedComment;
        }
        state.message = action.payload.message || "Comment updated successfully";
        state.error = null;
        state.lastAction = 'updateProjectComment.fulfilled';
      })
      .addCase(updateProjectComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Failed to update comment";
        state.message = null;
        state.lastAction = 'updateProjectComment.rejected';
      })

      // Delete Project Comment
      .addCase(deleteProjectComment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
        state.lastAction = 'deleteProjectComment.pending';
      })
      .addCase(deleteProjectComment.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || "Comment deleted successfully";
        state.error = null;
        state.lastAction = 'deleteProjectComment.fulfilled';
      })
      .addCase(deleteProjectComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Failed to delete comment";
        state.message = null;
        state.lastAction = 'deleteProjectComment.rejected';
      });
  },
});

export const {
  clearProjectState,
  setLoading,
  clearError,
  clearMessage,
  clearCurrentProject,
  clearProjectFiles,
  clearProjectApplicants,
  clearMyInvites,
} = projectSlice.actions;

export default projectSlice.reducer;
