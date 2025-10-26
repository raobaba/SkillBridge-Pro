import fetchFromApiServer from "../../../services/api";

// Notification Settings APIs
export const getNotificationSettingsApi = async () => {
  const url = `api/v1/settings/notifications`;
  return await fetchFromApiServer("GET", url);
};

export const updateNotificationSettingsApi = async (data) => {
  const url = `api/v1/settings/notifications`;
  return await fetchFromApiServer("PUT", url, data);
};

// Notification Frequency APIs
export const getNotificationFrequencyApi = async () => {
  const url = `api/v1/settings/notifications/frequency`;
  return await fetchFromApiServer("GET", url);
};

export const updateNotificationFrequencyApi = async (data) => {
  const url = `api/v1/settings/notifications/frequency`;
  return await fetchFromApiServer("PUT", url, data);
};

// Quiet Hours APIs
export const getQuietHoursApi = async () => {
  const url = `api/v1/settings/quiet-hours`;
  return await fetchFromApiServer("GET", url);
};

export const updateQuietHoursApi = async (data) => {
  const url = `api/v1/settings/quiet-hours`;
  return await fetchFromApiServer("PUT", url, data);
};

// Privacy Settings APIs
export const getPrivacySettingsApi = async () => {
  const url = `api/v1/settings/privacy`;
  return await fetchFromApiServer("GET", url);
};

export const updatePrivacySettingsApi = async (data) => {
  const url = `api/v1/settings/privacy`;
  return await fetchFromApiServer("PUT", url, data);
};

// Integrations APIs
export const getIntegrationsApi = async () => {
  const url = `api/v1/settings/integrations`;
  return await fetchFromApiServer("GET", url);
};

export const updateIntegrationsApi = async (data) => {
  const url = `api/v1/settings/integrations`;
  return await fetchFromApiServer("PUT", url, data);
};

// Subscription APIs
export const getSubscriptionApi = async () => {
  const url = `api/v1/settings/subscription`;
  return await fetchFromApiServer("GET", url);
};

export const updateSubscriptionApi = async (data) => {
  const url = `api/v1/settings/subscription`;
  return await fetchFromApiServer("PUT", url, data);
};
