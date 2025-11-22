// AI Career Action - Connected to Backend APIs
import fetchFromApiServer from "../../../services/api";

/**
 * Get career recommendations for developers
 */
export const getCareerRecommendationsApi = async () => {
  const url = `api/v1/ai-career/recommendations`;
  return await fetchFromApiServer("GET", url);
};

/**
 * Get resume enhancement suggestions
 */
export const enhanceResumeApi = async () => {
  const url = `api/v1/ai-career/resume-suggestions`;
  return await fetchFromApiServer("GET", url);
};

/**
 * Match developers for a project
 */
export const matchDevelopersApi = async (projectId = null) => {
  const queryParams = projectId ? `?projectId=${projectId}` : '';
  const url = `api/v1/ai-career/developer-matches${queryParams}`;
  return await fetchFromApiServer("GET", url);
};

/**
 * Get project optimization suggestions
 */
export const optimizeProjectApi = async (projectId) => {
  if (!projectId) {
    throw new Error('Project ID is required');
  }
  const url = `api/v1/ai-career/project-optimizations?projectId=${projectId}`;
  return await fetchFromApiServer("GET", url);
};

/**
 * Analyze skill gaps for developers
 */
export const analyzeSkillGapApi = async () => {
  const url = `api/v1/ai-career/skill-gaps`;
  return await fetchFromApiServer("GET", url);
};

/**
 * Get skill demand trends
 */
export const getSkillTrendsApi = async () => {
  const url = `api/v1/ai-career/skill-trends`;
  return await fetchFromApiServer("GET", url);
};

/**
 * Get platform insights
 */
export const getPlatformInsightsApi = async () => {
  const url = `api/v1/ai-career/platform-insights`;
  return await fetchFromApiServer("GET", url);
};

/**
 * Analyze team skills and gaps
 */
export const analyzeTeamApi = async (projectId = null, teamData = {}) => {
  let queryParams = projectId ? `?projectId=${projectId}` : '';
  if (teamData.currentTeam && teamData.currentTeam.length > 0) {
    queryParams += queryParams ? '&' : '?';
    queryParams += `currentTeam=${encodeURIComponent(JSON.stringify(teamData.currentTeam))}`;
  }
  if (teamData.requiredSkills && teamData.requiredSkills.length > 0) {
    queryParams += queryParams ? '&' : '?';
    queryParams += `requiredSkills=${encodeURIComponent(JSON.stringify(teamData.requiredSkills))}`;
  }
  const url = `api/v1/ai-career/team-analysis${queryParams}`;
  return await fetchFromApiServer("GET", url);
};

/**
 * Get admin career dashboard (metrics and insights)
 */
export const getAdminCareerDashboardApi = async (timeframe = '6m') => {
  const url = `api/v1/ai-career/admin/dashboard?timeframe=${timeframe}`;
  return await fetchFromApiServer("GET", url);
};