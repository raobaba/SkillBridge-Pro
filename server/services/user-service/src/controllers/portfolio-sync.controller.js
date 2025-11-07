const { PortfolioSyncModel } = require("../models/portfolio-sync.model");
const { PortfolioSyncService } = require("../services/portfolio-sync.service");
const ErrorHandler = require("shared/utils/errorHandler");
const API_URLS = require("../config/api-urls.config");

// Get sync status for all integrations
const getSyncStatus = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;

    if (!userId) {
      return new ErrorHandler("User not authenticated", 401).sendError(res);
    }

    // Get all integration tokens
    const tokens = await PortfolioSyncModel.getAllIntegrationTokens(userId);

    // Get last sync history for each platform
    const syncHistory = await PortfolioSyncModel.getSyncHistory(userId, 50);
    
    // Get overall skill scores
    const overallSkills = await PortfolioSyncModel.getOverallSkillScore(userId);

    // Get sync data counts
    const githubData = await PortfolioSyncModel.getSyncData(userId, "github");
    const stackoverflowData = await PortfolioSyncModel.getSyncData(userId, "stackoverflow");

    const status = {
      integrations: {
        github: {
          connected: tokens.some((t) => t.platform === "github"),
          lastSync: syncHistory.find((h) => h.platform === "github")?.completedAt || null,
          dataCount: githubData.length,
        },
        stackoverflow: {
          connected: tokens.some((t) => t.platform === "stackoverflow"),
          lastSync: syncHistory.find((h) => h.platform === "stackoverflow")?.completedAt || null,
          dataCount: stackoverflowData.length,
        },
      },
      overallScore: overallSkills.overallScore,
      skills: overallSkills.skills,
      lastSync: syncHistory[0]?.completedAt || null,
    };

    res.json({
      success: true,
      data: status,
    });
  } catch (error) {
    return new ErrorHandler(error.message, 500).sendError(res);
  }
};

// Get connected integrations
const getIntegrations = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;

    if (!userId) {
      return new ErrorHandler("User not authenticated", 401).sendError(res);
    }

    const tokens = await PortfolioSyncModel.getAllIntegrationTokens(userId);

    const integrations = tokens.map((token) => ({
      platform: token.platform,
      username: token.platformUsername,
      connectedAt: token.createdAt,
      lastSync: null, // Will be populated from sync history
    }));

    res.json({
      success: true,
      data: integrations,
    });
  } catch (error) {
    return new ErrorHandler(error.message, 500).sendError(res);
  }
};

// Connect GitHub integration
const connectGitHub = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const { accessToken, refreshToken, expiresIn, scope } = req.body;

    if (!userId) {
      return new ErrorHandler("User not authenticated", 401).sendError(res);
    }

    if (!accessToken) {
      return new ErrorHandler("Access token is required", 400).sendError(res);
    }

    // Fetch GitHub user info to get username
    const axios = require("axios");
    const userResponse = await axios.get(`${API_URLS.GITHUB_API_BASE_URL}/user`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    const expiresAt = expiresIn ? new Date(Date.now() + expiresIn * 1000) : null;

    await PortfolioSyncModel.upsertIntegrationToken(userId, "github", {
      accessToken,
      refreshToken,
      tokenType: "Bearer",
      expiresAt,
      scope,
      platformUserId: userResponse.data.id.toString(),
      platformUsername: userResponse.data.login,
      isActive: true,
    });

    res.json({
      success: true,
      message: "GitHub connected successfully",
      data: {
        platform: "github",
        username: userResponse.data.login,
      },
    });
  } catch (error) {
    return new ErrorHandler(error.message || "Failed to connect GitHub", 500).sendError(res);
  }
};

// Connect StackOverflow integration
const connectStackOverflow = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const { accessToken, userId: stackOverflowUserId, username } = req.body;

    if (!userId) {
      return new ErrorHandler("User not authenticated", 401).sendError(res);
    }

    if (!accessToken || !stackOverflowUserId) {
      return new ErrorHandler("Access token and user ID are required", 400).sendError(res);
    }

    await PortfolioSyncModel.upsertIntegrationToken(userId, "stackoverflow", {
      accessToken,
      tokenType: "Bearer",
      platformUserId: stackOverflowUserId.toString(),
      platformUsername: username || stackOverflowUserId.toString(),
      isActive: true,
    });

    res.json({
      success: true,
      message: "StackOverflow connected successfully",
      data: {
        platform: "stackoverflow",
        userId: stackOverflowUserId,
      },
    });
  } catch (error) {
    return new ErrorHandler(error.message || "Failed to connect StackOverflow", 500).sendError(res);
  }
};

// Disconnect integration
const disconnectIntegration = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const { platform } = req.params;

    if (!userId) {
      return new ErrorHandler("User not authenticated", 401).sendError(res);
    }

    if (!["github", "stackoverflow"].includes(platform)) {
      return new ErrorHandler("Invalid platform", 400).sendError(res);
    }

    await PortfolioSyncModel.deleteIntegrationToken(userId, platform);

    res.json({
      success: true,
      message: `${platform} disconnected successfully`,
    });
  } catch (error) {
    return new ErrorHandler(error.message, 500).sendError(res);
  }
};

// Trigger sync for specific platform or all
const triggerSync = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const { platform } = req.body; // 'github', 'stackoverflow', 'portfolio', or 'all'

    if (!userId) {
      return new ErrorHandler("User not authenticated", 401).sendError(res);
    }

    let results;

    if (platform === "github") {
      results = await PortfolioSyncService.syncGitHub(userId);
    } else if (platform === "stackoverflow") {
      const { stackOverflowUserId } = req.body;
      if (!stackOverflowUserId) {
        return new ErrorHandler("StackOverflow user ID is required", 400).sendError(res);
      }
      results = await PortfolioSyncService.syncStackOverflow(userId, stackOverflowUserId);
    } else if (platform === "portfolio") {
      const { UserModel } = require("../models/user.model");
      const user = await UserModel.getUserById(userId);
      if (!user?.portfolioUrl) {
        return new ErrorHandler("Portfolio URL not found", 400).sendError(res);
      }
      results = await PortfolioSyncService.syncPortfolio(userId, user.portfolioUrl);
    } else if (platform === "all" || !platform) {
      results = await PortfolioSyncService.syncAll(userId);
    } else {
      return new ErrorHandler("Invalid platform", 400).sendError(res);
    }

    res.json({
      success: true,
      message: "Sync completed",
      data: results,
    });
  } catch (error) {
    return new ErrorHandler(error.message, 500).sendError(res);
  }
};

// Get sync history
const getSyncHistory = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const { limit = 10 } = req.query;

    if (!userId) {
      return new ErrorHandler("User not authenticated", 401).sendError(res);
    }

    const history = await PortfolioSyncModel.getSyncHistory(userId, parseInt(limit));

    res.json({
      success: true,
      data: history,
    });
  } catch (error) {
    return new ErrorHandler(error.message, 500).sendError(res);
  }
};

// Get sync data
const getSyncData = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const { platform, dataType } = req.query;

    if (!userId) {
      return new ErrorHandler("User not authenticated", 401).sendError(res);
    }

    const data = await PortfolioSyncModel.getSyncData(userId, platform, dataType);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    return new ErrorHandler(error.message, 500).sendError(res);
  }
};

// Get skill scores
const getSkillScores = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const { platform } = req.query;

    if (!userId) {
      return new ErrorHandler("User not authenticated", 401).sendError(res);
    }

    if (platform === "overall" || !platform) {
      const overallSkills = await PortfolioSyncModel.getOverallSkillScore(userId);
      res.json({
        success: true,
        data: overallSkills,
      });
    } else {
      const skills = await PortfolioSyncModel.getSkillScores(userId, platform);
      res.json({
        success: true,
        data: skills,
      });
    }
  } catch (error) {
    return new ErrorHandler(error.message, 500).sendError(res);
  }
};

module.exports = {
  getSyncStatus,
  getIntegrations,
  connectGitHub,
  connectStackOverflow,
  disconnectIntegration,
  triggerSync,
  getSyncHistory,
  getSyncData,
  getSkillScores,
};

