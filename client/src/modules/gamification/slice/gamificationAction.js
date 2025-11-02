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
