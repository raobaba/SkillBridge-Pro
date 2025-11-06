import fetchFromApiServer from "../../../services/api";

// Get all notifications for the authenticated user
export const getNotificationsApi = async (filters = {}) => {
  const { type, category, read, priority, archived, limit, offset } = filters;
  const queryParams = new URLSearchParams();

  if (type) queryParams.append("type", type);
  if (category) queryParams.append("category", category);
  if (read !== undefined) queryParams.append("read", read);
  if (priority) queryParams.append("priority", priority);
  if (archived !== undefined) queryParams.append("archived", archived);
  if (limit) queryParams.append("limit", limit);
  if (offset) queryParams.append("offset", offset);

  const url = `api/v1/user/notifications${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  return await fetchFromApiServer("GET", url);
};

// Get unread notifications count
export const getUnreadCountApi = async () => {
  const url = `api/v1/user/notifications/unread-count`;
  return await fetchFromApiServer("GET", url);
};

// Create a new notification
export const createNotificationApi = async (notificationData) => {
  const url = `api/v1/user/notifications`;
  return await fetchFromApiServer("POST", url, notificationData);
};

// Mark notification as read
export const markNotificationAsReadApi = async (notificationId) => {
  const url = `api/v1/user/notifications/${notificationId}/read`;
  return await fetchFromApiServer("PUT", url);
};

// Mark all notifications as read
export const markAllNotificationsAsReadApi = async () => {
  const url = `api/v1/user/notifications/read-all`;
  return await fetchFromApiServer("PUT", url);
};

// Delete notification
export const deleteNotificationApi = async (notificationId) => {
  const url = `api/v1/user/notifications/${notificationId}`;
  return await fetchFromApiServer("DELETE", url);
};

// Delete all notifications
export const deleteAllNotificationsApi = async () => {
  const url = `api/v1/user/notifications`;
  return await fetchFromApiServer("DELETE", url);
};

