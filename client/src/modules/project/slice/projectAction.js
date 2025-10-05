import fetchFromApiServer from "../../../services/api";

// Project CRUD Operations
export const createProjectApi = async (data) => {
  const url = `api/v1/projects`;
  return await fetchFromApiServer("POST", url, data);
};

export const getProjectApi = async (id) => {
  const url = `api/v1/projects/${id}`;
  return await fetchFromApiServer("GET", url);
};

export const listProjectsApi = async (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  const url = `api/v1/projects${queryParams ? `?${queryParams}` : ''}`;
  return await fetchFromApiServer("GET", url);
};

export const updateProjectApi = async (id, data) => {
  const url = `api/v1/projects/${id}`;
  return await fetchFromApiServer("PUT", url, data);
};

export const deleteProjectApi = async (id) => {
  const url = `api/v1/projects/${id}`;
  return await fetchFromApiServer("DELETE", url);
};

// Application Management
export const applyToProjectApi = async (data) => {
  const url = `api/v1/projects/apply`;
  return await fetchFromApiServer("POST", url, data);
};

export const withdrawApplicationApi = async (data) => {
  const url = `api/v1/projects/apply`;
  return await fetchFromApiServer("DELETE", url, data);
};

export const updateApplicantStatusApi = async (data) => {
  const url = `api/v1/projects/applicants/status`;
  return await fetchFromApiServer("PUT", url, data);
};

export const listApplicantsApi = async (projectId) => {
  const url = `api/v1/projects/${projectId}/applicants`;
  return await fetchFromApiServer("GET", url);
};

// Invitation Management
export const createInviteApi = async (data) => {
  const url = `api/v1/projects/invite`;
  return await fetchFromApiServer("POST", url, data);
};

export const getMyInvitesApi = async () => {
  const url = `api/v1/projects/invites/my`;
  return await fetchFromApiServer("GET", url);
};

export const respondInviteApi = async (data) => {
  const url = `api/v1/projects/invite/respond`;
  return await fetchFromApiServer("PUT", url, data);
};

// File Management
export const addFileApi = async (formData) => {
  const url = `api/v1/projects/files`;
  return await fetchFromApiServer("MULTIPART_POST", url, formData);
};

export const getProjectFilesApi = async (projectId) => {
  const url = `api/v1/projects/${projectId}/files`;
  return await fetchFromApiServer("GET", url);
};

// Project Updates
export const addUpdateApi = async (data) => {
  const url = `api/v1/projects/updates`;
  return await fetchFromApiServer("POST", url, data);
};

// Reviews
export const addReviewApi = async (data) => {
  const url = `api/v1/projects/reviews`;
  return await fetchFromApiServer("POST", url, data);
};

// Project Boosting
export const addBoostApi = async (data) => {
  const url = `api/v1/projects/boost`;
  return await fetchFromApiServer("POST", url, data);
};

// Get project updates
export const getProjectUpdatesApi = async (projectId) => {
  const url = `api/v1/projects/${projectId}/updates`;
  return await fetchFromApiServer("GET", url);
};

// Get project reviews
export const getProjectReviewsApi = async (projectId) => {
  const url = `api/v1/projects/${projectId}/reviews`;
  return await fetchFromApiServer("GET", url);
};

// Get project boosts
export const getProjectBoostsApi = async (projectId) => {
  const url = `api/v1/projects/${projectId}/boosts`;
  return await fetchFromApiServer("GET", url);
};

// Get project statistics
export const getProjectStatsApi = async (projectId) => {
  const url = `api/v1/projects/${projectId}/stats`;
  return await fetchFromApiServer("GET", url);
};

// Search projects with filters
export const searchProjectsApi = async (filters) => {
  const queryParams = new URLSearchParams(filters).toString();
  const url = `api/v1/projects/search?${queryParams}`;
  return await fetchFromApiServer("GET", url);
};

// Get project recommendations
export const getProjectRecommendationsApi = async (limit = 10) => {
  const url = `api/v1/projects/recommendations?limit=${limit}`;
  return await fetchFromApiServer("GET", url);
};

// Public developer discovery: get public projects
export const getPublicProjectsApi = async (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  const url = `api/v1/projects/public${queryParams ? `?${queryParams}` : ''}`;
  return await fetchFromApiServer("GET", url);
};

// Public: get project categories
export const getProjectCategoriesApi = async () => {
  const url = `api/v1/projects/categories`;
  return await fetchFromApiServer("GET", url);
};

// Public: get project metadata (experience levels, priorities, etc.)
export const getProjectMetadataApi = async () => {
  const url = `api/v1/projects/metadata`;
  return await fetchFromApiServer("GET", url);
};

// Saves (Bookmarks)
export const addProjectSaveApi = async (data) => {
  const url = `api/v1/projects/saves`;
  return await fetchFromApiServer("POST", url, data);
};

export const removeProjectSaveApi = async (data) => {
  const url = `api/v1/projects/saves`;
  return await fetchFromApiServer("DELETE", url, data);
};

export const getProjectSavesApi = async () => {
  const url = `api/v1/projects/saves/my`;
  return await fetchFromApiServer("GET", url);
};

// Add project to favorites
export const addProjectFavoriteApi = async (data) => {
  const url = `api/v1/projects/favorites`;
  return await fetchFromApiServer("POST", url, data);
};

// Remove project from favorites
export const removeProjectFavoriteApi = async (data) => {
  const url = `api/v1/projects/favorites`;
  return await fetchFromApiServer("DELETE", url, data);
};

// Get user's favorite projects
export const getProjectFavoritesApi = async () => {
  const url = `api/v1/projects/favorites/my`;
  return await fetchFromApiServer("GET", url);
};

// Add project comment
export const addProjectCommentApi = async (data) => {
  const url = `api/v1/projects/comments`;
  return await fetchFromApiServer("POST", url, data);
};

// Get project comments
export const getProjectCommentsApi = async (projectId) => {
  const url = `api/v1/projects/${projectId}/comments`;
  return await fetchFromApiServer("GET", url);
};

// Update project comment
export const updateProjectCommentApi = async (commentId, data) => {
  const url = `api/v1/projects/comments/${commentId}`;
  return await fetchFromApiServer("PUT", url, data);
};

// Delete project comment
export const deleteProjectCommentApi = async (commentId) => {
  const url = `api/v1/projects/comments/${commentId}`;
  return await fetchFromApiServer("DELETE", url);
};
