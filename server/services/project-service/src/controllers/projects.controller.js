const { ProjectModel } = require("../models");
const { FilterOptionsModel } = require("../models/filter-options.model");
const { uploadFileToSupabase } = require("shared/utils/uploadFile.utils");
const { supabase } = require("shared/utils/supabase.utils");
const { db } = require("../config/database");
const { ilike, asc } = require("drizzle-orm");
const { projectSkillsTable } = require("../models/project-skills.model");
const { projectTagsTable } = require("../models/project-tags.model");

// Basic error helper to keep responses consistent
const sendError = (res, message, status = 400) =>
  res.status(status).json({ success: false, status, message });

// Create a new project
const createProject = async (req, res) => {
  try {
    // Only use authenticated user's ID - no fallback to body for security
    const ownerId = req.user?.userId;
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
      isUrgent,
      isFeatured,
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
    if (!id || id === 'null' || id === 'undefined') {
      return sendError(res, "Project id is required", 400);
    }
    
    const projectId = Number(id);
    if (isNaN(projectId) || projectId <= 0) {
      return sendError(res, "Invalid project id", 400);
    }
    
    const project = await ProjectModel.getProjectById(projectId);
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
    const { 
      ownerId, 
      query,
      status, 
      priority,
      category, 
      experienceLevel, 
      isRemote, 
      location,
      budgetMin,
      budgetMax,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      limit = 20, 
      page = 1 
    } = req.query;
    
    // Include ownerId in filters for authenticated requests
    const filters = { 
      ownerId: ownerId ? Number(ownerId) : undefined,
      query,
      status,
      priority,
      category,
      experienceLevel,
      isRemote: isRemote !== undefined ? isRemote === 'true' : undefined,
      location,
      budgetMin: budgetMin ? Number(budgetMin) : undefined,
      budgetMax: budgetMax ? Number(budgetMax) : undefined,
      sortBy,
      sortOrder,
      limit: Number(limit),
      page: Number(page)
    };
    
    // Remove undefined values
    Object.keys(filters).forEach(key => {
      if (filters[key] === undefined) {
        delete filters[key];
      }
    });
    
    const result = await ProjectModel.searchProjects(filters);
    return res.status(200).json({ 
      success: true, 
      status: 200, 
      projects: result.projects,
      pagination: result.pagination
    });
  } catch (error) {
    console.error("List Projects Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Failed to fetch projects", error: error.message });
  }
};

// Get public projects for developer discovery (no authentication required)
const getPublicProjects = async (req, res) => {
  try {
    const { 
      query,
      category, 
      experienceLevel, 
      isRemote, 
      location, 
      budgetMin, 
      budgetMax,
      status, // Don't default to 'active' - let frontend control this
      priority,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      limit = 20, 
      page = 1 
    } = req.query;

    // Build filters for public access
    const filters = {
      query,
      status, // Only show active projects by default
      priority,
      category,
      experienceLevel,
      isRemote: isRemote !== undefined ? isRemote === 'true' : undefined,
      location,
      budgetMin: budgetMin ? Number(budgetMin) : undefined,
      budgetMax: budgetMax ? Number(budgetMax) : undefined,
      sortBy,
      sortOrder,
      limit: Number(limit),
      page: Number(page)
    };

    // Remove undefined values
    Object.keys(filters).forEach(key => {
      if (filters[key] === undefined) {
        delete filters[key];
      }
    });

    // Debug logging
    console.log('🔍 Public Projects Filter Debug:', {
      originalQuery: req.query,
      processedFilters: filters,
      timestamp: new Date().toISOString(),
      rawQueryString: JSON.stringify(req.query, null, 2)
    });

    const result = await ProjectModel.searchProjects(filters);
    
    console.log('📊 Filter Results:', {
      projectsFound: result.projects.length,
      totalCount: result.pagination.total,
      filters: filters
    });
    
    return res.status(200).json({ 
      success: true, 
      status: 200, 
      projects: result.projects,
      pagination: result.pagination,
      filters: {
        query,
        category,
        experienceLevel,
        isRemote,
        location,
        budgetMin,
        budgetMax,
        status,
        priority,
        skills: filters.skills,
        tags: filters.tags
      }
    });
  } catch (error) {
    console.error("Get Public Projects Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Failed to fetch public projects", error: error.message });
  }
};

// Get project categories (public metadata)
const getProjectCategories = async (req, res) => {
  try {
    const categories = [
      'Web Development',
      'Mobile Development', 
      'Desktop Application',
      'Backend Development',
      'Frontend Development',
      'Full Stack Development',
      'DevOps',
      'Data Science',
      'Machine Learning',
      'AI Development',
      'Blockchain',
      'Game Development',
      'UI/UX Design',
      'Graphic Design',
      'Content Writing',
      'Digital Marketing',
      'SEO',
      'Video Editing',
      'Audio Production',
      'Translation',
      'Research',
      'Consulting',
      'Other'
    ];

    return res.status(200).json({ 
      success: true, 
      status: 200, 
      categories 
    });
  } catch (error) {
    console.error("Get Project Categories Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Failed to fetch categories", error: error.message });
  }
};

// Get project metadata (experience levels, priorities, etc.)
// Removed getProjectMetadata - replaced by getFilterOptions which provides dynamic, database-driven filter options

// Get all filter options (public endpoint)
const getFilterOptions = async (req, res) => {
  try {
    const filterOptions = await FilterOptionsModel.getAllFilterOptions();
    
    return res.status(200).json({ 
      success: true, 
      status: 200, 
      filterOptions 
    });
  } catch (error) {
    console.error("Get Filter Options Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Failed to fetch filter options", error: error.message });
  }
};

// Update project
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const userRole = req.user?.role;
    
    if (!id) return sendError(res, "Project id is required", 400);
    
    // Check if project exists and user has permission to update it
    const existingProject = await ProjectModel.getProjectById(Number(id));
    if (!existingProject) return sendError(res, "Project not found", 404);
    
    // Only project owner or admin can update (admin can update any project)
    if (userRole !== 'admin' && existingProject.ownerId !== userId) {
      return sendError(res, "You can only update your own projects", 403);
    }
    
    const payload = { ...req.body };
    if (payload.startDate) payload.startDate = new Date(payload.startDate);
    if (payload.deadline) payload.deadline = new Date(payload.deadline);

    const project = await ProjectModel.updateProject(Number(id), payload);
    if (!project) return sendError(res, "Project update failed", 500);

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
    const userId = req.user?.userId;
    const userRole = req.user?.role;
    
    if (!id) return sendError(res, "Project id is required", 400);
    
    // Check if project exists and user has permission to delete it
    const existingProject = await ProjectModel.getProjectById(Number(id));
    if (!existingProject) return sendError(res, "Project not found", 404);
    
    // Only project owner or admin can delete (admin can delete any project)
    if (userRole !== 'admin' && existingProject.ownerId !== userId) {
      return sendError(res, "You can only delete your own projects", 403);
    }
    
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
    // Only use authenticated user's ID - no fallback to body for security
    const applicantId = req.user?.userId;
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

// Withdraw application
const withdrawApplication = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { projectId } = req.body;
    if (!userId || !projectId) return sendError(res, "userId and projectId are required", 400);

    const row = await ProjectModel.withdrawApplication(Number(projectId), Number(userId));
    // Make withdraw idempotent: return success even if nothing was deleted
    return res.status(200).json({
      success: true,
      status: 200,
      message: row ? "Application withdrawn" : "No existing application found; nothing to withdraw",
      application: row || null,
    });
  } catch (error) {
    console.error("Withdraw Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Withdraw failed", error: error.message });
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
    const inviterUserId = req.user?.userId;
    const inviterRole = req.user?.role;
    
    if (!projectId || !invitedEmail) return sendError(res, "projectId and invitedEmail are required", 400);
    if (!inviterUserId) return sendError(res, "Authentication required", 401);
    
    // Check if project exists and user has permission to invite
    const project = await ProjectModel.getProjectById(Number(projectId));
    if (!project) return sendError(res, "Project not found", 404);
    
    // Only project owner or admin can send invites
    if (inviterRole !== 'admin' && project.ownerId !== inviterUserId) {
      return sendError(res, "You can only invite people to your own projects", 403);
    }
    
    // Check if invite already exists for this email and project
    const existingInvites = await ProjectModel.getInvitesByProjectId(Number(projectId));
    const existingInvite = existingInvites.find(invite => 
      invite.invitedEmail.toLowerCase() === invitedEmail.toLowerCase() && 
      invite.status === 'pending'
    );
    
    if (existingInvite) {
      return sendError(res, "An active invite already exists for this email", 400);
    }
    
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

// Get invites for the authenticated user
const getMyInvites = async (req, res) => {
  try {
    const userEmail = req.user?.email;
    if (!userEmail) return sendError(res, "Authentication required", 401);
    
    const invites = await ProjectModel.getInvitesByEmail(userEmail);
    return res.status(200).json({ success: true, status: 200, invites });
  } catch (error) {
    console.error("Get My Invites Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Failed to fetch invites", error: error.message });
  }
};

// Respond to invite
const respondInvite = async (req, res) => {
  try {
    const { inviteId, status } = req.body;
    const responderUserId = req.user?.userId;
    const responderEmail = req.user?.email;
    
    if (!inviteId || !status) return sendError(res, "inviteId and status are required", 400);
    if (!responderUserId || !responderEmail) return sendError(res, "Authentication required", 401);
    
    // Get the invite to validate the responder
    const invite = await ProjectModel.getInviteById(Number(inviteId));
    if (!invite) return sendError(res, "Invite not found", 404);
    
    // Check if the person responding is actually the invited person
    const isInvitedUser = invite.invitedUserId === responderUserId || 
                          invite.invitedEmail.toLowerCase() === responderEmail.toLowerCase();
    
    if (!isInvitedUser) {
      return sendError(res, "You can only respond to invites sent to you", 403);
    }
    
    // Check if invite is still pending
    if (invite.status !== 'pending') {
      return sendError(res, `This invite has already been ${invite.status}`, 400);
    }
    
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
    const uploaderId = req.user?.userId;
    
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
    const authorId = req.user?.userId;
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
    const reviewerId = req.user?.userId;
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
    const purchaserId = req.user?.userId;
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

// Get project updates
const getProjectUpdates = async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!projectId) return sendError(res, "projectId is required", 400);
    
    const updates = await ProjectModel.getProjectUpdates(Number(projectId));
    return res.status(200).json({ success: true, status: 200, updates });
  } catch (error) {
    console.error("Get Project Updates Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Failed to fetch project updates", error: error.message });
  }
};

// Get project reviews
const getProjectReviews = async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!projectId) return sendError(res, "projectId is required", 400);
    
    const reviews = await ProjectModel.getProjectReviews(Number(projectId));
    return res.status(200).json({ success: true, status: 200, reviews });
  } catch (error) {
    console.error("Get Project Reviews Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Failed to fetch project reviews", error: error.message });
  }
};

// Get project boosts
const getProjectBoosts = async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!projectId) return sendError(res, "projectId is required", 400);
    
    const boosts = await ProjectModel.getProjectBoosts(Number(projectId));
    return res.status(200).json({ success: true, status: 200, boosts });
  } catch (error) {
    console.error("Get Project Boosts Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Failed to fetch project boosts", error: error.message });
  }
};

// Get project statistics
const getProjectStats = async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!projectId) return sendError(res, "projectId is required", 400);
    
    const stats = await ProjectModel.getProjectStats(Number(projectId));
    return res.status(200).json({ success: true, status: 200, stats });
  } catch (error) {
    console.error("Get Project Stats Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Failed to fetch project stats", error: error.message });
  }
};

// Search projects with advanced filters
const searchProjects = async (req, res) => {
  try {
    const {
      query,
      category,
      status,
      priority,
      experienceLevel,
      budgetMin,
      budgetMax,
      isRemote,
      location,
      sortBy,
      sortOrder,
      page = 1,
      limit = 20
    } = req.query;
    
    const filters = {
      query,
      category,
      status,
      priority,
      experienceLevel,
      budgetMin: budgetMin ? Number(budgetMin) : undefined,
      budgetMax: budgetMax ? Number(budgetMax) : undefined,
      isRemote: isRemote === 'true',
      location,
      sortBy: sortBy || 'createdAt',
      sortOrder: sortOrder || 'desc',
      page: Number(page),
      limit: Number(limit)
    };
    
    const results = await ProjectModel.searchProjects(filters);
    return res.status(200).json({ success: true, status: 200, ...results });
  } catch (error) {
    console.error("Search Projects Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Failed to search projects", error: error.message });
  }
};

// Get project recommendations for user
const getProjectRecommendations = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return sendError(res, "Authentication required", 401);
    
    const { limit = 10 } = req.query;
    const recommendations = await ProjectModel.getProjectRecommendations(Number(userId), Number(limit));
    return res.status(200).json({ success: true, status: 200, recommendations });
  } catch (error) {
    console.error("Get Project Recommendations Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Failed to fetch recommendations", error: error.message });
  }
};

// Add project to favorites
const addProjectFavorite = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { projectId } = req.body;
    
    if (!userId || !projectId) {
      return sendError(res, "userId and projectId are required", 400);
    }
    
    const projectIdNum = Number(projectId);
    if (isNaN(projectIdNum) || projectIdNum <= 0) {
      return sendError(res, "Invalid project id", 400);
    }
    
    const favorite = await ProjectModel.addProjectFavorite(Number(userId), projectIdNum);
    return res.status(201).json({ success: true, status: 201, message: "Project added to favorites", favorite });
  } catch (error) {
    console.error("Add Project Favorite Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Failed to add favorite", error: error.message });
  }
};

// Remove project from favorites
const removeProjectFavorite = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { projectId } = req.body;
    
    if (!userId || !projectId) {
      return sendError(res, "userId and projectId are required", 400);
    }
    
    const projectIdNum = Number(projectId);
    if (isNaN(projectIdNum) || projectIdNum <= 0) {
      return sendError(res, "Invalid project id", 400);
    }
    
    await ProjectModel.removeProjectFavorite(Number(userId), projectIdNum);
    return res.status(200).json({ success: true, status: 200, message: "Project removed from favorites" });
  } catch (error) {
    console.error("Remove Project Favorite Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Failed to remove favorite", error: error.message });
  }
};

// Get user's favorite projects
const getProjectFavorites = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return sendError(res, "Authentication required", 401);
    
    const favorites = await ProjectModel.getProjectFavorites(Number(userId));
    return res.status(200).json({ success: true, status: 200, favorites });
  } catch (error) {
    console.error("Get Project Favorites Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Failed to fetch favorites", error: error.message });
  }
};

// 🔖 Project Saves (Bookmarks)
const addProjectSave = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { projectId } = req.body;
    if (!userId || !projectId) return sendError(res, "userId and projectId are required", 400);
    const save = await ProjectModel.addProjectSave(Number(userId), Number(projectId));
    return res.status(201).json({ success: true, status: 201, message: "Project saved", save });
  } catch (error) {
    console.error("Add Project Save Error:", error);
    return res.status(500).json({ success: false, status: 500, message: "Failed to save project", error: error.message });
  }
};

const removeProjectSave = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { projectId } = req.body;
    if (!userId || !projectId) return sendError(res, "userId and projectId are required", 400);
    await ProjectModel.removeProjectSave(Number(userId), Number(projectId));
    return res.status(200).json({ success: true, status: 200, message: "Project unsaved" });
  } catch (error) {
    console.error("Remove Project Save Error:", error);
    return res.status(500).json({ success: false, status: 500, message: "Failed to unsave project", error: error.message });
  }
};

const getProjectSaves = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return sendError(res, "Authentication required", 401);
    const saves = await ProjectModel.getProjectSaves(Number(userId));
    return res.status(200).json({ success: true, status: 200, saves });
  } catch (error) {
    console.error("Get Project Saves Error:", error);
    return res.status(500).json({ success: false, status: 500, message: "Failed to fetch saves", error: error.message });
  }
};

// Add project comment
const addProjectComment = async (req, res) => {
  try {
    const authorId = req.user?.userId;
    const { projectId, content, parentCommentId } = req.body;
    
    if (!authorId || !projectId || !content) {
      return sendError(res, "authorId, projectId and content are required", 400);
    }
    
    const comment = await ProjectModel.addProjectComment({
      projectId: Number(projectId),
      authorId: Number(authorId),
      content,
      parentCommentId: parentCommentId ? Number(parentCommentId) : null
    });
    
    return res.status(201).json({ success: true, status: 201, message: "Comment added", comment });
  } catch (error) {
    console.error("Add Project Comment Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Failed to add comment", error: error.message });
  }
};

// Get project comments
const getProjectComments = async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!projectId) return sendError(res, "projectId is required", 400);
    
    const comments = await ProjectModel.getProjectComments(Number(projectId));
    return res.status(200).json({ success: true, status: 200, comments });
  } catch (error) {
    console.error("Get Project Comments Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Failed to fetch comments", error: error.message });
  }
};

// Update project comment
const updateProjectComment = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { commentId } = req.params;
    const { content } = req.body;
    
    if (!userId || !commentId || !content) {
      return sendError(res, "userId, commentId and content are required", 400);
    }
    
    const comment = await ProjectModel.updateProjectComment(Number(commentId), Number(userId), content);
    if (!comment) return sendError(res, "Comment not found or you don't have permission to edit it", 404);
    
    return res.status(200).json({ success: true, status: 200, message: "Comment updated", comment });
  } catch (error) {
    console.error("Update Project Comment Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Failed to update comment", error: error.message });
  }
};

// Delete project comment
const deleteProjectComment = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { commentId } = req.params;
    
    if (!userId || !commentId) {
      return sendError(res, "userId and commentId are required", 400);
    }
    
    const deleted = await ProjectModel.deleteProjectComment(Number(commentId), Number(userId));
    if (!deleted) return sendError(res, "Comment not found or you don't have permission to delete it", 404);
    
    return res.status(200).json({ success: true, status: 200, message: "Comment deleted" });
  } catch (error) {
    console.error("Delete Project Comment Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Failed to delete comment", error: error.message });
  }
};

// Get search suggestions for skills and tags
const getSearchSuggestions = async (req, res) => {
  try {
    const { query, type = 'all' } = req.query; // type can be 'skills', 'tags', or 'all'
    
    if (!query || query.trim().length < 2) {
      return res.status(200).json({ 
        success: true, 
        status: 200, 
        suggestions: { skills: [], tags: [] }
      });
    }

    const searchTerm = query.trim().toLowerCase();
    const suggestions = { skills: [], tags: [] };

    // Get skills suggestions
    if (type === 'all' || type === 'skills') {
      const skillsResult = await db
        .select({ name: projectSkillsTable.name })
        .from(projectSkillsTable)
        .where(ilike(projectSkillsTable.name, `%${searchTerm}%`))
        .groupBy(projectSkillsTable.name)
        .orderBy(asc(projectSkillsTable.name))
        .limit(10);
      
      suggestions.skills = skillsResult.map(row => row.name);
    }

    // Get tags suggestions
    if (type === 'all' || type === 'tags') {
      const tagsResult = await db
        .select({ name: projectTagsTable.name })
        .from(projectTagsTable)
        .where(ilike(projectTagsTable.name, `%${searchTerm}%`))
        .groupBy(projectTagsTable.name)
        .orderBy(asc(projectTagsTable.name))
        .limit(10);
      
      suggestions.tags = tagsResult.map(row => row.name);
    }

    return res.status(200).json({ 
      success: true, 
      status: 200, 
      suggestions 
    });
  } catch (error) {
    console.error("Get Search Suggestions Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Failed to get search suggestions", error: error.message });
  }
};

module.exports = {
  createProject,
  getProject,
  listProjects,
  getPublicProjects,
  updateProject,
  deleteProject,
  applyToProject,
  updateApplicantStatus,
  listApplicants,
  createInvite,
  getMyInvites,
  respondInvite,
  addFile,
  getProjectFiles,
  addUpdate,
  addReview,
  addBoost,
  getProjectUpdates,
  getProjectReviews,
  getProjectBoosts,
  getProjectStats,
  searchProjects,
  getProjectRecommendations,
  getProjectCategories,
  getFilterOptions,
  addProjectFavorite,
  removeProjectFavorite,
  getProjectFavorites,
  withdrawApplication,
  addProjectSave,
  removeProjectSave,
  getProjectSaves,
  addProjectComment,
  getProjectComments,
  updateProjectComment,
  deleteProjectComment,
  getSearchSuggestions,
};

