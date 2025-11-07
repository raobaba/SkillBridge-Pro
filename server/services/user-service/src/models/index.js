const { userTable, UserModel } = require("./user.model");
const { notificationsTable, NotificationsModel } = require("./notifications.model");
const {
  PortfolioSyncModel,
  integrationTokensTable,
  portfolioSyncDataTable,
  syncHistoryTable,
  skillScoresTable,
} = require("./portfolio-sync.model");

module.exports = {
  userTable,
  UserModel,
  notificationsTable,
  NotificationsModel,
  PortfolioSyncModel,
  integrationTokensTable,
  portfolioSyncDataTable,
  syncHistoryTable,
  skillScoresTable,
};
