import fetchFromApiServer from "../../../services/api";

// Project Owner Profile API Functions
export const getProjectOwnerStatsApi = async () => {
  const url = `api/v1/projects/owner/stats`;
  return await fetchFromApiServer("GET", url);
};

export const getProjectOwnerProjectsApi = async () => {
  const url = `api/v1/projects/owner/projects`;
  return await fetchFromApiServer("GET", url);
};

export const getProjectOwnerReviewsApi = async () => {
  const url = `api/v1/projects/owner/reviews`;
  return await fetchFromApiServer("GET", url);
};

export const getProjectOwnerDevelopersApi = async () => {
  const url = `api/v1/projects/owner/developers`;
  return await fetchFromApiServer("GET", url);
};

// Admin Profile API Functions
export const getAdminAnalyticsApi = async (timeframe = '6m') => {
  const url = `api/v1/user/admin/analytics?timeframe=${timeframe}`;
  return await fetchFromApiServer("GET", url);
};

export const getAllUsersApi = async (role = null, limit = 100) => {
  const queryParams = new URLSearchParams();
  if (role) queryParams.append('role', role);
  if (limit) queryParams.append('limit', limit);
  const url = `api/v1/user/chat/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return await fetchFromApiServer("GET", url);
};

export const getDevelopersApi = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
  const url = `api/v1/user/developers${queryParams ? `?${queryParams}` : ''}`;
  return await fetchFromApiServer("GET", url);
};
