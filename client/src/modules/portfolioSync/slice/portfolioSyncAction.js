import fetchFromApiServer from "../../../services/api";

// Get sync status for all integrations
export const getSyncStatusApi = async () => {
  const url = `api/v1/user/portfolio-sync/status`;
  return await fetchFromApiServer("GET", url);
};

// Get connected integrations
export const getIntegrationsApi = async () => {
  const url = `api/v1/user/portfolio-sync/integrations`;
  return await fetchFromApiServer("GET", url);
};

// Connect GitHub integration
export const connectGitHubApi = async (data) => {
  const url = `api/v1/user/portfolio-sync/integrations/github/connect`;
  return await fetchFromApiServer("POST", url, data);
};

// Connect StackOverflow integration
export const connectStackOverflowApi = async (data) => {
  const url = `api/v1/user/portfolio-sync/integrations/stackoverflow/connect`;
  return await fetchFromApiServer("POST", url, data);
};

// Disconnect integration
export const disconnectIntegrationApi = async (platform) => {
  const url = `api/v1/user/portfolio-sync/integrations/${platform}/disconnect`;
  return await fetchFromApiServer("POST", url);
};

// Trigger sync
export const triggerSyncApi = async (data) => {
  const url = `api/v1/user/portfolio-sync/sync`;
  return await fetchFromApiServer("POST", url, data);
};

// Get sync history
export const getSyncHistoryApi = async (limit = 10) => {
  const url = `api/v1/user/portfolio-sync/history`;
  return await fetchFromApiServer("GET", url, null, { limit });
};

// Get sync data
export const getSyncDataApi = async (platform = null, dataType = null) => {
  const params = {};
  if (platform) params.platform = platform;
  if (dataType) params.dataType = dataType;
  const url = `api/v1/user/portfolio-sync/data`;
  return await fetchFromApiServer("GET", url, null, params);
};

// Get skill scores
export const getSkillScoresApi = async (platform = null) => {
  const url = `api/v1/user/portfolio-sync/skills`;
  const params = platform ? { platform } : {};
  return await fetchFromApiServer("GET", url, null, params);
};

