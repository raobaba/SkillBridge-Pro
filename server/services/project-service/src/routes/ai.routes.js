const express = require("express");
const aiController = require("../controllers/ai.controller");
const authenticate = require("shared/middleware/auth.middleware");

const aiRouter = express.Router();

// AI suggestion endpoints
aiRouter.post("/description", authenticate, aiController.generateProjectDescription);
aiRouter.post("/titles", authenticate, aiController.generateProjectTitles);
aiRouter.post("/skills", authenticate, aiController.generateSkillSuggestions);
aiRouter.post("/requirements", authenticate, aiController.generateRequirements);
aiRouter.post("/benefits", authenticate, aiController.generateBenefits);
aiRouter.post("/budget", authenticate, aiController.generateBudgetSuggestions);
aiRouter.post("/comprehensive", authenticate, aiController.generateComprehensiveSuggestions);

module.exports = aiRouter;
