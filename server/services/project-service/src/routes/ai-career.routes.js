const express = require("express");
const aiCareerController = require("../controllers/ai-career.controller");
const authenticate = require("shared/middleware/auth.middleware");

const aiCareerRouter = express.Router();

// All routes require authentication
aiCareerRouter.use(authenticate);

// Developer endpoints
aiCareerRouter.get("/recommendations", aiCareerController.getCareerRecommendations);
aiCareerRouter.get("/resume-suggestions", aiCareerController.getResumeSuggestions);
aiCareerRouter.get("/skill-gaps", aiCareerController.analyzeSkillGap);

// Project Owner endpoints
aiCareerRouter.get("/developer-matches", aiCareerController.matchDevelopers);
aiCareerRouter.get("/project-optimizations", aiCareerController.optimizeProject);
aiCareerRouter.get("/team-analysis", aiCareerController.analyzeTeam);

// Admin endpoints
aiCareerRouter.get("/skill-trends", aiCareerController.getSkillTrends);
aiCareerRouter.get("/platform-insights", aiCareerController.getPlatformInsights);
aiCareerRouter.get("/admin/dashboard", aiCareerController.getAdminCareerDashboard);

module.exports = aiCareerRouter;

