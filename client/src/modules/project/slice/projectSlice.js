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
  getSearchSuggestionsApi,
  getProjectRecommendationsApi,
  addProjectFavoriteApi,
  removeProjectFavoriteApi,
  getProjectFavoritesApi,
  addProjectCommentApi,
  getProjectCommentsApi,
  updateProjectCommentApi,
  deleteProjectCommentApi,
  getPublicProjectsApi,
  getProjectCategoriesApi,
  getFilterOptionsApi,
  addProjectSaveApi,
  removeProjectSaveApi,
  getProjectSavesApi,
  withdrawApplicationApi,
  getDevelopersApi,
  generateProjectDescriptionApi,
  generateProjectTitlesApi,
  generateSkillSuggestionsApi,
  generateRequirementsApi,
  generateBenefitsApi,
  generateBudgetSuggestionsApi,
  generateComprehensiveSuggestionsApi,
  getMyApplicationsApi,
  getMyAppliedProjectIdsApi,
  getMyApplicationsCountApi,
  getDeveloperAppliedProjectsApi,
  generateApplicantsReportApi,
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
  searchSuggestions: { skills: [], tags: [] },
  recommendations: [],
  favorites: [],
  saves: [],
  projectComments: [],
  // Public discovery
  publicProjects: [],
  projectCategories: [],
  filterOptions: null,
  
  // Applied projects tracking
  appliedProjects: [],
  appliedProjectsStatusMap: {}, // Map of projectId -> status from /api/v1/projects/applications/my/ids
  myApplications: [],
  myApplicationsCount: 0,
  
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
  searchSuggestionsLoading: false,
  recommendationsLoading: false,
  favoritesLoading: false,
  savesLoading: false,
  commentsLoading: false,
  publicLoading: false,
  filterOptionsLoading: false,
  
  // Developers
  developers: [],
  developersLoading: false,
  
  // AI suggestions
  aiSuggestions: {
    description: '',
    titles: [],
    skills: [],
    requirements: '',
    benefits: '',
    budget: ''
  },
  aiLoading: false,
  
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

// Withdraw application
export const withdrawApplication = createAsyncThunk(
  "project/withdrawApplication",
  async (data, { rejectWithValue }) => {
    try {
      const response = await withdrawApplicationApi(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to withdraw application" }
      );
    }
  }
);

// Load applied projects from database (project_applicants table via API)
// Uses dedicated API that returns only projectIds and userId from project_applicants table
export const getAppliedProjects = createAsyncThunk(
  "project/getAppliedProjects",
  async (_, { rejectWithValue }) => {
    try {
      // Use dedicated API that queries project_applicants table and returns IDs with status
      const response = await getMyAppliedProjectIdsApi();
      // Extract project IDs and status from the new response structure
      // Response structure: { data: { projectIds: [{projectId, status}, ...] } }
      const projectIdsWithStatus = response.data?.data?.projectIds || [];
      const userId = response.data?.data?.userId;
      
      // Extract just the IDs for backward compatibility
      const projectIds = projectIdsWithStatus.map(item => 
        typeof item === 'object' && item.projectId ? item.projectId : item
      ).filter(id => typeof id === 'number' && !isNaN(id));
      
      // Build status map from the response
      const statusMap = {};
      projectIdsWithStatus.forEach(item => {
        if (typeof item === 'object' && item.projectId && item.status) {
          const numericId = Number(item.projectId);
          statusMap[numericId] = item.status;
          // Also store with original key if different
          if (numericId !== item.projectId) {
            statusMap[item.projectId] = item.status;
          }
        }
      });
     
      return {
        projectIds,
        statusMap,
        userId
      };
    } catch (error) {
      // If API fails, return empty array - component will retry with getMyApplications
      console.warn('getAppliedProjects - API call failed, returning empty array:', error);
      return { projectIds: [], statusMap: {}, userId: null };
    }
  }
);

// Save applied projects to localStorage
export const saveAppliedProjects = createAsyncThunk(
  "project/saveAppliedProjects",
  async (appliedProjects, { rejectWithValue }) => {
    try {
      localStorage.setItem("appliedProjects", JSON.stringify(appliedProjects));
      return appliedProjects;
    } catch (error) {
      return rejectWithValue(
        error?.message || { message: "Failed to save applied projects" }
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

// Developer: self applications
export const getMyApplications = createAsyncThunk(
  "project/getMyApplications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getMyApplicationsApi();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to fetch my applications" }
      );
    }
  }
);

export const getMyApplicationsCount = createAsyncThunk(
  "project/getMyApplicationsCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getMyApplicationsCountApi();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to fetch applications count" }
      );
    }
  }
);

// Get developer applied projects list
export const getDeveloperAppliedProjects = createAsyncThunk(
  "project/getDeveloperAppliedProjects",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getDeveloperAppliedProjectsApi();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to fetch applied projects" }
      );
    }
  }
);

// Generate applicants report
export const generateApplicantsReport = createAsyncThunk(
  "project/generateApplicantsReport",
  async (data, { rejectWithValue }) => {
    try {
      const response = await generateApplicantsReportApi(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to generate report" }
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

// Get search suggestions
export const getSearchSuggestions = createAsyncThunk(
  "project/getSearchSuggestions",
  async ({ query, type = 'all' }, { rejectWithValue }) => {
    try {
      const response = await getSearchSuggestionsApi(query, type);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to get search suggestions" }
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

// Saves (Bookmarks)
export const addProjectSave = createAsyncThunk(
  "project/addSave",
  async (data, { rejectWithValue }) => {
    try {
      const response = await addProjectSaveApi(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to save project" }
      );
    }
  }
);

export const removeProjectSave = createAsyncThunk(
  "project/removeSave",
  async (data, { rejectWithValue }) => {
    try {
      const response = await removeProjectSaveApi(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to unsave project" }
      );
    }
  }
);

export const getProjectSaves = createAsyncThunk(
  "project/getSaves",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getProjectSavesApi();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to fetch saves" }
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

// Get developers
export const getDevelopers = createAsyncThunk(
  "project/getDevelopers",
  async (params, { rejectWithValue }) => {
    try {
      const response = await getDevelopersApi(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to fetch developers" }
      );
    }
  }
);

// AI Suggestion Operations
export const generateProjectDescription = createAsyncThunk(
  "project/generateDescription",
  async (data, { rejectWithValue }) => {
    try {
      const response = await generateProjectDescriptionApi(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to generate description" }
      );
    }
  }
);

export const generateProjectTitles = createAsyncThunk(
  "project/generateTitles",
  async (data, { rejectWithValue }) => {
    try {
      const response = await generateProjectTitlesApi(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to generate titles" }
      );
    }
  }
);

export const generateSkillSuggestions = createAsyncThunk(
  "project/generateSkills",
  async (data, { rejectWithValue }) => {
    try {
      const response = await generateSkillSuggestionsApi(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to generate skills" }
      );
    }
  }
);

export const generateRequirements = createAsyncThunk(
  "project/generateRequirements",
  async (data, { rejectWithValue }) => {
    try {
      const response = await generateRequirementsApi(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to generate requirements" }
      );
    }
  }
);

export const generateBenefits = createAsyncThunk(
  "project/generateBenefits",
  async (data, { rejectWithValue }) => {
    try {
      const response = await generateBenefitsApi(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to generate benefits" }
      );
    }
  }
);

export const generateBudgetSuggestions = createAsyncThunk(
  "project/generateBudget",
  async (data, { rejectWithValue }) => {
    try {
      const response = await generateBudgetSuggestionsApi(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to generate budget" }
      );
    }
  }
);

export const generateComprehensiveSuggestions = createAsyncThunk(
  "project/generateComprehensive",
  async (data, { rejectWithValue }) => {
    try {
      const response = await generateComprehensiveSuggestionsApi(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to generate suggestions" }
      );
    }
  }
);

// Public: get public projects
export const getPublicProjects = createAsyncThunk(
  "project/getPublicProjects",
  async (params, { rejectWithValue }) => {
    try {
      const response = await getPublicProjectsApi(params || {});
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to fetch public projects" }
      );
    }
  }
);

// Public: get project categories
export const getProjectCategories = createAsyncThunk(
  "project/getProjectCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getProjectCategoriesApi();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to fetch project categories" }
      );
    }
  }
);

// Removed getProjectMetadata thunk - replaced by getFilterOptions which provides dynamic, database-driven filter options

// Public: get all filter options
export const getFilterOptions = createAsyncThunk(
  "project/getFilterOptions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getFilterOptionsApi();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to fetch filter options" }
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
      state.aiSuggestions = {
        description: '',
        titles: [],
        skills: [],
        requirements: '',
        benefits: '',
        budget: ''
      };
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
        // Optimistically update applicantsCount and applied flag on the project
        const projectId = action?.meta?.arg?.projectId;
        const proj = state.projects.find(p => p.id === projectId);
        if (proj) {
          proj.applicantsCount = (proj.applicantsCount || 0) + 1;
          proj.newApplicantsCount = Math.max(0, (proj.newApplicantsCount || 0) + 1);
          proj.__appliedByMe = true;
        }
        // Add to applied projects array if not already present
        if (projectId && !state.appliedProjects.includes(projectId)) {
          state.appliedProjects.push(projectId);
          state.myApplicationsCount = (state.myApplicationsCount || 0) + 1;
        }
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

      // Get Search Suggestions
      .addCase(getSearchSuggestions.pending, (state) => {
        state.searchSuggestionsLoading = true;
        state.error = null;
        state.lastAction = 'getSearchSuggestions.pending';
      })
      .addCase(getSearchSuggestions.fulfilled, (state, action) => {
        state.searchSuggestionsLoading = false;
        state.searchSuggestions = action.payload.suggestions || { skills: [], tags: [] };
        state.error = null;
        state.lastAction = 'getSearchSuggestions.fulfilled';
      })
      .addCase(getSearchSuggestions.rejected, (state, action) => {
        state.searchSuggestionsLoading = false;
        state.error = action.payload.message || "Failed to get search suggestions";
        state.lastAction = 'getSearchSuggestions.rejected';
      })

      // Get Project Recommendations
      .addCase(getProjectRecommendations.pending, (state) => {
        state.recommendationsLoading = true;
        state.error = null;
        state.lastAction = 'getProjectRecommendations.pending';
      })

      // Withdraw application
      .addCase(withdrawApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
        state.lastAction = 'withdrawApplication.pending';
      })
      .addCase(withdrawApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || 'Application withdrawn';
        state.error = null;
        state.lastAction = 'withdrawApplication.fulfilled';
        const projectId = action?.meta?.arg?.projectId;
        const proj = state.projects.find(p => p.id === projectId);
        if (proj) {
          proj.applicantsCount = Math.max(0, (proj.applicantsCount || 0) - 1);
          proj.__appliedByMe = false;
        }
        // Remove from applied projects array and myApplications
        if (projectId) {
          state.appliedProjects = state.appliedProjects.filter(id => id !== projectId);
          state.myApplications = state.myApplications.filter(app => app.projectId !== projectId);
          state.myApplicationsCount = Math.max(0, (state.myApplicationsCount || 0) - 1);
        }
      })
      .addCase(withdrawApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || 'Failed to withdraw application';
        state.message = null;
        state.lastAction = 'withdrawApplication.rejected';
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

        // Optimistically update favorites array
        const projectId = action?.meta?.arg?.projectId;
        if (projectId) {
          const alreadyFavorited = Array.isArray(state.favorites) && state.favorites.some((f) => (
            f === projectId || f?.projectId === projectId || f?.project?.id === projectId || f?.id === projectId
          ));
          if (!alreadyFavorited) {
            // Store a minimal entry to avoid shape mismatches
            state.favorites.push({ projectId });
          }

          // Bump favoritesCount on the project if present
          const proj = state.projects.find(p => p.id === projectId);
          if (proj) {
            proj.favoritesCount = (proj.favoritesCount || 0) + 1;
          }
        }
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

        // Optimistically update favorites array
        const projectId = action?.meta?.arg?.projectId;
        if (projectId && Array.isArray(state.favorites)) {
          state.favorites = state.favorites.filter((f) => !(
            f === projectId || f?.projectId === projectId || f?.project?.id === projectId || f?.id === projectId
          ));

          // Decrease favoritesCount on the project if present
          const proj = state.projects.find(p => p.id === projectId);
          if (proj && (proj.favoritesCount || 0) > 0) {
            proj.favoritesCount = Math.max(0, (proj.favoritesCount || 0) - 1);
          }
        }
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

      // Saves
      .addCase(addProjectSave.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
        state.lastAction = 'addProjectSave.pending';
      })
      .addCase(addProjectSave.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || "Project saved";
        state.error = null;
        state.lastAction = 'addProjectSave.fulfilled';
        const projectId = action?.meta?.arg?.projectId;
        
        if (projectId) {
          // Only add if it doesn't already exist
          const exists = Array.isArray(state.saves) && state.saves.some((s) => {
            if (typeof s === 'number') {
              return s === projectId;
            } else if (typeof s === 'object' && s !== null) {
              return s.projectId === projectId;
            }
            return false;
          });
          
          if (!exists) {
            // Use the save object returned by the API
            const saveItem = action.payload.save || action.payload || { projectId };
            state.saves.push(saveItem);
          }
        }
      })
      .addCase(addProjectSave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Failed to save project";
        state.message = null;
        state.lastAction = 'addProjectSave.rejected';
      })

      .addCase(removeProjectSave.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
        state.lastAction = 'removeProjectSave.pending';
      })
      .addCase(removeProjectSave.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || "Project unsaved";
        state.error = null;
        state.lastAction = 'removeProjectSave.fulfilled';
        const projectId = action?.meta?.arg?.projectId;
        
        if (projectId && Array.isArray(state.saves)) {
          state.saves = state.saves.filter((s) => {
            if (typeof s === 'number') {
              return s !== projectId;
            } else if (typeof s === 'object' && s !== null) {
              return s.projectId !== projectId;
            }
            return true; // Keep items we don't understand
          });
        }
      })
      .addCase(removeProjectSave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Failed to unsave project";
        state.message = null;
        state.lastAction = 'removeProjectSave.rejected';
      })

      .addCase(getProjectSaves.pending, (state) => {
        state.savesLoading = true;
        state.error = null;
        state.lastAction = 'getProjectSaves.pending';
      })
      .addCase(getProjectSaves.fulfilled, (state, action) => {
        state.savesLoading = false;
        // Handle different possible response structures
        state.saves = action.payload.saves || action.payload || [];
        state.error = null;
        state.lastAction = 'getProjectSaves.fulfilled';
      })
      .addCase(getProjectSaves.rejected, (state, action) => {
        state.savesLoading = false;
        state.error = action.payload.message || "Failed to fetch saves";
        state.lastAction = 'getProjectSaves.rejected';
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
      })

      // Public: getPublicProjects
      .addCase(getPublicProjects.pending, (state) => {
        state.publicLoading = true;
        state.error = null;
        state.lastAction = 'getPublicProjects.pending';
      })
      .addCase(getPublicProjects.fulfilled, (state, action) => {
        state.publicLoading = false;
        // may come as { projects, pagination }
        const payload = action.payload;
        state.publicProjects = payload.projects || payload.data || payload || [];
        state.lastAction = 'getPublicProjects.fulfilled';
      })
      .addCase(getPublicProjects.rejected, (state, action) => {
        state.publicLoading = false;
        state.error = action.payload.message || 'Failed to fetch public projects';
        state.lastAction = 'getPublicProjects.rejected';
      })
      
      // Public: getProjectCategories
      .addCase(getProjectCategories.pending, (state) => {
        state.metadataLoading = true;
        state.error = null;
        state.lastAction = 'getProjectCategories.pending';
      })
      .addCase(getProjectCategories.fulfilled, (state, action) => {
        state.metadataLoading = false;
        state.projectCategories = action.payload.categories || [];
        state.lastAction = 'getProjectCategories.fulfilled';
      })
      .addCase(getProjectCategories.rejected, (state, action) => {
        state.metadataLoading = false;
        state.error = action.payload.message || 'Failed to fetch project categories';
        state.lastAction = 'getProjectCategories.rejected';
      })
      
      // Removed getProjectMetadata reducers - replaced by getFilterOptions which provides dynamic, database-driven filter options
      // Filter Options
      .addCase(getFilterOptions.pending, (state) => {
        state.filterOptionsLoading = true;
        state.error = null;
        state.lastAction = 'getFilterOptions.pending';
      })
      .addCase(getFilterOptions.fulfilled, (state, action) => {
        state.filterOptionsLoading = false;
        state.filterOptions = action.payload.filterOptions || action.payload || null;
        state.lastAction = 'getFilterOptions.fulfilled';
      })
      .addCase(getFilterOptions.rejected, (state, action) => {
        state.filterOptionsLoading = false;
        state.error = action.payload.message || 'Failed to fetch filter options';
        state.lastAction = 'getFilterOptions.rejected';
      })
      
      // Load applied projects from database (project_applicants table via API)
      .addCase(getAppliedProjects.fulfilled, (state, action) => {
        // Set appliedProjects from API response (project IDs from project_applicants table)
        // New response structure includes both IDs and status
        const payload = action.payload;
        const projectIds = Array.isArray(payload) 
          ? payload // Backward compatibility: if payload is array, use it directly
          : (Array.isArray(payload?.projectIds) ? payload.projectIds : []);
        const statusMap = payload?.statusMap || {};
        
        state.appliedProjects = Array.from(new Set(projectIds));
        state.appliedProjectsStatusMap = statusMap; // ✅ Store status map from IDs API
        
        console.log('Redux: getAppliedProjects.fulfilled - Set appliedProjects from project_applicants table:', {
          projectIds,
          statusMap,
          totalWithStatus: Object.keys(statusMap).length
        });
      })
      .addCase(getAppliedProjects.rejected, (state, action) => {
        state.error = action.payload.message || 'Failed to load applied projects';
      })
      
      // Save applied projects to localStorage
      .addCase(saveAppliedProjects.fulfilled, (state, action) => {
        // Applied projects are already updated in state, just confirm save
        state.appliedProjects = action.payload;
      })
      .addCase(saveAppliedProjects.rejected, (state, action) => {
        state.error = action.payload.message || 'Failed to save applied projects';
      })

      // Get Developers
      .addCase(getDevelopers.pending, (state) => {
        state.developersLoading = true;
        state.error = null;
        state.lastAction = 'getDevelopers.pending';
      })
      .addCase(getDevelopers.fulfilled, (state, action) => {
        state.developersLoading = false;
        state.developers = action.payload.developers || [];
        state.error = null;
        state.lastAction = 'getDevelopers.fulfilled';
      })
      .addCase(getDevelopers.rejected, (state, action) => {
        state.developersLoading = false;
        state.error = action.payload.message || 'Failed to fetch developers';
        state.lastAction = 'getDevelopers.rejected';
      })

      // AI Description Generation
      .addCase(generateProjectDescription.pending, (state) => {
        state.aiLoading = true;
        state.error = null;
        state.lastAction = 'generateProjectDescription.pending';
      })
      .addCase(generateProjectDescription.fulfilled, (state, action) => {
        state.aiLoading = false;
        state.aiSuggestions.description = action.payload.description;
        state.error = null;
        state.lastAction = 'generateProjectDescription.fulfilled';
      })
      .addCase(generateProjectDescription.rejected, (state, action) => {
        state.aiLoading = false;
        state.error = action.payload.message || 'Failed to generate description';
        state.lastAction = 'generateProjectDescription.rejected';
      })

      // AI Title Generation
      .addCase(generateProjectTitles.pending, (state) => {
        state.aiLoading = true;
        state.error = null;
        state.lastAction = 'generateProjectTitles.pending';
      })
      .addCase(generateProjectTitles.fulfilled, (state, action) => {
        state.aiLoading = false;
        state.aiSuggestions.titles = action.payload.titles;
        state.error = null;
        state.lastAction = 'generateProjectTitles.fulfilled';
      })
      .addCase(generateProjectTitles.rejected, (state, action) => {
        state.aiLoading = false;
        state.error = action.payload.message || 'Failed to generate titles';
        state.lastAction = 'generateProjectTitles.rejected';
      })

      // AI Skill Generation
      .addCase(generateSkillSuggestions.pending, (state) => {
        state.aiLoading = true;
        state.error = null;
        state.lastAction = 'generateSkillSuggestions.pending';
      })
      .addCase(generateSkillSuggestions.fulfilled, (state, action) => {
        state.aiLoading = false;
        state.aiSuggestions.skills = action.payload.skills;
        state.error = null;
        state.lastAction = 'generateSkillSuggestions.fulfilled';
      })
      .addCase(generateSkillSuggestions.rejected, (state, action) => {
        state.aiLoading = false;
        state.error = action.payload.message || 'Failed to generate skills';
        state.lastAction = 'generateSkillSuggestions.rejected';
      })

      // AI Requirements Generation
      .addCase(generateRequirements.pending, (state) => {
        state.aiLoading = true;
        state.error = null;
        state.lastAction = 'generateRequirements.pending';
      })
      .addCase(generateRequirements.fulfilled, (state, action) => {
        state.aiLoading = false;
        state.aiSuggestions.requirements = action.payload.requirements;
        state.error = null;
        state.lastAction = 'generateRequirements.fulfilled';
      })
      .addCase(generateRequirements.rejected, (state, action) => {
        state.aiLoading = false;
        state.error = action.payload.message || 'Failed to generate requirements';
        state.lastAction = 'generateRequirements.rejected';
      })

      // AI Benefits Generation
      .addCase(generateBenefits.pending, (state) => {
        state.aiLoading = true;
        state.error = null;
        state.lastAction = 'generateBenefits.pending';
      })
      .addCase(generateBenefits.fulfilled, (state, action) => {
        state.aiLoading = false;
        state.aiSuggestions.benefits = action.payload.benefits;
        state.error = null;
        state.lastAction = 'generateBenefits.fulfilled';
      })
      .addCase(generateBenefits.rejected, (state, action) => {
        state.aiLoading = false;
        state.error = action.payload.message || 'Failed to generate benefits';
        state.lastAction = 'generateBenefits.rejected';
      })

      // AI Budget Generation
      .addCase(generateBudgetSuggestions.pending, (state) => {
        state.aiLoading = true;
        state.error = null;
        state.lastAction = 'generateBudgetSuggestions.pending';
      })
      .addCase(generateBudgetSuggestions.fulfilled, (state, action) => {
        state.aiLoading = false;
        state.aiSuggestions.budget = action.payload.budget;
        state.error = null;
        state.lastAction = 'generateBudgetSuggestions.fulfilled';
      })
      .addCase(generateBudgetSuggestions.rejected, (state, action) => {
        state.aiLoading = false;
        state.error = action.payload.message || 'Failed to generate budget';
        state.lastAction = 'generateBudgetSuggestions.rejected';
      })

      // AI Comprehensive Generation
      .addCase(generateComprehensiveSuggestions.pending, (state) => {
        state.aiLoading = true;
        state.error = null;
        state.lastAction = 'generateComprehensiveSuggestions.pending';
      })
      .addCase(generateComprehensiveSuggestions.fulfilled, (state, action) => {
        state.aiLoading = false;
        state.aiSuggestions = { ...state.aiSuggestions, ...action.payload.suggestions };
        state.error = null;
        state.lastAction = 'generateComprehensiveSuggestions.fulfilled';
      })
      .addCase(generateComprehensiveSuggestions.rejected, (state, action) => {
        state.aiLoading = false;
        state.error = action.payload.message || 'Failed to generate suggestions';
        state.lastAction = 'generateComprehensiveSuggestions.rejected';
      })

      // Get My Applications
      .addCase(getMyApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.lastAction = 'getMyApplications.pending';
      })
      .addCase(getMyApplications.fulfilled, (state, action) => {
        state.loading = false;
        const apps = action.payload.applications || [];
        state.myApplications = apps;
        // Extract project IDs from applications (source: project_applicants table from database)
        const ids = apps.map(a => a.projectId).filter(id => typeof id === 'number' && !isNaN(id));
        // REPLACE appliedProjects (don't append) - data comes from database project_applicants table
        state.appliedProjects = Array.from(new Set(ids));
        console.log('Redux: getMyApplications.fulfilled - Data from project_applicants table:', {
          userId: 'current user (from JWT)',
          applicationsCount: apps.length,
          projectIds: ids,
          source: 'project_applicants table (database)',
          // Show sample application with status for debugging
          sampleApplication: apps.length > 0 ? {
            projectId: apps[0].projectId,
            status: apps[0].status, // ✅ STATUS IS INCLUDED
            appliedAt: apps[0].appliedAt,
            updatedAt: apps[0].updatedAt
          } : 'No applications found'
        });
        state.error = null;
        state.lastAction = 'getMyApplications.fulfilled';
      })
      .addCase(getMyApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || 'Failed to fetch my applications';
        state.lastAction = 'getMyApplications.rejected';
      })

      // Get My Applications Count
      .addCase(getMyApplicationsCount.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.lastAction = 'getMyApplicationsCount.pending';
      })
      .addCase(getMyApplicationsCount.fulfilled, (state, action) => {
        state.loading = false;
        state.myApplicationsCount = Number(action.payload.count || 0);
        state.error = null;
        state.lastAction = 'getMyApplicationsCount.fulfilled';
      })
      .addCase(getMyApplicationsCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || 'Failed to fetch applications count';
        state.lastAction = 'getMyApplicationsCount.rejected';
      })

      // Get developer applied projects
      .addCase(getDeveloperAppliedProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.lastAction = 'getDeveloperAppliedProjects.pending';
      })
      .addCase(getDeveloperAppliedProjects.fulfilled, (state, action) => {
        state.loading = false;
        const appliedProjects = action.payload.appliedProjects || [];
        state.myApplications = appliedProjects;
        state.myApplicationsCount = appliedProjects.length;
        // Extract project IDs from applications (source: project_applicants table from database)
        const ids = appliedProjects.map(a => a.projectId || (a.project?.id)).filter(id => typeof id === 'number' && !isNaN(id));
        // REPLACE appliedProjects (don't append) - data comes from database project_applicants table
        state.appliedProjects = Array.from(new Set(ids));
        console.log('Redux: getDeveloperAppliedProjects.fulfilled - Data from project_applicants table:', {
          userId: 'current user (from JWT)',
          applicationsCount: appliedProjects.length,
          projectIds: ids,
          source: 'project_applicants table (database)'
        });
        state.error = null;
        state.lastAction = 'getDeveloperAppliedProjects.fulfilled';
      })
      .addCase(getDeveloperAppliedProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || 'Failed to fetch applied projects';
        state.lastAction = 'getDeveloperAppliedProjects.rejected';
      })

      // Generate applicants report
      .addCase(generateApplicantsReport.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
        state.lastAction = 'generateApplicantsReport.pending';
      })
      .addCase(generateApplicantsReport.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || 'Report generated successfully';
        state.error = null;
        state.lastAction = 'generateApplicantsReport.fulfilled';
      })
      .addCase(generateApplicantsReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || 'Failed to generate report';
        state.message = null;
        state.lastAction = 'generateApplicantsReport.rejected';
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

// Middleware to automatically save appliedProjects to localStorage (DISABLED - Data comes from DB now)
// REMOVED: No longer saving to localStorage since data comes from project_applicants table via API
// The database is the single source of truth for applied projects
export const appliedProjectsMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  
  // DISABLED: Don't save to localStorage anymore
  // Data comes from project_applicants table in database via API calls
  // The API queries: SELECT * FROM project_applicants WHERE user_id = $1
  
  return result;
};

export default projectSlice.reducer;
