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
  updateApplicantStatus: ProjectApplicantsModel.updateApplicantStatus,
  listApplicants: ProjectApplicantsModel.listApplicants,
  
  // Invites
  createInvite: ProjectInvitesModel.createInvite,
  respondInvite: ProjectInvitesModel.respondInvite,
  
  // Files
  addFile: ProjectFilesModel.addFile,
  
  // Updates
  addUpdate: ProjectUpdatesModel.addUpdate,
  
  // Reviews
  addReview: ProjectReviewsModel.addReview,
  
  // Boosts
  addBoost: ProjectBoostsModel.addBoost,
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
  
  // Legacy Model (for backward compatibility with existing controllers)
  ProjectModel,
};
