const express = require("express");
const tasksController = require("../controllers/tasks.controller");
const authenticate = require("shared/middleware/auth.middleware");
const {
  requireProjectOwner,
  requireDeveloper,
  requireProjectManager,
  requireAdmin,
} = require("shared/middleware/roleAuth.middleware");

const tasksRouter = express.Router();

// ==================== TASK CRUD OPERATIONS ====================

// Create Task (Project Owner only)
tasksRouter.post(
  "/",
  authenticate,
  requireProjectOwner,
  tasksController.createTask
);

// Get Tasks for Project Owner (all tasks in their projects)
tasksRouter.get(
  "/owner",
  authenticate,
  requireProjectOwner,
  tasksController.getProjectOwnerTasks
);

// Get Task by ID (with submissions, comments, time tracking)
tasksRouter.get(
  "/:taskId",
  authenticate,
  tasksController.getTaskById
);

// Update Task (Project Owner only)
tasksRouter.put(
  "/:taskId",
  authenticate,
  requireProjectManager,
  tasksController.updateTask
);

// Delete Task (Project Owner only)
tasksRouter.delete(
  "/:taskId",
  authenticate,
  requireProjectManager,
  tasksController.deleteTask
);

// Start Task (Developer - changes status to in_progress)
tasksRouter.post(
  "/:taskId/start",
  authenticate,
  requireDeveloper,
  tasksController.startTask
);

// ==================== BULK OPERATIONS ====================

// Bulk Update Tasks (Project Owner only)
tasksRouter.put(
  "/bulk/update",
  authenticate,
  requireProjectOwner,
  tasksController.bulkUpdateTasks
);

// Bulk Delete Tasks (Project Owner only)
tasksRouter.delete(
  "/bulk/delete",
  authenticate,
  requireProjectOwner,
  tasksController.bulkDeleteTasks
);

// Bulk Assign Tasks (Project Owner only)
tasksRouter.post(
  "/bulk/assign",
  authenticate,
  requireProjectOwner,
  tasksController.bulkAssignTasks
);

// ==================== TASK SUBMISSIONS ====================

// Submit Work (Developer)
tasksRouter.post(
  "/:taskId/submit",
  authenticate,
  requireDeveloper,
  tasksController.submitTask
);

// Review Submission (Project Owner)
tasksRouter.put(
  "/submissions/:submissionId/review",
  authenticate,
  requireProjectOwner,
  tasksController.reviewSubmission
);

// Get Submissions for Task
tasksRouter.get(
  "/:taskId/submissions",
  authenticate,
  tasksController.getTaskSubmissions
);

// ==================== TASK COMMENTS ====================

// Add Comment (Any authenticated user)
tasksRouter.post(
  "/:taskId/comments",
  authenticate,
  tasksController.addComment
);

// Get Comments for Task
tasksRouter.get(
  "/:taskId/comments",
  authenticate,
  tasksController.getTaskComments
);

// Update Comment (Owner only)
tasksRouter.put(
  "/comments/:commentId",
  authenticate,
  tasksController.updateComment
);

// Delete Comment (Owner only)
tasksRouter.delete(
  "/comments/:commentId",
  authenticate,
  tasksController.deleteComment
);

// ==================== TIME TRACKING ====================

// Start Timer (Developer)
tasksRouter.post(
  "/:taskId/timer/start",
  authenticate,
  requireDeveloper,
  tasksController.startTimer
);

// Stop Timer (Developer)
tasksRouter.post(
  "/timer/:trackingId/stop",
  authenticate,
  requireDeveloper,
  tasksController.stopTimer
);

// Stop Active Timer (Developer)
tasksRouter.post(
  "/timer/stop-active",
  authenticate,
  requireDeveloper,
  tasksController.stopActiveTimer
);

// Get Time Tracking for Task
tasksRouter.get(
  "/:taskId/time-tracking",
  authenticate,
  tasksController.getTaskTimeTracking
);

// Get User Time Tracking (Developer)
tasksRouter.get(
  "/time-tracking/my",
  authenticate,
  requireDeveloper,
  tasksController.getUserTimeTracking
);

// ==================== ANALYTICS ====================

// Get Collaboration Stats (Project Owner)
tasksRouter.get(
  "/analytics/collaboration",
  authenticate,
  requireProjectOwner,
  tasksController.getCollaborationStats
);

// Get Developer Performance Stats (Developer)
tasksRouter.get(
  "/analytics/performance",
  authenticate,
  requireDeveloper,
  tasksController.getDeveloperPerformanceStats
);

module.exports = tasksRouter;

