const { ProjectModel } = require("../models");
const { uploadFileToSupabase } = require("shared/utils/uploadFile.utils");
const { supabase } = require("shared/utils/supabase.utils");

// Basic error helper to keep responses consistent
const sendError = (res, message, status = 400) =>
  res.status(status).json({ success: false, status, message });

// Create a new project
const createProject = async (req, res) => {
  try {
    const ownerId = req.user?.userId || req.body.ownerId; // from auth middleware or body (fallback)
    const {
      title,
      description,
      roleNeeded,
      status,
      priority,
      category,
      experienceLevel,
      budgetMin,
      budgetMax,
      currency,
      isRemote,
      location,
      duration,
      startDate,
      deadline,
      requirements,
      benefits,
      company,
      website,
      maxApplicants,
      language,
      timezone,
      skills = [],
      tags = [],
    } = req.body;

    if (!ownerId || !title || !description || !roleNeeded) {
      return sendError(
        res,
        "ownerId, title, description, and roleNeeded are required",
        400
      );
    }

    const project = await ProjectModel.createProject({
      ownerId,
      title,
      description,
      roleNeeded,
      status,
      priority,
      category,
      experienceLevel,
      budgetMin,
      budgetMax,
      currency,
      isRemote,
      location,
      duration,
      startDate: startDate ? new Date(startDate) : null,
      deadline: deadline ? new Date(deadline) : null,
      requirements,
      benefits,
      company,
      website,
      maxApplicants,
      language,
      timezone,
    });

    if (skills?.length) await ProjectModel.setSkills(project.id, skills);
    if (tags?.length) await ProjectModel.setTags(project.id, tags);

    return res.status(201).json({
      success: true,
      status: 201,
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    console.error("Create Project Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Creation failed", error: error.message });
  }
};

// Get a single project by ID
const getProject = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return sendError(res, "Project id is required", 400);
    const project = await ProjectModel.getProjectById(Number(id));
    if (!project) return sendError(res, "Project not found", 404);
    return res.status(200).json({ success: true, status: 200, project });
  } catch (error) {
    console.error("Get Project Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Failed to fetch project", error: error.message });
  }
};

// List projects (optionally filter by ownerId, status)
const listProjects = async (req, res) => {
  try {
    const { ownerId, status } = req.query;
    const rows = await ProjectModel.listProjects({ ownerId: ownerId ? Number(ownerId) : undefined, status });
    return res.status(200).json({ success: true, status: 200, projects: rows });
  } catch (error) {
    console.error("List Projects Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Failed to fetch projects", error: error.message });
  }
};

// Update project
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return sendError(res, "Project id is required", 400);
    const payload = { ...req.body };
    if (payload.startDate) payload.startDate = new Date(payload.startDate);
    if (payload.deadline) payload.deadline = new Date(payload.deadline);

    const project = await ProjectModel.updateProject(Number(id), payload);
    if (!project) return sendError(res, "Project not found or update failed", 404);

    if (Array.isArray(payload.skills)) await ProjectModel.setSkills(project.id, payload.skills);
    if (Array.isArray(payload.tags)) await ProjectModel.setTags(project.id, payload.tags);

    return res.status(200).json({ success: true, status: 200, message: "Project updated", project });
  } catch (error) {
    console.error("Update Project Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Update failed", error: error.message });
  }
};

// Soft delete
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return sendError(res, "Project id is required", 400);
    await ProjectModel.softDeleteProject(Number(id));
    return res.status(200).json({ success: true, status: 200, message: "Project deleted" });
  } catch (error) {
    console.error("Delete Project Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Delete failed", error: error.message });
  }
};

// Apply to a project
const applyToProject = async (req, res) => {
  try {
    const applicantId = req.user?.userId || req.body.userId;
    const { projectId, matchScore, notes } = req.body;
    
    
    if (!applicantId || !projectId) {
      return sendError(res, "userId and projectId are required", 400);
    }
    
    const row = await ProjectModel.applyToProject({
      projectId: Number(projectId),
      userId: Number(applicantId),
      matchScore: matchScore ? String(matchScore) : null, // Convert to string for numeric field
      notes,
    });
    return res.status(201).json({ success: true, status: 201, message: "Applied successfully", application: row });
  } catch (error) {
    console.error("Apply Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Apply failed", error: error.message });
  }
};

// Update applicant status
const updateApplicantStatus = async (req, res) => {
  try {
    const { projectId, userId, status } = req.body;
    if (!projectId || !userId || !status) return sendError(res, "projectId, userId and status are required", 400);
    const row = await ProjectModel.updateApplicantStatus({
      projectId: Number(projectId),
      userId: Number(userId),
      status,
    });
    return res.status(200).json({ success: true, status: 200, message: "Applicant status updated", application: row });
  } catch (error) {
    console.error("Update Applicant Status Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Update failed", error: error.message });
  }
};

// List applicants
const listApplicants = async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!projectId) return sendError(res, "projectId is required", 400);
    const rows = await ProjectModel.listApplicants(Number(projectId));
    return res.status(200).json({ success: true, status: 200, applicants: rows });
  } catch (error) {
    console.error("List Applicants Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Failed to fetch applicants", error: error.message });
  }
};

// Create invite
const createInvite = async (req, res) => {
  try {
    const { projectId, invitedEmail, invitedUserId, role, message } = req.body;
    if (!projectId || !invitedEmail) return sendError(res, "projectId and invitedEmail are required", 400);
    const row = await ProjectModel.createInvite({
      projectId: Number(projectId),
      invitedEmail,
      invitedUserId: invitedUserId ? Number(invitedUserId) : null,
      role,
      message,
    });
    return res.status(201).json({ success: true, status: 201, message: "Invite created", invite: row });
  } catch (error) {
    console.error("Create Invite Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Invite failed", error: error.message });
  }
};

// Respond to invite
const respondInvite = async (req, res) => {
  try {
    const { inviteId, status } = req.body;
    if (!inviteId || !status) return sendError(res, "inviteId and status are required", 400);
    const row = await ProjectModel.respondInvite({ inviteId: Number(inviteId), status });
    return res.status(200).json({ success: true, status: 200, message: "Invite updated", invite: row });
  } catch (error) {
    console.error("Respond Invite Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Failed to update invite", error: error.message });
  }
};

// Add file
const addFile = async (req, res) => {
  try {
    const { projectId, description, category } = req.body;
    const uploaderId = req.user?.userId || req.body.uploaderId;
    
    if (!projectId || !uploaderId) {
      return sendError(res, "projectId and uploaderId are required", 400);
    }

    // Check if file was uploaded
    if (!req.files || !req.files.file) {
      return sendError(res, "No file uploaded", 400);
    }

    const file = req.files.file;
    const fileName = file.name;
    const fileSize = file.size;
    const mimeType = file.mimetype;
    
    // Upload file to Supabase (mirror user service logic)
    const fileUpload = await uploadFileToSupabase(
      file,
      "project-files" // Storage path for project files
    );
    
    const row = await ProjectModel.addFile({
      projectId: Number(projectId),
      uploaderId: Number(uploaderId),
      name: fileName,
      url: fileUpload.path, // Store only the Supabase path (like user service)
      mimeType,
      sizeKb: Math.round(fileSize / 1024),
      description: description || null,
      category: category || 'other'
    });
    
    return res.status(201).json({ 
      success: true, 
      status: 201, 
      message: "File uploaded successfully", 
      file: row
    });
  } catch (error) {
    console.error("Add File Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Failed to upload file to Supabase", error: error.message });
  }
};

// Get files by project ID
const getProjectFiles = async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!projectId) return sendError(res, "projectId is required", 400);
    
    const files = await ProjectModel.getFilesByProjectId(Number(projectId));
    
    // Generate signed URLs for each file (mirror user service logic)
    const filesWithUrls = await Promise.all(files.map(async (file) => {
      let signedUrl = null;
      
      // Generate signed URL if file.url is a path (not already a full URL)
      if (file.url && !file.url.startsWith('http')) {
        const { data, error } = await supabase.storage
          .from("upload")
          .createSignedUrl(file.url, 60 * 60); // 1 hour expiry (like user service)
        
        if (!error) {
          signedUrl = data.signedUrl;
        }
      } else if (file.url && file.url.startsWith('http')) {
        // If it's already a full URL, use it as is
        signedUrl = file.url;
      }
      
      return {
        ...file,
        signedUrl: signedUrl
      };
    }));
    
    return res.status(200).json({ 
      success: true, 
      status: 200, 
      files: filesWithUrls 
    });
  } catch (error) {
    console.error("Get Project Files Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Failed to fetch project files", error: error.message });
  }
};

// Add update
const addUpdate = async (req, res) => {
  try {
    const authorId = req.user?.userId || req.body.authorId;
    const { projectId, type, message } = req.body;
    if (!authorId || !projectId || !message) return sendError(res, "authorId, projectId and message are required", 400);
    const row = await ProjectModel.addUpdate({ projectId: Number(projectId), authorId: Number(authorId), type, message });
    return res.status(201).json({ success: true, status: 201, message: "Update added", update: row });
  } catch (error) {
    console.error("Add Update Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Failed to add update", error: error.message });
  }
};

// Add review
const addReview = async (req, res) => {
  try {
    const reviewerId = req.user?.userId || req.body.reviewerId;
    const { projectId, rating, comment } = req.body;
    if (!reviewerId || !projectId || !rating) return sendError(res, "reviewerId, projectId and rating are required", 400);
    const row = await ProjectModel.addReview({ projectId: Number(projectId), reviewerId: Number(reviewerId), rating: Number(rating), comment });
    return res.status(201).json({ success: true, status: 201, message: "Review added", review: row });
  } catch (error) {
    console.error("Add Review Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Failed to add review", error: error.message });
  }
};

// Add boost
const addBoost = async (req, res) => {
  try {
    const purchaserId = req.user?.userId || req.body.purchasedBy;
    const { projectId, plan, amountCents, currency, startAt, endAt } = req.body;
    if (!purchaserId || !projectId || !plan || !amountCents || !startAt || !endAt) {
      return sendError(res, "purchasedBy, projectId, plan, amountCents, startAt, endAt are required", 400);
    }
    const row = await ProjectModel.addBoost({
      projectId: Number(projectId),
      purchasedBy: Number(purchaserId),
      plan,
      amountCents: Number(amountCents),
      currency,
      startAt: new Date(startAt),
      endAt: new Date(endAt),
    });
    return res.status(201).json({ success: true, status: 201, message: "Boost added", boost: row });
  } catch (error) {
    console.error("Add Boost Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Failed to add boost", error: error.message });
  }
};

module.exports = {
  createProject,
  getProject,
  listProjects,
  updateProject,
  deleteProject,
  applyToProject,
  updateApplicantStatus,
  listApplicants,
  createInvite,
  respondInvite,
  addFile,
  getProjectFiles,
  addUpdate,
  addReview,
  addBoost,
};

