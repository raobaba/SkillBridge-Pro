import fetchFromApiServer from "../../../services/api";

// Task CRUD Operations
export const createTaskApi = async (data) => {
  const url = `api/v1/tasks`;
  return await fetchFromApiServer("POST", url, data);
};

export const getTaskByIdApi = async (taskId) => {
  const url = `api/v1/tasks/${taskId}`;
  return await fetchFromApiServer("GET", url);
};

export const getProjectOwnerTasksApi = async (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  const url = `api/v1/tasks/owner${queryParams ? `?${queryParams}` : ''}`;
  return await fetchFromApiServer("GET", url);
};

export const updateTaskApi = async (taskId, data) => {
  const url = `api/v1/tasks/${taskId}`;
  return await fetchFromApiServer("PUT", url, data);
};

export const deleteTaskApi = async (taskId) => {
  const url = `api/v1/tasks/${taskId}`;
  return await fetchFromApiServer("DELETE", url);
};

export const startTaskApi = async (taskId) => {
  const url = `api/v1/tasks/${taskId}/start`;
  return await fetchFromApiServer("POST", url);
};

// Bulk Operations
export const bulkUpdateTasksApi = async (data) => {
  const url = `api/v1/tasks/bulk-update`;
  return await fetchFromApiServer("PUT", url, data);
};

export const bulkDeleteTasksApi = async (data) => {
  const url = `api/v1/tasks/bulk/delete`;
  return await fetchFromApiServer("DELETE", url, data);
};

export const bulkAssignTasksApi = async (data) => {
  const url = `api/v1/tasks/bulk-assign`;
  return await fetchFromApiServer("PUT", url, data);
};

// Task Submissions
export const submitTaskApi = async (taskId, data) => {
  const url = `api/v1/tasks/${taskId}/submit`;
  return await fetchFromApiServer("POST", url, data);
};

export const reviewSubmissionApi = async (submissionId, data) => {
  const url = `api/v1/tasks/submissions/${submissionId}/review`;
  return await fetchFromApiServer("PUT", url, data);
};

export const getTaskSubmissionsApi = async (taskId) => {
  const url = `api/v1/tasks/${taskId}/submissions`;
  return await fetchFromApiServer("GET", url);
};

// Task Comments
export const addTaskCommentApi = async (taskId, data) => {
  const url = `api/v1/tasks/${taskId}/comments`;
  return await fetchFromApiServer("POST", url, data);
};

export const getTaskCommentsApi = async (taskId) => {
  const url = `api/v1/tasks/${taskId}/comments`;
  return await fetchFromApiServer("GET", url);
};

export const updateTaskCommentApi = async (commentId, data) => {
  const url = `api/v1/tasks/comments/${commentId}`;
  return await fetchFromApiServer("PUT", url, data);
};

export const deleteTaskCommentApi = async (commentId) => {
  const url = `api/v1/tasks/comments/${commentId}`;
  return await fetchFromApiServer("DELETE", url);
};

// Time Tracking
export const startTimerApi = async (taskId, data = {}) => {
  const url = `api/v1/tasks/${taskId}/timer/start`;
  return await fetchFromApiServer("POST", url, data);
};

export const stopTimerApi = async (taskId) => {
  const url = `api/v1/tasks/${taskId}/timer/stop`;
  return await fetchFromApiServer("POST", url);
};

export const stopActiveTimerApi = async () => {
  const url = `api/v1/tasks/timer/stop-active`;
  return await fetchFromApiServer("POST", url);
};

export const getTaskTimeTrackingApi = async (taskId) => {
  const url = `api/v1/tasks/${taskId}/time-tracking`;
  return await fetchFromApiServer("GET", url);
};

export const getUserTimeTrackingApi = async (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  const url = `api/v1/tasks/user/time-tracking${queryParams ? `?${queryParams}` : ''}`;
  return await fetchFromApiServer("GET", url);
};

// Analytics
export const getCollaborationStatsApi = async (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  const url = `api/v1/tasks/analytics/collaboration${queryParams ? `?${queryParams}` : ''}`;
  return await fetchFromApiServer("GET", url);
};

export const getDeveloperPerformanceStatsApi = async () => {
  const url = `api/v1/tasks/analytics/performance`;
  return await fetchFromApiServer("GET", url);
};

