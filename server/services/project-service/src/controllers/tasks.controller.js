const { ProjectTasksModel } = require("../models/project-tasks.model");
const { TaskSubmissionsModel } = require("../models/task-submissions.model");
const { TaskCommentsModel } = require("../models/task-comments.model");
const { TaskTimeTrackingModel } = require("../models/task-time-tracking.model");
const { ProjectModel } = require("../models");
const { db } = require("../config/database");
const { sql } = require("drizzle-orm");
const { sendMail } = require("shared/utils/sendEmail");

// Basic error helper
const sendError = (res, message, status = 400) =>
  res.status(status).json({ success: false, status, message });

// Helper to get user info
const getUserInfo = async (userId) => {
  try {
    const userQuery = await db.execute(sql`
      SELECT id, name, email, role 
      FROM users 
      WHERE id = ${userId} AND is_deleted = false
    `);
    
    if (userQuery.rows && userQuery.rows.length > 0) {
      return userQuery.rows[0];
    }
    return null;
  } catch (error) {
    console.error("Error fetching user info:", error.message);
    return null;
  }
};

// ==================== TASK CRUD OPERATIONS ====================

// Create Task (Project Owner only)
const createTask = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    if (!userId) return sendError(res, "Authentication required", 401);
    
    const { projectId, milestoneId, assignedTo, title, description, priority, dueDate, estimatedHours, repositoryUrl } = req.body;
    
    if (!projectId || !title) {
      return sendError(res, "projectId and title are required", 400);
    }
    
    // Verify user owns the project
    const project = await ProjectModel.getProjectById(Number(projectId));
    if (!project) return sendError(res, "Project not found", 404);
    
    if (project.ownerId !== userId && req.user?.role !== "admin") {
      return sendError(res, "You can only create tasks for your own projects", 403);
    }
    
    const task = await ProjectTasksModel.addTask({
      projectId: Number(projectId),
      milestoneId: milestoneId ? Number(milestoneId) : null,
      assignedTo: assignedTo ? Number(assignedTo) : null,
      title,
      description,
      priority: priority || "medium",
      dueDate: dueDate ? new Date(dueDate) : null,
      estimatedHours,
      repositoryUrl,
    });
    
    // Format the task to match getProjectOwnerTasks response format
    // Get project information
    const projectInfo = project || await ProjectModel.getProjectById(Number(projectId));
    
    // Get assigned user info if assigned
    const assignedUser = task.assignedTo ? await getUserInfo(task.assignedTo) : null;
    
    // Get submissions (will be empty for new task)
    const submissions = await TaskSubmissionsModel.getSubmissionsByTaskId(task.id);
    const pendingSubmissions = submissions.filter(s => s.status === "pending");
    
    // Map submissions with user info
    const submissionsWithUserInfo = await Promise.all(
      pendingSubmissions.map(async (sub) => {
        const submittedByUser = await getUserInfo(sub.submittedBy);
        return {
          ...sub,
          submittedBy: submittedByUser ? {
            id: submittedByUser.id,
            name: submittedByUser.name,
          } : { id: sub.submittedBy },
        };
      })
    );
    
    // Map status to frontend format
    const mappedStatus = task.status === "todo" ? "open" : 
                        task.status === "in_progress" ? "in-progress" : 
                        task.status === "review" ? "under-review" : 
                        task.status === "completed" ? "completed" :
                        task.status === "cancelled" ? "on-hold" :
                        task.status || "open";
    
    // Format task with all necessary fields to match frontend expectations
    const formattedTask = {
      ...task,
      projectName: projectInfo?.title || "Unknown Project",
      projectTitle: projectInfo?.title || "Unknown Project",
      status: mappedStatus,
      assignedTo: assignedUser ? {
        id: assignedUser.id,
        name: assignedUser.name,
      } : null,
      submissions: submissionsWithUserInfo,
      submissionsCount: submissions.length,
      pendingReviewSubmissions: pendingSubmissions.length,
    };
    
    return res.status(201).json({
      success: true,
      status: 201,
      message: "Task created successfully",
      data: formattedTask,
    });
  } catch (error) {
    console.error("Create Task Error:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Failed to create task",
      error: error.message,
    });
  }
};

// Get Task by ID
const getTaskById = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await ProjectTasksModel.getTaskById(Number(taskId));
    
    if (!task) {
      return sendError(res, "Task not found", 404);
    }
    
    // Get submissions, comments, and time tracking
    const [submissions, comments, timeTracking] = await Promise.all([
      TaskSubmissionsModel.getSubmissionsByTaskId(Number(taskId)),
      TaskCommentsModel.getCommentsByTaskId(Number(taskId)),
      TaskTimeTrackingModel.getTimeTrackingByTaskId(Number(taskId)),
    ]);
    
    // Get user info for assigned user and submission authors
    const assignedUser = task.assignedTo ? await getUserInfo(task.assignedTo) : null;
    
    const submissionsWithUserInfo = await Promise.all(
      submissions.map(async (sub) => {
        const submittedByUser = await getUserInfo(sub.submittedBy);
        const reviewedByUser = sub.reviewedBy ? await getUserInfo(sub.reviewedBy) : null;
        return {
          ...sub,
          submittedBy: submittedByUser ? {
            id: submittedByUser.id,
            name: submittedByUser.name,
            email: submittedByUser.email,
          } : { id: sub.submittedBy },
          reviewedBy: reviewedByUser ? {
            id: reviewedByUser.id,
            name: reviewedByUser.name,
          } : null,
        };
      })
    );
    
    const commentsWithUserInfo = await Promise.all(
      comments.map(async (comment) => {
        const user = await getUserInfo(comment.userId);
        return {
          ...comment,
          user: user ? {
            id: user.id,
            name: user.name,
            email: user.email,
          } : { id: comment.userId },
        };
      })
    );
    
    return res.status(200).json({
      success: true,
      status: 200,
      data: {
        ...task,
        assignedTo: assignedUser ? {
          id: assignedUser.id,
          name: assignedUser.name,
        } : null,
        submissions: submissionsWithUserInfo,
        comments: commentsWithUserInfo,
        timeTracking,
        projectName: (await ProjectModel.getProjectById(task.projectId))?.title || "Unknown Project",
      },
    });
  } catch (error) {
    console.error("Get Task Error:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Failed to fetch task",
      error: error.message,
    });
  }
};

// Get Tasks for Project Owner (all tasks in their projects)
const getProjectOwnerTasks = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    if (!userId) return sendError(res, "Authentication required", 401);
    
    const { projectId, status, priority, limit, sortBy, sortOrder, search } = req.query;
    
    const tasks = await ProjectTasksModel.getTasksByProjectOwner(Number(userId), {
      projectId: projectId ? Number(projectId) : null,
      status: status || null,
      priority: priority || null,
      limit: limit ? Number(limit) : null,
      sortBy: sortBy || "createdAt",
      sortOrder: sortOrder || "desc",
    });
    
    // Filter by search if provided
    let filteredTasks = tasks;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredTasks = tasks.filter(task =>
        task.title?.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower) ||
        task.projectTitle?.toLowerCase().includes(searchLower)
      );
    }
    
    // Get submissions count and user info for each task
    const tasksWithSubmissions = await Promise.all(
      filteredTasks.map(async (task) => {
        const submissions = await TaskSubmissionsModel.getSubmissionsByTaskId(task.id);
        const pendingSubmissions = submissions.filter(s => s.status === "pending");
        
        // Get assigned user info
        const assignedUser = task.assignedTo ? await getUserInfo(task.assignedTo) : null;
        
        // Map submissions with user info
        const submissionsWithUserInfo = await Promise.all(
          pendingSubmissions.map(async (sub) => {
            const submittedByUser = await getUserInfo(sub.submittedBy);
            return {
              ...sub,
              submittedBy: submittedByUser ? {
                id: submittedByUser.id,
                name: submittedByUser.name,
              } : { id: sub.submittedBy },
            };
          })
        );
        
        return {
          ...task,
          assignedTo: assignedUser ? {
            id: assignedUser.id,
            name: assignedUser.name,
          } : null,
          submissions: submissionsWithUserInfo,
          submissionsCount: submissions.length,
          pendingReviewSubmissions: pendingSubmissions.length,
        };
      })
    );
    
    // Map status to frontend format
    const mappedTasks = tasksWithSubmissions.map(task => ({
      ...task,
      status: task.status === "todo" ? "open" : 
              task.status === "in_progress" ? "in-progress" : 
              task.status === "review" ? "under-review" : 
              task.status === "completed" ? "completed" :
              task.status === "cancelled" ? "on-hold" :
              task.status || "open",
    }));
    
    return res.status(200).json({
      success: true,
      status: 200,
      message: "Tasks retrieved successfully",
      tasks: mappedTasks,
      count: mappedTasks.length,
    });
  } catch (error) {
    console.error("Get Project Owner Tasks Error:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Failed to fetch tasks",
      error: error.message,
    });
  }
};

// Update Task
const updateTask = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    if (!userId) return sendError(res, "Authentication required", 401);
    
    const { taskId } = req.params;
    const updateData = req.body;
    
    // Verify task exists and user has permission
    const task = await ProjectTasksModel.getTaskById(Number(taskId));
    if (!task) return sendError(res, "Task not found", 404);
    
    const project = await ProjectModel.getProjectById(task.projectId);
    if (!project) return sendError(res, "Project not found", 404);
    
    if (project.ownerId !== userId && req.user?.role !== "admin") {
      return sendError(res, "You can only update tasks in your own projects", 403);
    }
    
    // Prepare update data
    const allowedFields = ["title", "description", "priority", "dueDate", "assignedTo", "status", "milestoneId"];
    const cleanUpdateData = {};
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        cleanUpdateData[field] = updateData[field];
      }
    });
    
    // Handle status change
    if (cleanUpdateData.status === "completed" && !task.completedAt) {
      cleanUpdateData.completedAt = new Date();
    } else if (cleanUpdateData.status !== "completed" && task.completedAt) {
      cleanUpdateData.completedAt = null;
    }
    
    const updatedTask = await ProjectTasksModel.updateTask(Number(taskId), cleanUpdateData);
    
    return res.status(200).json({
      success: true,
      status: 200,
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    console.error("Update Task Error:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Failed to update task",
      error: error.message,
    });
  }
};

// Delete Task
const deleteTask = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    if (!userId) return sendError(res, "Authentication required", 401);
    
    const { taskId } = req.params;
    
    // Verify task exists and user has permission
    const task = await ProjectTasksModel.getTaskById(Number(taskId));
    if (!task) return sendError(res, "Task not found", 404);
    
    const project = await ProjectModel.getProjectById(task.projectId);
    if (!project) return sendError(res, "Project not found", 404);
    
    if (project.ownerId !== userId && req.user?.role !== "admin") {
      return sendError(res, "You can only delete tasks in your own projects", 403);
    }
    
    await ProjectTasksModel.deleteTask(Number(taskId));
    
    return res.status(200).json({
      success: true,
      status: 200,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete Task Error:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Failed to delete task",
      error: error.message,
    });
  }
};

// Start Task (Developer)
const startTask = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    if (!userId) return sendError(res, "Authentication required", 401);
    
    const { taskId } = req.params;
    
    const task = await ProjectTasksModel.getTaskById(Number(taskId));
    if (!task) return sendError(res, "Task not found", 404);
    
    if (task.assignedTo !== userId) {
      return sendError(res, "You can only start tasks assigned to you", 403);
    }
    
    const updatedTask = await ProjectTasksModel.updateTaskStatus(Number(taskId), "in_progress");
    
    return res.status(200).json({
      success: true,
      status: 200,
      message: "Task started successfully",
      data: updatedTask,
    });
  } catch (error) {
    console.error("Start Task Error:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Failed to start task",
      error: error.message,
    });
  }
};

// ==================== BULK OPERATIONS ====================

// Bulk Update Tasks
const bulkUpdateTasks = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    if (!userId) return sendError(res, "Authentication required", 401);
    
    const { taskIds, updateData } = req.body;
    
    if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
      return sendError(res, "taskIds array is required", 400);
    }
    
    // Verify user owns all projects for these tasks
    for (const taskId of taskIds) {
      const task = await ProjectTasksModel.getTaskById(Number(taskId));
      if (task) {
        const project = await ProjectModel.getProjectById(task.projectId);
        if (project && project.ownerId !== userId && req.user?.role !== "admin") {
          return sendError(res, `You don't have permission to update task ${taskId}`, 403);
        }
      }
    }
    
    const updatedTasks = await ProjectTasksModel.bulkUpdateTasks(taskIds, updateData);
    
    return res.status(200).json({
      success: true,
      status: 200,
      message: "Tasks updated successfully",
      data: updatedTasks,
      count: updatedTasks.length,
    });
  } catch (error) {
    console.error("Bulk Update Tasks Error:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Failed to update tasks",
      error: error.message,
    });
  }
};

// Bulk Delete Tasks
const bulkDeleteTasks = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    if (!userId) return sendError(res, "Authentication required", 401);
    
    const { taskIds } = req.body;
    
    if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
      return sendError(res, "taskIds array is required", 400);
    }
    
    // Convert all taskIds to numbers and filter out any invalid values
    const validTaskIds = taskIds
      .map(id => Number(id))
      .filter(id => !isNaN(id) && id > 0);
    
    if (validTaskIds.length === 0) {
      return sendError(res, "Invalid taskIds provided", 400);
    }
    
    // Verify user owns all projects for these tasks
    for (const taskId of validTaskIds) {
      const task = await ProjectTasksModel.getTaskById(taskId);
      if (task) {
        const project = await ProjectModel.getProjectById(task.projectId);
        if (project && project.ownerId !== userId && req.user?.role !== "admin") {
          return sendError(res, `You don't have permission to delete task ${taskId}`, 403);
        }
      }
    }
    
    const deletedTasks = await ProjectTasksModel.bulkDeleteTasks(validTaskIds);
    
    return res.status(200).json({
      success: true,
      status: 200,
      message: "Tasks deleted successfully",
      data: deletedTasks,
      count: deletedTasks.length,
    });
  } catch (error) {
    console.error("Bulk Delete Tasks Error:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Failed to delete tasks",
      error: error.message,
    });
  }
};

// Bulk Assign Tasks
const bulkAssignTasks = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    if (!userId) return sendError(res, "Authentication required", 401);
    
    const { taskIds, assignedTo } = req.body;
    
    if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
      return sendError(res, "taskIds array is required", 400);
    }
    
    if (!assignedTo) {
      return sendError(res, "assignedTo is required", 400);
    }
    
    // Verify user owns all projects for these tasks
    for (const taskId of taskIds) {
      const task = await ProjectTasksModel.getTaskById(Number(taskId));
      if (task) {
        const project = await ProjectModel.getProjectById(task.projectId);
        if (project && project.ownerId !== userId && req.user?.role !== "admin") {
          return sendError(res, `You don't have permission to assign task ${taskId}`, 403);
        }
      }
    }
    
    const assignedTasks = await ProjectTasksModel.bulkAssignTasks(taskIds, Number(assignedTo));
    
    return res.status(200).json({
      success: true,
      status: 200,
      message: "Tasks assigned successfully",
      data: assignedTasks,
      count: assignedTasks.length,
    });
  } catch (error) {
    console.error("Bulk Assign Tasks Error:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Failed to assign tasks",
      error: error.message,
    });
  }
};

// ==================== TASK SUBMISSIONS ====================

// Submit Work (Developer)
const submitTask = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    if (!userId) return sendError(res, "Authentication required", 401);
    
    const { taskId } = req.params;
    const { type, link, files, notes } = req.body;
    
    if (!type) {
      return sendError(res, "Submission type is required", 400);
    }
    
    const task = await ProjectTasksModel.getTaskById(Number(taskId));
    if (!task) return sendError(res, "Task not found", 404);
    
    if (task.assignedTo !== userId) {
      return sendError(res, "You can only submit work for tasks assigned to you", 403);
    }
    
    const submission = await TaskSubmissionsModel.createSubmission({
      taskId: Number(taskId),
      submittedBy: Number(userId),
      type,
      link,
      files: files || [],
      notes,
    });
    
    return res.status(201).json({
      success: true,
      status: 201,
      message: "Work submitted successfully",
      data: submission,
    });
  } catch (error) {
    console.error("Submit Task Error:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Failed to submit work",
      error: error.message,
    });
  }
};

// Review Submission (Project Owner)
const reviewSubmission = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    if (!userId) return sendError(res, "Authentication required", 401);
    
    const { submissionId } = req.params;
    const { status, reviewComments } = req.body;
    
    if (!status || !["approved", "rejected", "changes-requested"].includes(status)) {
      return sendError(res, "Valid status is required (approved, rejected, changes-requested)", 400);
    }
    
    const submission = await TaskSubmissionsModel.getSubmissionById(Number(submissionId));
    if (!submission) return sendError(res, "Submission not found", 404);
    
    // Verify user owns the project
    const task = await ProjectTasksModel.getTaskById(submission.taskId);
    if (!task) return sendError(res, "Task not found", 404);
    
    const project = await ProjectModel.getProjectById(task.projectId);
    if (!project) return sendError(res, "Project not found", 404);
    
    if (project.ownerId !== userId && req.user?.role !== "admin") {
      return sendError(res, "You can only review submissions for your own projects", 403);
    }
    
    const reviewedSubmission = await TaskSubmissionsModel.updateSubmissionStatus(
      Number(submissionId),
      status,
      Number(userId),
      reviewComments
    );
    
    return res.status(200).json({
      success: true,
      status: 200,
      message: "Submission reviewed successfully",
      data: reviewedSubmission,
    });
  } catch (error) {
    console.error("Review Submission Error:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Failed to review submission",
      error: error.message,
    });
  }
};

// Get Submissions for Task
const getTaskSubmissions = async (req, res) => {
  try {
    const { taskId } = req.params;
    const submissions = await TaskSubmissionsModel.getSubmissionsByTaskId(Number(taskId));
    
    return res.status(200).json({
      success: true,
      status: 200,
      data: submissions,
      count: submissions.length,
    });
  } catch (error) {
    console.error("Get Task Submissions Error:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Failed to fetch submissions",
      error: error.message,
    });
  }
};

// ==================== TASK COMMENTS ====================

// Add Comment
const addComment = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    if (!userId) return sendError(res, "Authentication required", 401);
    
    const { taskId } = req.params;
    const { comment, parentCommentId } = req.body;
    
    if (!comment) {
      return sendError(res, "Comment is required", 400);
    }
    
    const task = await ProjectTasksModel.getTaskById(Number(taskId));
    if (!task) return sendError(res, "Task not found", 404);
    
    const newComment = await TaskCommentsModel.createComment({
      taskId: Number(taskId),
      userId: Number(userId),
      comment,
      parentCommentId: parentCommentId ? Number(parentCommentId) : null,
    });
    
    return res.status(201).json({
      success: true,
      status: 201,
      message: "Comment added successfully",
      data: newComment,
    });
  } catch (error) {
    console.error("Add Comment Error:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Failed to add comment",
      error: error.message,
    });
  }
};

// Get Comments
const getTaskComments = async (req, res) => {
  try {
    const { taskId } = req.params;
    const comments = await TaskCommentsModel.getCommentsByTaskId(Number(taskId));
    
    return res.status(200).json({
      success: true,
      status: 200,
      data: comments,
      count: comments.length,
    });
  } catch (error) {
    console.error("Get Task Comments Error:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Failed to fetch comments",
      error: error.message,
    });
  }
};

// Update Comment
const updateComment = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    if (!userId) return sendError(res, "Authentication required", 401);
    
    const { commentId } = req.params;
    const { comment } = req.body;
    
    if (!comment) {
      return sendError(res, "Comment is required", 400);
    }
    
    const updatedComment = await TaskCommentsModel.updateComment(Number(commentId), Number(userId), comment);
    
    return res.status(200).json({
      success: true,
      status: 200,
      message: "Comment updated successfully",
      data: updatedComment,
    });
  } catch (error) {
    console.error("Update Comment Error:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: error.message || "Failed to update comment",
      error: error.message,
    });
  }
};

// Delete Comment
const deleteComment = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    if (!userId) return sendError(res, "Authentication required", 401);
    
    const { commentId } = req.params;
    
    await TaskCommentsModel.deleteComment(Number(commentId), Number(userId));
    
    return res.status(200).json({
      success: true,
      status: 200,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Delete Comment Error:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: error.message || "Failed to delete comment",
      error: error.message,
    });
  }
};

// ==================== TIME TRACKING ====================

// Start Timer
const startTimer = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    if (!userId) return sendError(res, "Authentication required", 401);
    
    const { taskId } = req.params;
    const { description } = req.body;
    
    const task = await ProjectTasksModel.getTaskById(Number(taskId));
    if (!task) return sendError(res, "Task not found", 404);
    
    if (task.assignedTo !== userId) {
      return sendError(res, "You can only track time for tasks assigned to you", 403);
    }
    
    const tracking = await TaskTimeTrackingModel.startTimer({
      taskId: Number(taskId),
      userId: Number(userId),
      description,
    });
    
    return res.status(201).json({
      success: true,
      status: 201,
      message: "Timer started successfully",
      data: tracking,
    });
  } catch (error) {
    console.error("Start Timer Error:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Failed to start timer",
      error: error.message,
    });
  }
};

// Stop Timer
const stopTimer = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    if (!userId) return sendError(res, "Authentication required", 401);
    
    const { trackingId } = req.params;
    
    const tracking = await TaskTimeTrackingModel.stopTimer(Number(trackingId), Number(userId));
    
    return res.status(200).json({
      success: true,
      status: 200,
      message: "Timer stopped successfully",
      data: tracking,
    });
  } catch (error) {
    console.error("Stop Timer Error:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: error.message || "Failed to stop timer",
      error: error.message,
    });
  }
};

// Stop Active Timer
const stopActiveTimer = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    if (!userId) return sendError(res, "Authentication required", 401);
    
    const tracking = await TaskTimeTrackingModel.stopActiveTimer(Number(userId));
    
    if (!tracking) {
      return res.status(200).json({
        success: true,
        status: 200,
        message: "No active timer found",
        data: null,
      });
    }
    
    return res.status(200).json({
      success: true,
      status: 200,
      message: "Active timer stopped successfully",
      data: tracking,
    });
  } catch (error) {
    console.error("Stop Active Timer Error:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Failed to stop active timer",
      error: error.message,
    });
  }
};

// Get Time Tracking for Task
const getTaskTimeTracking = async (req, res) => {
  try {
    const { taskId } = req.params;
    const timeTracking = await TaskTimeTrackingModel.getTimeTrackingByTaskId(Number(taskId));
    
    // Calculate total time
    const totalTime = timeTracking.reduce((sum, track) => sum + (track.duration || 0), 0);
    
    return res.status(200).json({
      success: true,
      status: 200,
      data: timeTracking,
      totalTime,
      count: timeTracking.length,
    });
  } catch (error) {
    console.error("Get Task Time Tracking Error:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Failed to fetch time tracking",
      error: error.message,
    });
  }
};

// Get User Time Tracking
const getUserTimeTracking = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    if (!userId) return sendError(res, "Authentication required", 401);
    
    const { taskId, limit, startDate, endDate } = req.query;
    
    // Validate taskId - only use if it's a valid number
    let validatedTaskId = null;
    if (taskId) {
      const numTaskId = Number(taskId);
      if (!isNaN(numTaskId) && numTaskId > 0) {
        validatedTaskId = numTaskId;
      }
    }
    
    const timeTracking = await TaskTimeTrackingModel.getTimeTrackingByUser(Number(userId), {
      taskId: validatedTaskId,
      limit: limit ? Number(limit) : null,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
    });
    
    // Get active timer
    const activeTimer = await TaskTimeTrackingModel.getActiveTracking(Number(userId));
    
    // Calculate total time
    const totalTime = await TaskTimeTrackingModel.getTotalTimeForUser(Number(userId), {
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
    });
    
    return res.status(200).json({
      success: true,
      status: 200,
      data: timeTracking,
      activeTimer,
      totalTime,
      count: timeTracking.length,
    });
  } catch (error) {
    console.error("Get User Time Tracking Error:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Failed to fetch time tracking",
      error: error.message,
    });
  }
};

// ==================== COLLABORATION ANALYTICS ====================

// Get Collaboration Stats (Project Owner)
const getCollaborationStats = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    if (!userId) return sendError(res, "Authentication required", 401);
    
    const { projectId } = req.query;
    
    // Get all tasks for the project owner
    const tasks = await ProjectTasksModel.getTasksByProjectOwner(Number(userId), {
      projectId: projectId ? Number(projectId) : null,
    });
    
    // Calculate stats
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === "completed").length;
    const inProgressTasks = tasks.filter(t => t.status === "in_progress").length;
    const underReviewTasks = tasks.filter(t => t.status === "review").length;
    
    // Get pending submissions
    let pendingReviewSubmissions = 0;
    const activeTeamMembers = new Set();
    
    for (const task of tasks) {
      const submissions = await TaskSubmissionsModel.getSubmissionsByTaskId(task.id);
      const pendingSubs = submissions.filter(s => s.status === "pending");
      pendingReviewSubmissions += pendingSubs.length;
      
      if (task.assignedTo) {
        activeTeamMembers.add(task.assignedTo);
      }
    }
    
    // Calculate overdue tasks
    const now = new Date();
    const overdueTasks = tasks.filter(t => {
      if (!t.dueDate || t.status === "completed") return false;
      return new Date(t.dueDate) < now;
    }).length;
    
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    return res.status(200).json({
      success: true,
      status: 200,
      data: {
        totalTasks,
        completedTasks,
        inProgressTasks,
        underReviewTasks,
        pendingReviewSubmissions,
        activeTeamMembers: activeTeamMembers.size,
        overdueTasks,
        completionRate,
      },
    });
  } catch (error) {
    console.error("Get Collaboration Stats Error:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Failed to fetch collaboration stats",
      error: error.message,
    });
  }
};

// Get Developer Performance Stats
const getDeveloperPerformanceStats = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    if (!userId) return sendError(res, "Authentication required", 401);
    
    // Get all tasks assigned to developer
    const tasks = await ProjectTasksModel.getAllTasksByAssignee(Number(userId));
    
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === "completed").length;
    const inProgressTasks = tasks.filter(t => t.status === "in_progress").length;
    
    // Calculate on-time completion
    const onTimeCompletion = tasks.filter(t => {
      if (t.status !== "completed" || !t.dueDate || !t.completedAt) return false;
      const completedDate = new Date(t.completedAt);
      const dueDate = new Date(t.dueDate);
      return completedDate <= dueDate;
    }).length;
    
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const onTimeRate = completedTasks > 0 ? Math.round((onTimeCompletion / completedTasks) * 100) : 0;
    
    // Get total time tracked
    const totalTimeTracked = await TaskTimeTrackingModel.getTotalTimeForUser(Number(userId));
    const avgTaskTime = completedTasks > 0 ? totalTimeTracked / completedTasks : 0;
    
    // Calculate productivity score
    const productivityScore = Math.min(100, Math.round(
      (completionRate * 0.4) + (onTimeRate * 0.4) + (Math.min(totalTasks / 10, 1) * 20)
    ));
    
    // Get active timer
    const activeTimer = await TaskTimeTrackingModel.getActiveTracking(Number(userId));
    
    return res.status(200).json({
      success: true,
      status: 200,
      data: {
        totalTasks,
        completedTasks,
        inProgressTasks,
        completionRate,
        onTimeRate,
        totalTimeTracked,
        avgTaskTime,
        productivityScore,
        activeTimer: activeTimer ? activeTimer.taskId : null,
      },
    });
  } catch (error) {
    console.error("Get Developer Performance Stats Error:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Failed to fetch performance stats",
      error: error.message,
    });
  }
};

module.exports = {
  // Task CRUD
  createTask,
  getTaskById,
  getProjectOwnerTasks,
  updateTask,
  deleteTask,
  startTask,
  
  // Bulk Operations
  bulkUpdateTasks,
  bulkDeleteTasks,
  bulkAssignTasks,
  
  // Submissions
  submitTask,
  reviewSubmission,
  getTaskSubmissions,
  
  // Comments
  addComment,
  getTaskComments,
  updateComment,
  deleteComment,
  
  // Time Tracking
  startTimer,
  stopTimer,
  stopActiveTimer,
  getTaskTimeTracking,
  getUserTimeTracking,
  
  // Analytics
  getCollaborationStats,
  getDeveloperPerformanceStats,
};

