const express = require("express");
const projectController = require("../controllers/projects.controller");
const authenticate = require("shared/middleware/auth.middleware");

const projectRouter = express.Router();

// 📋 Project CRUD Operations
projectRouter.post("/", authenticate, projectController.createProject);
projectRouter.get("/", projectController.listProjects);
projectRouter.get("/:id", projectController.getProject);
projectRouter.put("/:id", authenticate, projectController.updateProject);
projectRouter.delete("/:id", authenticate, projectController.deleteProject);

// 🎯 Application Management
projectRouter.post("/apply", authenticate, projectController.applyToProject);
projectRouter.put("/applicants/status", authenticate, projectController.updateApplicantStatus);
projectRouter.get("/:projectId/applicants", authenticate, projectController.listApplicants);

// 📧 Invitation Management
projectRouter.post("/invite", authenticate, projectController.createInvite);
projectRouter.put("/invite/respond", authenticate, projectController.respondInvite);

// 📁 File Management
projectRouter.post("/files", authenticate, projectController.addFile);
projectRouter.get("/:projectId/files", projectController.getProjectFiles);

// 📝 Project Updates
projectRouter.post("/updates", authenticate, projectController.addUpdate);

// ⭐ Reviews
projectRouter.post("/reviews", authenticate, projectController.addReview);

// 🚀 Project Boosting
projectRouter.post("/boost", authenticate, projectController.addBoost);

module.exports = projectRouter;
