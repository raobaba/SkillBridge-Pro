// Import all models (each model exports both table and model class)
const { projectsTable, ProjectsModel } = require("./projects.model");
const { projectSkillsTable, ProjectSkillsModel } = require("./project-skills.model");
const { projectTagsTable, ProjectTagsModel } = require("./project-tags.model");
const { projectApplicantsTable, ProjectApplicantsModel } = require("./project-applicants.model");
const { projectInvitesTable, ProjectInvitesModel } = require("./project-invites.model");
const { projectTeamTable, ProjectTeamModel } = require("./project-team.model");
const { projectFilesTable, ProjectFilesModel } = require("./project-files.model");
const { projectUpdatesTable, ProjectUpdatesModel } = require("./project-updates.model");
const { projectReviewsTable, ProjectReviewsModel } = require("./project-reviews.model");
const { projectBoostsTable, ProjectBoostsModel } = require("./project-boosts.model");
const { projectCollaboratorsTable, ProjectCollaboratorsModel } = require("./project-collaborators.model");
const { projectAnalyticsTable, ProjectAnalyticsModel } = require("./project-analytics.model");
const { projectNotificationsTable, ProjectNotificationsModel } = require("./project-notifications.model");
const { projectCommentsTable, ProjectCommentsModel } = require("./project-comments.model");
const { projectMilestonesTable, ProjectMilestonesModel } = require("./project-milestones.model");
const { projectTasksTable, ProjectTasksModel } = require("./project-tasks.model");
const { projectFavoritesTable, ProjectFavoritesModel } = require("./project-favorites.model");
const { projectSavesTable, ProjectSavesModel } = require("./project-saves.model");

// Legacy ProjectModel for backward compatibility
const ProjectModel = {
  // Projects CRUD
  createProject: ProjectsModel.createProject,
  getProjectById: ProjectsModel.getProjectById,
  getProjectByUUID: ProjectsModel.getProjectByUUID,
  listProjects: ProjectsModel.listProjects,
  updateProject: ProjectsModel.updateProject,
  softDeleteProject: ProjectsModel.softDeleteProject,
  
  // Skills & Tags
  setSkills: ProjectSkillsModel.setSkills,
  setTags: ProjectTagsModel.setTags,
  
  // Applicants
  applyToProject: ProjectApplicantsModel.applyToProject,
  withdrawApplication: ProjectApplicantsModel.withdrawApplication,
  updateApplicantStatus: ProjectApplicantsModel.updateApplicantStatus,
  listApplicants: ProjectApplicantsModel.listApplicants,
  listApplicationsByUser: ProjectApplicantsModel.listApplicationsByUser,
  countApplicationsByUser: ProjectApplicantsModel.countApplicationsByUser,
  
  // Invites
  createInvite: ProjectInvitesModel.createInvite,
  respondInvite: ProjectInvitesModel.respondInvite,
  getInviteById: ProjectInvitesModel.getInviteById,
  getInvitesByProjectId: ProjectInvitesModel.getInvitesByProjectId,
  getInvitesByEmail: ProjectInvitesModel.getInvitesByEmail,
  
  // Files
  addFile: ProjectFilesModel.addFile,
  getFilesByProjectId: ProjectFilesModel.getFilesByProjectId,
  
  // Updates
  addUpdate: ProjectUpdatesModel.addUpdate,
  
  // Reviews
  addReview: ProjectReviewsModel.addReview,
  
  // Boosts
  addBoost: ProjectBoostsModel.addBoost,
  
  // New functionality
  addCollaborator: ProjectCollaboratorsModel.addCollaborator,
  addAnalytics: ProjectAnalyticsModel.addMetric,
  addNotification: ProjectNotificationsModel.addNotification,
  addComment: ProjectCommentsModel.addComment,
  getProjectComments: ProjectCommentsModel.getCommentsByProjectId,
  addMilestone: ProjectMilestonesModel.addMilestone,
  addTask: ProjectTasksModel.addTask,
  
  // Favorites
  addProjectFavorite: ProjectsModel.addProjectFavorite,
  removeProjectFavorite: ProjectsModel.removeProjectFavorite,
  getProjectFavorites: ProjectsModel.getProjectFavorites,
  addProjectSave: ProjectsModel.addProjectSave,
  removeProjectSave: ProjectsModel.removeProjectSave,
  getProjectSaves: ProjectsModel.getProjectSaves,
  
  // Search
  searchProjects: ProjectsModel.searchProjects,
  
  // Statistics
  getProjectStats: ProjectsModel.getProjectStats,
};

module.exports = {
  // Tables (for database operations)
  projectsTable,
  projectSkillsTable,
  projectTagsTable,
  projectApplicantsTable,
  projectInvitesTable,
  projectTeamTable,
  projectFilesTable,
  projectUpdatesTable,
  projectReviewsTable,
  projectBoostsTable,
  projectCollaboratorsTable,
  projectAnalyticsTable,
  projectNotificationsTable,
  projectCommentsTable,
  projectMilestonesTable,
  projectTasksTable,
  projectFavoritesTable,
  projectSavesTable,
  
  // Model Classes (for business logic)
  ProjectsModel,
  ProjectSkillsModel,
  ProjectTagsModel,
  ProjectApplicantsModel,
  ProjectInvitesModel,
  ProjectTeamModel,
  ProjectFilesModel,
  ProjectUpdatesModel,
  ProjectReviewsModel,
  ProjectBoostsModel,
  ProjectCollaboratorsModel,
  ProjectAnalyticsModel,
  ProjectNotificationsModel,
  ProjectCommentsModel,
  ProjectMilestonesModel,
  ProjectTasksModel,
  ProjectFavoritesModel,
  ProjectSavesModel,
  
  // Legacy Model (for backward compatibility with existing controllers)
  ProjectModel,
};
