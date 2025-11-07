const axios = require("axios");
const { PortfolioSyncModel } = require("../models/portfolio-sync.model");
const { UserModel } = require("../models/user.model");
const API_URLS = require("../config/api-urls.config");

class PortfolioSyncService {
  // ========== GitHub Integration ==========
  static async fetchGitHubData(accessToken, username) {
    try {
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      };

      // Fetch user repositories
      const reposResponse = await axios.get(`${API_URLS.GITHUB_API_BASE_URL}/user/repos?per_page=100&sort=updated`, {
        headers,
      });

      const repositories = reposResponse.data.map((repo) => ({
        id: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description,
        url: repo.html_url,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        createdAt: repo.created_at,
        updatedAt: repo.updated_at,
        isPrivate: repo.private,
        metadata: {
          topics: repo.topics || [],
          defaultBranch: repo.default_branch,
          size: repo.size,
          archived: repo.archived,
        },
      }));

      // Fetch user commits (from user's activity)
      const commits = [];
      try {
        // Use authenticated endpoint if we have access token
        const eventsResponse = await axios.get(`${API_URLS.GITHUB_API_BASE_URL}/user/events?per_page=100`, {
          headers,
        });

        eventsResponse.data
          .filter((event) => event.type === "PushEvent")
          .forEach((event) => {
            event.payload.commits?.forEach((commit) => {
              commits.push({
                id: commit.sha,
                message: commit.message,
                url: `${API_URLS.GITHUB_WEB_BASE_URL}/${event.repo.name}/commit/${commit.sha}`,
                repository: event.repo.name,
                createdAt: event.created_at,
                metadata: {
                  author: commit.author,
                },
              });
            });
          });
      } catch (error) {
        console.log("Error fetching GitHub commits:", error.message);
      }

      return {
        repositories,
        commits,
        totalRepos: repositories.length,
        totalCommits: commits.length,
        totalStars: repositories.reduce((sum, repo) => sum + repo.stars, 0),
      };
    } catch (error) {
      throw new Error(`GitHub API error: ${error.message}`);
    }
  }

  static async calculateGitHubSkills(repositories, commits) {
    const skillMap = {};

    // Analyze languages from repositories
    repositories.forEach((repo) => {
      if (repo.language) {
        if (!skillMap[repo.language]) {
          skillMap[repo.language] = {
            repositories: 0,
            stars: 0,
            commits: 0,
          };
        }
        skillMap[repo.language].repositories += 1;
        skillMap[repo.language].stars += repo.stars;
      }
    });

    // Calculate scores (0-100)
    const skills = {};
    const maxRepos = Math.max(...Object.values(skillMap).map((s) => s.repositories), 1);
    const maxStars = Math.max(...Object.values(skillMap).map((s) => s.stars), 1);

    Object.entries(skillMap).forEach(([language, data]) => {
      const repoScore = (data.repositories / maxRepos) * 50;
      const starScore = (data.stars / maxStars) * 50;
      const totalScore = Math.min(100, Math.round(repoScore + starScore));

      skills[language] = {
        score: totalScore,
        level: PortfolioSyncModel.getLevelFromScore(totalScore),
        evidenceCount: data.repositories,
      };
    });

    return skills;
  }

  // ========== StackOverflow Integration ==========
  static async fetchStackOverflowData(userId) {
    try {
      // StackOverflow API v2.3
      const response = await axios.get(
        `${API_URLS.STACKOVERFLOW_API_BASE_URL}/users/${userId}?order=desc&sort=reputation&site=${API_URLS.STACKOVERFLOW_SITE}`
      );

      if (!response.data.items || response.data.items.length === 0) {
        throw new Error("User not found");
      }

      const user = response.data.items[0];

      // Fetch user's answers
      const answersResponse = await axios.get(
        `${API_URLS.STACKOVERFLOW_API_BASE_URL}/users/${userId}/answers?order=desc&sort=votes&site=${API_URLS.STACKOVERFLOW_SITE}&pagesize=100`
      );

      // Fetch user's tags (skills)
      const tagsResponse = await axios.get(
        `${API_URLS.STACKOVERFLOW_API_BASE_URL}/users/${userId}/tags?order=desc&sort=popular&site=${API_URLS.STACKOVERFLOW_SITE}&pagesize=100`
      );

      const answers = answersResponse.data.items.map((answer) => ({
        id: answer.answer_id,
        questionId: answer.question_id,
        title: answer.title,
        score: answer.score,
        isAccepted: answer.is_accepted,
        url: answer.link,
        createdAt: new Date(answer.creation_date * 1000),
        tags: answer.tags || [],
        metadata: {
          viewCount: answer.view_count,
          lastActivityDate: new Date(answer.last_activity_date * 1000),
        },
      }));

      const tags = tagsResponse.data.items.map((tag) => ({
        name: tag.name,
        count: tag.count,
        score: Math.min(100, Math.round((tag.count / 100) * 100)), // Normalize to 0-100
      }));

      return {
        user: {
          userId: user.user_id,
          username: user.display_name,
          reputation: user.reputation,
          badgeCounts: user.badge_counts,
        },
        answers,
        tags,
        totalAnswers: answers.length,
        totalReputation: user.reputation,
      };
    } catch (error) {
      throw new Error(`StackOverflow API error: ${error.message}`);
    }
  }

  static async calculateStackOverflowSkills(tags, answers) {
    const skills = {};

    tags.forEach((tag) => {
      skills[tag.name] = {
        score: tag.score,
        level: PortfolioSyncModel.getLevelFromScore(tag.score),
        evidenceCount: tag.count,
      };
    });

    return skills;
  }

  // ========== Portfolio Website Skills ==========
  static async fetchPortfolioSkills(portfolioUrl) {
    try {
      // This is a placeholder - in production, you'd use web scraping or API to analyze portfolio
      // For now, we'll return empty skills and let the sync process handle it
      // You could use services like Cheerio for web scraping, or an external API
      
      // Example: Fetch portfolio HTML and extract skills
      // const response = await axios.get(portfolioUrl);
      // Parse HTML to extract skills, technologies, etc.
      
      return {
        skills: {},
        message: "Portfolio skills extraction not yet implemented",
      };
    } catch (error) {
      throw new Error(`Portfolio analysis error: ${error.message}`);
    }
  }

  // ========== Main Sync Functions ==========
  static async syncGitHub(userId) {
    try {
      const token = await PortfolioSyncModel.getIntegrationToken(userId, "github");
      if (!token || !token.accessToken) {
        throw new Error("GitHub not connected");
      }

      const githubData = await this.fetchGitHubData(token.accessToken, token.platformUsername);
      
      // Store sync data
      await PortfolioSyncModel.upsertSyncData(userId, "github", "repository", githubData.repositories);
      await PortfolioSyncModel.upsertSyncData(userId, "github", "commit", githubData.commits);

      // Calculate and store skills
      const skills = await this.calculateGitHubSkills(githubData.repositories, githubData.commits);
      await PortfolioSyncModel.upsertSkillScores(userId, "github", skills);

      // Create sync history
      await PortfolioSyncModel.createSyncHistory(userId, "github", "success", {
        itemsSynced: githubData.repositories.length + githubData.commits.length,
        itemsUpdated: githubData.repositories.length,
        completedAt: new Date(),
      });

      return {
        success: true,
        data: githubData,
        skills,
      };
    } catch (error) {
      await PortfolioSyncModel.createSyncHistory(userId, "github", "failed", {
        itemsSynced: 0,
        errorMessage: error.message,
        completedAt: new Date(),
      });
      throw error;
    }
  }

  static async syncStackOverflow(userId, stackOverflowUserId) {
    try {
      const stackOverflowData = await this.fetchStackOverflowData(stackOverflowUserId);
      
      // Store sync data
      await PortfolioSyncModel.upsertSyncData(userId, "stackoverflow", "answer", stackOverflowData.answers);
      await PortfolioSyncModel.upsertSyncData(userId, "stackoverflow", "tag", stackOverflowData.tags);

      // Calculate and store skills
      const skills = await this.calculateStackOverflowSkills(stackOverflowData.tags, stackOverflowData.answers);
      await PortfolioSyncModel.upsertSkillScores(userId, "stackoverflow", skills);

      // Create sync history
      await PortfolioSyncModel.createSyncHistory(userId, "stackoverflow", "success", {
        itemsSynced: stackOverflowData.answers.length + stackOverflowData.tags.length,
        itemsUpdated: stackOverflowData.answers.length,
        completedAt: new Date(),
      });

      return {
        success: true,
        data: stackOverflowData,
        skills,
      };
    } catch (error) {
      await PortfolioSyncModel.createSyncHistory(userId, "stackoverflow", "failed", {
        itemsSynced: 0,
        errorMessage: error.message,
        completedAt: new Date(),
      });
      throw error;
    }
  }

  static async syncPortfolio(userId, portfolioUrl) {
    try {
      // For now, portfolio sync is manual - user provides URL
      // In future, can add web scraping to extract skills
      const portfolioSkills = await this.fetchPortfolioSkills(portfolioUrl);

      // Update user's portfolio score based on overall skills
      const overallSkills = await PortfolioSyncModel.getOverallSkillScore(userId);
      const portfolioScore = overallSkills.overallScore;

      // Update user's portfolio score
      await UserModel.updateUserById(userId, { portfolioScore });

      return {
        success: true,
        portfolioScore,
        skills: overallSkills.skills,
      };
    } catch (error) {
      throw error;
    }
  }

  static async syncAll(userId) {
    const results = {
      github: null,
      stackoverflow: null,
      portfolio: null,
      errors: [],
    };

    // Sync GitHub
    try {
      results.github = await this.syncGitHub(userId);
    } catch (error) {
      results.errors.push({ platform: "github", error: error.message });
    }

    // Sync StackOverflow (if user has connected)
    try {
      const user = await UserModel.getUserById(userId);
      if (user?.stackoverflowUrl) {
        // Extract user ID from StackOverflow URL
        const match = user.stackoverflowUrl.match(/\/users\/(\d+)/);
        if (match && match[1]) {
          results.stackoverflow = await this.syncStackOverflow(userId, match[1]);
        }
      }
    } catch (error) {
      results.errors.push({ platform: "stackoverflow", error: error.message });
    }

    // Sync Portfolio
    try {
      const user = await UserModel.getUserById(userId);
      if (user?.portfolioUrl) {
        results.portfolio = await this.syncPortfolio(userId, user.portfolioUrl);
      }
    } catch (error) {
      results.errors.push({ platform: "portfolio", error: error.message });
    }

    return results;
  }
}

module.exports = { PortfolioSyncService };

