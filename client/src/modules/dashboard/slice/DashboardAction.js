import fetchFromApiServer from "../../../services/api";

// Get admin analytics
export const getAdminAnalyticsApi = async (timeframe = '6m') => {
  const url = `api/v1/user/admin/analytics?timeframe=${timeframe}`;
  return await fetchFromApiServer("GET", url);
};

