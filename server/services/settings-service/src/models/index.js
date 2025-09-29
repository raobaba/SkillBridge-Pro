const { userSubscriptionsTable, UserSubscriptionsModel } = require("./user-subscriptions.model");
const { userNotificationSettingsTable, UserNotificationSettingsModel } = require("./user-notification-settings.model");
const { userNotificationFrequencyTable, UserNotificationFrequencyModel } = require("./user-notification-frequency.model");
const { userQuietHoursTable, UserQuietHoursModel } = require("./user-quiet-hours.model");
const { userPrivacySettingsTable, UserPrivacySettingsModel } = require("./user-privacy-settings.model");
const { userIntegrationsTable, UserIntegrationsModel } = require("./user-integrations.model");

module.exports = {
  userSubscriptionsTable,
  UserSubscriptionsModel,
  userNotificationSettingsTable,
  UserNotificationSettingsModel,
  userNotificationFrequencyTable,
  UserNotificationFrequencyModel,
  userQuietHoursTable,
  UserQuietHoursModel,
  userPrivacySettingsTable,
  UserPrivacySettingsModel,
  userIntegrationsTable,
  UserIntegrationsModel,
};


