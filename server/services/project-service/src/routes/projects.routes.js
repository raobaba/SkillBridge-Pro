const express = require("express");
const projectController = require("../controllers/projects.controller");
const authenticate = require("shared/middleware/auth.middleware");
const {
  requireProjectOwner,
  requireDeveloper,
  requireProjectManager,
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
  "/applications/my/count",
  authenticate,
  requireDeveloper,
  projectController.getMyApplicationsCount
);

// 📧 Invitation Management (Only project owners can send invites, developers can respond)
projectRouter.post(
  "/invite",
  authenticate,
  requireProjectManager,
  projectController.createInvite
);
projectRouter.get("/invites/my", authenticate, projectController.getMyInvites); // Developers can view their invites
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

// Generic project by ID route - MUST be last to avoid conflicts with specific routes
projectRouter.get("/:id", projectController.getProject); // Public - anyone can view project details

module.exports = projectRouter;
