const express = require("express");
const passport = require("passport");
const portfolioSyncController = require("../controllers/portfolio-sync.controller");
const authenticate = require("shared/middleware/auth.middleware");

const portfolioSyncRouter = express.Router();

// OAuth Routes for Portfolio Sync
// GitHub OAuth for Portfolio Sync
portfolioSyncRouter.get(
  "/oauth/github",
  // Custom middleware to handle token from query parameter (for OAuth redirects)
  async (req, res, next) => {
    try {
      // Check if token is in query parameter (for OAuth redirects)
      if (req.query.token && !req.headers.authorization) {
        req.headers.authorization = `Bearer ${req.query.token}`;
      }
      next();
    } catch (error) {
      console.error("Error in token extraction middleware:", error);
      next(error);
    }
  },
  authenticate,
  (req, res, next) => {
    try {
      // Store user ID in session for callback
      const userId = req.user?.userId || req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User ID not found",
        });
      }
      
      req.session.portfolioSyncUserId = userId;
      req.session.save((err) => {
        if (err) {
          console.error("Error saving session:", err);
          return res.status(500).json({
            success: false,
            message: "Failed to save session",
            error: err.message,
          });
        }
        next();
      });
    } catch (error) {
      console.error("Error in session middleware:", error);
      next(error);
    }
  },
  (req, res, next) => {
    // Check if passport strategy is registered
    if (!passport._strategies || !passport._strategies["github-portfolio-sync"]) {
      console.error("GitHub portfolio sync strategy not registered");
      return res.status(500).json({
        success: false,
        message: "GitHub OAuth strategy not configured",
      });
    }
    
    // Call passport authenticate - it will redirect to GitHub
    // Errors will be handled by the error middleware
    passport.authenticate("github-portfolio-sync", { scope: ["user:email", "repo", "read:user"] })(req, res, next);
  }
);

// Note: The callback is handled by the unified callback handler at /api/v1/auth/github/callback
// This route is not needed anymore since we're using the unified callback

// StackOverflow OAuth (placeholder - typically requires manual token input)
portfolioSyncRouter.get(
  "/oauth/stackoverflow",
  authenticate,
  (req, res) => {
    // StackOverflow OAuth flow would go here
    // For now, return instructions
    res.json({
      success: true,
      message: "StackOverflow OAuth integration",
      instructions: "Please use the connect endpoint with your access token",
    });
  }
);

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
portfolioSyncRouter.get("/developer/:developerId", authenticate, portfolioSyncController.getDeveloperPortfolioSyncData);

module.exports = portfolioSyncRouter;

