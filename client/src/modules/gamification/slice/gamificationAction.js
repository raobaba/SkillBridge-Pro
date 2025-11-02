import fetchFromApiServer from "../../../services/api";

// Developer Dashboard / Gamification APIs
export const getDeveloperStatsApi = async () => {
  const url = `api/v1/user/developer/stats`;
  return await fetchFromApiServer("GET", url);
};

export const getDeveloperReviewsApi = async (limit = 10) => {
  const url = `api/v1/user/developer/reviews?limit=${limit}`;
  return await fetchFromApiServer("GET", url);
};

export const getDeveloperEndorsementsApi = async (limit = 10) => {
  const url = `api/v1/user/developer/endorsements?limit=${limit}`;
  return await fetchFromApiServer("GET", url);
};

export const getLeaderboardApi = async (limit = 10) => {
  const url = `api/v1/user/leaderboard?limit=${limit}`;
  return await fetchFromApiServer("GET", url);
};

export const getDeveloperAchievementsApi = async () => {
  const url = `api/v1/user/developer/achievements`;
  return await fetchFromApiServer("GET", url);
};

// Project Owner Dashboard / Gamification APIs
export const getProjectOwnerStatsApi = async () => {
  const url = `api/v1/projects/owner/stats`;
  return await fetchFromApiServer("GET", url);
};

export const getPendingEvaluationsApi = async () => {
  const url = `api/v1/projects/owner/pending-evaluations`;
  return await fetchFromApiServer("GET", url);
};

export const getEvaluationHistoryApi = async () => {
  const url = `api/v1/projects/owner/evaluation-history`;
  return await fetchFromApiServer("GET", url);
};

export const submitEvaluationApi = async (evaluationData) => {
  const url = `api/v1/projects/reviews`;
  return await fetchFromApiServer("POST", url, evaluationData);
};
