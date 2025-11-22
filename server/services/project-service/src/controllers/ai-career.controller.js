const aiCareerService = require('../utils/aiCareerService');
const awaitHandlerFactory = require('shared/middleware/awaitHandlerFactory.middleware');
const asyncHandler = awaitHandlerFactory;

/**
 * Get career recommendations for developers
 * GET /api/v1/ai-career/recommendations
 */
const getCareerRecommendations = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const userData = {
    skills: req.user.skills || [],
    experience: req.user.experience || '',
    location: req.user.location || '',
    bio: req.user.bio || '',
  };

  try {
    const recommendations = await aiCareerService.getCareerRecommendations(userId, userData);
    
    res.status(200).json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    console.error('Get career recommendations error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get career recommendations'
    });
  }
});

/**
 * Get resume enhancement suggestions
 * GET /api/v1/ai-career/resume-suggestions
 */
const getResumeSuggestions = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const resumeData = {
    resume: req.body.resume || '',
    currentJob: req.body.currentJob || '',
    experience: req.user.experience || '',
  };

  try {
    const suggestions = await aiCareerService.getResumeSuggestions(userId, resumeData);
    
    res.status(200).json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    console.error('Get resume suggestions error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get resume suggestions'
    });
  }
});

/**
 * Analyze skill gaps for developers
 * GET /api/v1/ai-career/skill-gaps
 */
const analyzeSkillGap = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const userSkills = req.user.skills || {};

  try {
    const skillGaps = await aiCareerService.analyzeSkillGap(userId, userSkills);
    
    res.status(200).json({
      success: true,
      data: skillGaps
    });
  } catch (error) {
    console.error('Analyze skill gap error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to analyze skill gaps'
    });
  }
});

/**
 * Match developers for a project (for project owners)
 * GET /api/v1/ai-career/developer-matches?projectId=123
 */
const matchDevelopers = asyncHandler(async (req, res) => {
  const projectOwnerId = req.user.userId;
  const projectId = req.query.projectId ? parseInt(req.query.projectId) : null;
  
  let projectData = {};
  if (projectId) {
    try {
      const project = await require('../models/projects.model').ProjectsModel.getProjectById(projectId);
      if (project) {
        projectData = {
          title: project.title,
          description: project.description,
          skills: project.skills || [],
          experience: project.experienceLevel || '',
          budget: project.budgetMin && project.budgetMax 
            ? `$${project.budgetMin} - $${project.budgetMax}` 
            : '',
        };
      }
    } catch (error) {
      console.error('Error fetching project:', error);
    }
  }

  try {
    const matches = await aiCareerService.matchDevelopers(projectOwnerId, projectId, projectData);
    
    res.status(200).json({
      success: true,
      data: matches
    });
  } catch (error) {
    console.error('Match developers error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to match developers'
    });
  }
});

/**
 * Optimize project listing (for project owners)
 * GET /api/v1/ai-career/project-optimizations?projectId=123
 */
const optimizeProject = asyncHandler(async (req, res) => {
  const projectOwnerId = req.user.userId;
  const projectId = req.query.projectId ? parseInt(req.query.projectId) : null;

  if (!projectId) {
    return res.status(400).json({
      success: false,
      message: 'Project ID is required'
    });
  }

  try {
    const project = await require('../models/projects.model').ProjectsModel.getProjectById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    if (project.ownerId !== projectOwnerId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to optimize this project'
      });
    }

    const projectData = {
      title: project.title,
      description: project.description,
      skills: project.skills || [],
      budget: project.budgetMin && project.budgetMax 
        ? `$${project.budgetMin} - $${project.budgetMax}` 
        : '',
      category: project.category || '',
    };

    const optimizations = await aiCareerService.optimizeProject(projectId, projectOwnerId, projectData);
    
    res.status(200).json({
      success: true,
      data: optimizations
    });
  } catch (error) {
    console.error('Optimize project error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to optimize project'
    });
  }
});

/**
 * Get skill trends (for admins)
 * GET /api/v1/ai-career/skill-trends
 */
const getSkillTrends = asyncHandler(async (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }

  try {
    const trends = await aiCareerService.getSkillTrends();
    
    res.status(200).json({
      success: true,
      data: trends
    });
  } catch (error) {
    console.error('Get skill trends error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get skill trends'
    });
  }
});

/**
 * Get platform insights (for admins)
 * GET /api/v1/ai-career/platform-insights
 */
const getPlatformInsights = asyncHandler(async (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }

  try {
    const insights = await aiCareerService.getPlatformInsights();
    
    res.status(200).json({
      success: true,
      data: insights
    });
  } catch (error) {
    console.error('Get platform insights error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get platform insights'
    });
  }
});

/**
 * Get admin career dashboard (for admins)
 * GET /api/v1/ai-career/admin/dashboard
 */
const getAdminCareerDashboard = asyncHandler(async (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }

  try {
    const { timeframe = '6m' } = req.query;
    const authToken = req.headers.authorization; // Pass auth token to service
    const dashboard = await aiCareerService.getAdminCareerDashboard(timeframe, authToken);
    
    res.status(200).json({
      success: true,
      data: dashboard
    });
  } catch (error) {
    console.error('Get admin career dashboard error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get admin career dashboard'
    });
  }
});

/**
 * Analyze team skills (for project owners)
 * GET /api/v1/ai-career/team-analysis?projectId=123
 */
const analyzeTeam = asyncHandler(async (req, res) => {
  const projectOwnerId = req.user.userId;
  const projectId = req.query.projectId ? parseInt(req.query.projectId) : null;

  // For GET requests, team data can be passed via query params or use defaults
  const teamData = {
    projectId,
    currentTeam: req.query.currentTeam ? JSON.parse(req.query.currentTeam) : [],
    requiredSkills: req.query.requiredSkills ? JSON.parse(req.query.requiredSkills) : [],
  };

  try {
    const analysis = await aiCareerService.analyzeTeam(projectOwnerId, projectId, teamData);
    
    res.status(200).json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error('Analyze team error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to analyze team'
    });
  }
});

module.exports = {
  getCareerRecommendations,
  getResumeSuggestions,
  analyzeSkillGap,
  matchDevelopers,
  optimizeProject,
  getSkillTrends,
  getPlatformInsights,
  getAdminCareerDashboard,
  analyzeTeam,
};

