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