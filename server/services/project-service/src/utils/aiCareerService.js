const {
  CareerRecommendationsModel,
  ResumeSuggestionsModel,
  SkillGapsModel,
  DeveloperMatchesModel,
  ProjectOptimizationsModel,
  SkillTrendsModel,
  PlatformInsightsModel,
  TeamAnalysisModel,
} = require('../models/ai-career.model');

class AICareerService {
  /**
   * Get career recommendations for a developer
   */
  async getCareerRecommendations(userId, userData = {}) {
    try {
      const existing = await CareerRecommendationsModel.getRecommendationsByUserId(userId, 10);
      if (existing && existing.length > 0) {
        return existing.map(rec => ({
          id: rec.id,
          title: rec.title,
          match: `${rec.matchScore}%`,
          description: rec.description,
          icon: rec.icon || "💻",
          skills: rec.skills || [],
          growth: rec.growth,
          salary: rec.salary,
        }));
      }
      return [];
    } catch (error) {
      console.error('Error getting career recommendations:', error);
      throw error;
    }
  }

  /**
   * Get resume enhancement suggestions
   */
  async getResumeSuggestions(userId, resumeData = {}) {
    try {
      const existing = await ResumeSuggestionsModel.getSuggestionsByUserId(userId, 10);
      if (existing && existing.length > 0) {
        return existing.map(s => ({
          id: s.id,
          text: s.text,
          category: s.category,
          priority: s.priority,
          icon: s.icon || "📊",
        }));
      }
      return [];
    } catch (error) {
      console.error('Error getting resume suggestions:', error);
      throw error;
    }
  }

  /**
   * Analyze skill gaps for a developer
   */
  async analyzeSkillGap(userId, userSkills = {}) {
    try {
      const existing = await SkillGapsModel.getSkillGapsByUserId(userId, 10);
      if (existing && existing.length > 0) {
        return existing.map(gap => ({
          skill: gap.skill,
          required: gap.requiredLevel,
          current: gap.currentLevel,
          icon: gap.icon || "🐳",
          category: gap.category,
          gapLevel: gap.gapLevel,
          progress: gap.progress,
        }));
      }
      return [];
    } catch (error) {
      console.error('Error analyzing skill gap:', error);
      throw error;
    }
  }

  /**
   * Match developers for a project
   */
  async matchDevelopers(projectOwnerId, projectId = null, projectData = {}) {
    try {
      const existing = await DeveloperMatchesModel.getMatchesByProjectOwner(projectOwnerId, projectId, 10);
      if (existing && existing.length > 0) {
        return existing.map(match => ({
          id: match.id,
          name: `Developer ${match.developerId}`, // In real app, fetch from user-service
          skills: match.skills || [],
          experience: match.experience,
          match: match.matchScore,
          availability: match.availability,
          rate: match.rate,
          location: match.location,
          icon: "👩‍💻",
          highlights: match.highlights || [],
        }));
      }
      return [];
    } catch (error) {
      console.error('Error matching developers:', error);
      throw error;
    }
  }

  /**
   * Optimize project listing
   */
  async optimizeProject(projectId, projectOwnerId, projectData = {}) {
    try {
      const existing = await ProjectOptimizationsModel.getOptimizationsByProjectId(projectId, 10);
      if (existing && existing.length > 0) {
        return existing.map(opt => ({
          id: opt.id,
          title: opt.title,
          description: opt.description,
          impact: opt.impact,
          category: opt.category,
          icon: opt.icon || "📝",
          suggestions: opt.suggestions || [],
        }));
      }
      return [];
    } catch (error) {
      console.error('Error optimizing project:', error);
      throw error;
    }
  }

  /**
   * Get skill trends (for admins)
   */
  async getSkillTrends() {
    try {
      const existing = await SkillTrendsModel.getAllTrends(20);
      if (existing && existing.length > 0) {
        return existing.map(trend => ({
          id: trend.id,
          skill: trend.skill,
          demand: trend.demand,
          growth: trend.growth,
          trend: trend.trend,
          icon: trend.icon || "⚛️",
          category: trend.category,
          projects: trend.projectsCount,
          developers: trend.developersCount,
          color: trend.color,
        }));
      }
      return [];
    } catch (error) {
      console.error('Error getting skill trends:', error);
      throw error;
    }
  }

  /**
   * Get platform insights (for admins)
   */
  async getPlatformInsights() {
    try {
      const existing = await PlatformInsightsModel.getAllInsights(20);
      if (existing && existing.length > 0) {
        return existing.map(insight => ({
          id: insight.id,
          title: insight.title,
          description: insight.description,
          impact: insight.impact,
          recommendation: insight.recommendation,
          icon: insight.icon || "⏰",
          category: insight.category,
          metrics: insight.metrics || {},
        }));
      }
      return [];
    } catch (error) {
      console.error('Error getting platform insights:', error);
      throw error;
    }
  }

  /**
   * Analyze team skills (for project owners)
   */
  async analyzeTeam(projectOwnerId, projectId = null, teamData = {}) {
    try {
      const existing = await TeamAnalysisModel.getAnalysisByProjectOwner(projectOwnerId, projectId, 10);
      if (existing && existing.length > 0) {
        return existing.map(analysis => ({
          id: analysis.id,
          skill: analysis.skill,
          current: analysis.currentCount,
          needed: analysis.neededCount,
          gap: analysis.gap,
          priority: analysis.priority,
          icon: analysis.icon || "💻",
          category: analysis.category,
          suggestions: analysis.suggestions || [],
        }));
      }
      return [];
    } catch (error) {
      console.error('Error analyzing team:', error);
      throw error;
    }
  }
}

module.exports = new AICareerService();
