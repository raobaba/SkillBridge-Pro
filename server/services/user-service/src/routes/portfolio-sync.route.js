const express = require("express");
const portfolioSyncController = require("../controllers/portfolio-sync.controller");
const authenticate = require("shared/middleware/auth.middleware");

const portfolioSyncRouter = express.Router();

// All portfolio sync routes
portfolioSyncRouter.get("/status", authenticate, portfolioSyncController.getSyncStatus);
portfolioSyncRouter.get("/integrations", authenticate, portfolioSyncController.getIntegrations);
portfolioSyncRouter.post("/integrations/github/connect", authenticate, portfolioSyncController.connectGitHub);
portfolioSyncRouter.post("/integrations/stackoverflow/connect", authenticate, portfolioSyncController.connectStackOverflow);
portfolioSyncRouter.post("/integrations/:platform/disconnect", authenticate, portfolioSyncController.disconnectIntegration);
portfolioSyncRouter.post("/sync", authenticate, portfolioSyncController.triggerSync);
portfolioSyncRouter.get("/history", authenticate, portfolioSyncController.getSyncHistory);
portfolioSyncRouter.get("/data", authenticate, portfolioSyncController.getSyncData);
portfolioSyncRouter.get("/skills", authenticate, portfolioSyncController.getSkillScores);

module.exports = portfolioSyncRouter;

