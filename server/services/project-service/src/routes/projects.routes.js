const express = require("express");
const projectController = require("../controllers/projects.controller");
const authenticate = require("shared/middleware/auth.middleware");
const { requireProjectOwner, requireDeveloper, requireProjectManager } = require("shared/middleware/roleAuth.middleware");

const projectRouter = express.Router();

// 📋 Project CRUD Operations (Only project owners can create/manage projects)
projectRouter.post("/", authenticate, requireProjectOwner, projectController.createProject);
projectRouter.get("/", projectController.listProjects); // Public - anyone can view projects
projectRouter.get("/:id", projectController.getProject); // Public - anyone can view project details
projectRouter.put("/:id", authenticate, requireProjectManager, projectController.updateProject);
projectRouter.delete("/:id", authenticate, requireProjectManager, projectController.deleteProject);

// 🎯 Application Management (Developers apply, project owners manage applications)
projectRouter.post("/apply", authenticate, requireDeveloper, projectController.applyToProject);
projectRouter.put("/applicants/status", authenticate, requireProjectManager, projectController.updateApplicantStatus);
projectRouter.get("/:projectId/applicants", authenticate, requireProjectManager, projectController.listApplicants);

// 📧 Invitation Management (Only project owners can send invites, developers can respond)
projectRouter.post("/invite", authenticate, requireProjectManager, projectController.createInvite);
projectRouter.get("/invites/my", authenticate, projectController.getMyInvites); // Developers can view their invites
projectRouter.put("/invite/respond", authenticate, projectController.respondInvite); // Any authenticated user can respond to their own invites

// 📁 File Management (Project owners can add files, anyone can view)
projectRouter.post("/files", authenticate, requireProjectManager, projectController.addFile);
projectRouter.get("/:projectId/files", projectController.getProjectFiles); // Public - for portfolio viewing

// 📝 Project Updates (Only project owners can add updates)
projectRouter.post("/updates", authenticate, requireProjectManager, projectController.addUpdate);

// ⭐ Reviews (Any authenticated user can review completed projects)
projectRouter.post("/reviews", authenticate, projectController.addReview);

// 🚀 Project Boosting (Only project owners can boost their projects)
projectRouter.post("/boost", authenticate, requireProjectManager, projectController.addBoost);

module.exports = projectRouter;
