const aiService = require('../utils/aiService');
const awaitHandlerFactory = require('shared/middleware/awaitHandlerFactory.middleware');
const asyncHandler = awaitHandlerFactory;

/**
 * Generate AI-enhanced project description
 */
const generateProjectDescription = asyncHandler(async (req, res) => {
  const projectData = req.body;
  
  if (!projectData) {
    return res.status(400).json({
      success: false,
      message: 'Project data is required'
    });
  }

  try {
    const description = await aiService.generateProjectDescription(projectData);
    
    res.status(200).json({
      success: true,
      description
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate description'
    });
  }
});

/**
 * Generate project title suggestions
 */
const generateProjectTitles = asyncHandler(async (req, res) => {
  const projectData = req.body;
  
  if (!projectData) {
    return res.status(400).json({
      success: false,
      message: 'Project data is required'
    });
  }

  try {
    const titles = await aiService.generateProjectTitles(projectData);
    
    res.status(200).json({
      success: true,
      titles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate titles'
    });
  }
});

/**
 * Generate skill suggestions
 */
const generateSkillSuggestions = asyncHandler(async (req, res) => {
  const projectData = req.body;
  
  if (!projectData) {
    return res.status(400).json({
      success: false,
      message: 'Project data is required'
    });
  }

  try {
    const skills = await aiService.generateSkillSuggestions(projectData);
    
    res.status(200).json({
      success: true,
      skills
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate skills'
    });
  }
});

/**
 * Generate project requirements
 */
const generateRequirements = asyncHandler(async (req, res) => {
  const projectData = req.body;
  
  if (!projectData) {
    return res.status(400).json({
      success: false,
      message: 'Project data is required'
    });
  }

  try {
    const requirements = await aiService.generateRequirements(projectData);
    
    res.status(200).json({
      success: true,
      requirements
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate requirements'
    });
  }
});

/**
 * Generate project benefits
 */
const generateBenefits = asyncHandler(async (req, res) => {
  const projectData = req.body;
  
  if (!projectData) {
    return res.status(400).json({
      success: false,
      message: 'Project data is required'
    });
  }

  try {
    const benefits = await aiService.generateBenefits(projectData);
    
    res.status(200).json({
      success: true,
      benefits
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate benefits'
    });
  }
});

/**
 * Generate budget suggestions
 */
const generateBudgetSuggestions = asyncHandler(async (req, res) => {
  const projectData = req.body;
  
  if (!projectData) {
    return res.status(400).json({
      success: false,
      message: 'Project data is required'
    });
  }

  try {
    const budget = await aiService.generateBudgetSuggestions(projectData);
    
    res.status(200).json({
      success: true,
      budget
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate budget'
    });
  }
});

/**
 * Generate comprehensive project suggestions
 */
const generateComprehensiveSuggestions = asyncHandler(async (req, res) => {
  const projectData = req.body;
  
  if (!projectData) {
    return res.status(400).json({
      success: false,
      message: 'Project data is required'
    });
  }

  try {
    const suggestions = await aiService.generateComprehensiveSuggestions(projectData);
    
    res.status(200).json({
      success: true,
      suggestions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate suggestions'
    });
  }
});

module.exports = {
  generateProjectDescription,
  generateProjectTitles,
  generateSkillSuggestions,
  generateRequirements,
  generateBenefits,
  generateBudgetSuggestions,
  generateComprehensiveSuggestions
};
