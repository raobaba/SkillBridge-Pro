const express = require("express");
const projectController = require("../controllers/projects.controller");
const tasksController = require("../controllers/tasks.controller");
const authenticate = require("shared/middleware/auth.middleware");
const {
  requireProjectOwner,
  requireDeveloper,
  requireProjectManager,
  requireAdmin,
} = require("shared/middleware/roleAuth.middleware");

const projectRouter = express.Router();

// 📋 Project CRUD Operations (Only project owners can create/manage projects)
projectRouter.post(
  "/",
  authenticate,
  requireProjectOwner,
  projectController.createProject
);
projectRouter.get("/", projectController.listProjects); // Public - anyone can view projects
projectRouter.get("/public", projectController.getPublicProjects); // Public - developer discovery endpoint
// ❤️ Project Favorites (User-specific) - place BEFORE generic :id routes
projectRouter.post(
  "/favorites",
  authenticate,
  projectController.addProjectFavorite
);
projectRouter.delete(
  "/favorites",
  authenticate,
  projectController.removeProjectFavorite
);
projectRouter.get(
  "/favorites/my",
  authenticate,
  projectController.getProjectFavorites
);

// 🔖 Project Saves (User-specific)
projectRouter.post(
  "/saves",
  authenticate,
  projectController.addProjectSave
);
projectRouter.delete(
  "/saves",
  authenticate,
  projectController.removeProjectSave
);
projectRouter.get(
  "/saves/my",
  authenticate,
  projectController.getProjectSaves
);

// 🎯 Application Management (Developers apply/withdraw) - place BEFORE generic :id routes
projectRouter.post(
  "/apply",
  authenticate,
  requireDeveloper,
  projectController.applyToProject
);
projectRouter.delete(
  "/apply",
  authenticate,
  requireDeveloper,
  projectController.withdrawApplication
);
// projectRouter.get("/:id", projectController.getProject); // Moved to end to avoid route conflicts
projectRouter.put(
  "/:id",
  authenticate,
  requireProjectManager,
  projectController.updateProject
);
projectRouter.delete(
  "/:id",
  authenticate,
  requireProjectManager,
  projectController.deleteProject
);

// 🎯 Application Management (project owners manage applications)
projectRouter.put(
  "/applicants/status",
  authenticate,
  requireProjectManager,
  projectController.updateApplicantStatus
);
projectRouter.get(
  "/:projectId/applicants",
  authenticate,
  requireProjectManager,
  projectController.listApplicants
);

// 👤 Developer self applications
projectRouter.get(
  "/applications/my",
  authenticate,
  requireDeveloper,
  projectController.listMyApplications
);
projectRouter.get(
  "/applications/my/ids",
  authenticate,
  requireDeveloper,
  projectController.getMyAppliedProjectIds
);
projectRouter.get(
  "/applications/my/count",
  authenticate,
  requireDeveloper,
  projectController.getMyApplicationsCount
);

// 👤 Developer applied projects list
projectRouter.get(
  "/developer/applied-projects",
  authenticate,
  requireDeveloper,
  projectController.getDeveloperAppliedProjects
);

// 👤 Developer tasks (tasks assigned to developer) - Enhanced version
projectRouter.get(
  "/developer/tasks",
  authenticate,
  requireDeveloper,
  projectController.getDeveloperTasks
);

// 📋 Project Owner Tasks (all tasks in their projects)
projectRouter.get(
  "/owner/tasks",
  authenticate,
  requireProjectOwner,
  tasksController.getProjectOwnerTasks
);

// 📧 Invitation Management (Only project owners can send invites, developers can respond)
projectRouter.post(
  "/invite",
  authenticate,
  requireProjectManager,
  projectController.createInvite
);
projectRouter.get("/invites/my", authenticate, projectController.getMyInvites); // Developers can view their invites
projectRouter.get("/invites/sent", authenticate, requireProjectManager, projectController.getSentInvitations); // Project owners can view invites they sent
projectRouter.delete(
  "/invite",
  authenticate,
  requireProjectManager,
  projectController.cancelInvite
); // Project owners can cancel their invites
projectRouter.put(
  "/invite/respond",
  authenticate,
  projectController.respondInvite
); // Any authenticated user can respond to their own invites

// 📁 File Management (Project owners can add files, anyone can view)
projectRouter.post(
  "/files",
  authenticate,
  requireProjectManager,
  projectController.addFile
);
projectRouter.get("/:projectId/files", projectController.getProjectFiles); // Public - for portfolio viewing

// 📝 Project Updates (Only project owners can add updates)
projectRouter.post(
  "/updates",
  authenticate,
  requireProjectManager,
  projectController.addUpdate
);

// ⭐ Reviews (Any authenticated user can review completed projects)
projectRouter.post("/reviews", authenticate, projectController.addReview);

// 🚀 Project Boosting (Only project owners can boost their projects)
projectRouter.post(
  "/boost",
  authenticate,
  requireProjectManager,
  projectController.addBoost
);

// 📊 Project Analytics & Data (Public endpoints for viewing)
projectRouter.get("/:projectId/updates", projectController.getProjectUpdates);
projectRouter.get("/:projectId/reviews", projectController.getProjectReviews);
projectRouter.get("/:projectId/boosts", projectController.getProjectBoosts);
projectRouter.get("/:projectId/stats", projectController.getProjectStats);

// 📄 PDF Report Generation (Project owners only)
projectRouter.post("/analytics/download", authenticate, requireProjectManager, projectController.generateApplicantsReport);
projectRouter.post("/export", authenticate, requireProjectManager, projectController.generateApplicantsReport);

// 🔍 Advanced Search & Discovery
projectRouter.get("/search", projectController.searchProjects);
projectRouter.get("/search/suggestions", projectController.getSearchSuggestions); // Public - get search suggestions
projectRouter.get("/global/skills-tags", projectController.getGlobalSkillsAndTags); // Public - get all global skills and tags
projectRouter.get(
  "/recommendations",
  authenticate,
  projectController.getProjectRecommendations
);
projectRouter.get("/categories", projectController.getProjectCategories); // Public - get available categories
// Removed /metadata route - replaced by /filter-options which provides dynamic, database-driven filter options
projectRouter.get("/filter-options", projectController.getFilterOptions); // Public - get all filter options

// (Favorites routes intentionally placed earlier to avoid collision with :id)

// 💬 Project Comments & Discussions (Public viewing, authenticated posting)
projectRouter.get("/:projectId/comments", projectController.getProjectComments);
projectRouter.post(
  "/comments",
  authenticate,
  projectController.addProjectComment
);
projectRouter.put(
  "/comments/:commentId",
  authenticate,
  projectController.updateProjectComment
);
projectRouter.delete(
  "/comments/:commentId",
  authenticate,
  projectController.deleteProjectComment
);

// 👤 Project Owner Profile Data
projectRouter.get(
  "/owner/stats",
  authenticate,
  // requireProjectOwner, // Temporarily disabled for testing
  projectController.getProjectOwnerStats
);

// Get active projects for project owner dashboard
projectRouter.get(
  "/owner/active-projects",
  authenticate,
  requireProjectOwner,
  projectController.getActiveProjectsForOwner
);

// Get project categories with count and revenue for project owner
projectRouter.get(
  "/owner/categories",
  authenticate,
  requireProjectOwner,
  projectController.getProjectCategoriesForOwner
);
projectRouter.get(
  "/owner/projects",
  authenticate,
  // requireProjectOwner, // Temporarily disabled for testing
  projectController.getProjectOwnerProjects
);
projectRouter.get(
  "/owner/reviews",
  authenticate,
  // requireProjectOwner, // Temporarily disabled for testing
  projectController.getProjectOwnerReviews
);
projectRouter.get(
  "/owner/developers",
  authenticate,
  // requireProjectOwner, // Temporarily disabled for testing
  projectController.getProjectOwnerDevelopers
);

// Project Owner Dashboard / Gamification
projectRouter.get(
  "/owner/pending-evaluations",
  authenticate,
  projectController.getPendingEvaluations
);

projectRouter.get(
  "/owner/evaluation-history",
  authenticate,
  projectController.getEvaluationHistory
);

// Admin Analytics
projectRouter.get(
  "/admin/stats",
  authenticate,
  requireAdmin,
  projectController.getAdminProjectStats
);

// Admin Gamification
projectRouter.get(
  "/admin/gamification/stats",
  authenticate,
  requireAdmin,
  projectController.getAdminGamificationStats
);
projectRouter.get(
  "/admin/gamification/flagged-reviews",
  authenticate,
  requireAdmin,
  projectController.getFlaggedReviews
);
projectRouter.put(
  "/admin/gamification/reviews/:reviewId/moderate",
  authenticate,
  requireAdmin,
  projectController.moderateReview
);
projectRouter.get(
  "/admin/gamification/pending-verifications",
  authenticate,
  requireAdmin,
  projectController.getPendingVerifications
);
projectRouter.put(
  "/admin/gamification/verifications/:itemId/verify",
  authenticate,
  requireAdmin,
  projectController.verifyItem
);
projectRouter.get(
  "/admin/gamification/leaderboard/project-owners",
  authenticate,
  requireAdmin,
  projectController.getProjectOwnerLeaderboard
);

// Generic project by ID route - MUST be last to avoid conflicts with specific routes
projectRouter.get("/:id", projectController.getProject); // Public - anyone can view project details

module.exports = projectRouter;
