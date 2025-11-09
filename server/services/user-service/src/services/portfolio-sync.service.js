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

      // Fetch all languages for each repository
      const repositories = await Promise.all(
        reposResponse.data.map(async (repo) => {
          let allLanguages = {};
          try {
            // Fetch all languages used in this repository
            const languagesResponse = await axios.get(
              `${API_URLS.GITHUB_API_BASE_URL}/repos/${repo.full_name}/languages`,
              { headers }
            );
            allLanguages = languagesResponse.data || {}; // { "JavaScript": 12345, "Python": 6789, ... }
          } catch (error) {
            // If languages API fails, fallback to primary language
            console.log(`Error fetching languages for ${repo.full_name}:`, error.message);
            if (repo.language) {
              allLanguages = { [repo.language]: 0 }; // Use primary language as fallback
            }
          }

          return {
            id: repo.id,
            name: repo.name,
            fullName: repo.full_name,
            description: repo.description,
            url: repo.html_url,
            language: repo.language, // Primary language (for backward compatibility)
            languages: allLanguages, // All languages with byte counts
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            createdAt: repo.created_at,
            updatedAt: repo.updated_at,
            isPrivate: repo.private,
            metadata: {
              topics: repo.topics || [], // Tools, frameworks, technologies
              defaultBranch: repo.default_branch,
              size: repo.size,
              archived: repo.archived,
            },
          };
        })
      );

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
    const skillMap = {}; // Track all unique languages and tools

    // Analyze ALL languages and tools from repositories
    repositories.forEach((repo) => {
      // Extract all languages from repository (with byte counts)
      if (repo.languages && typeof repo.languages === 'object') {
        Object.keys(repo.languages).forEach((language) => {
          if (!skillMap[language]) {
            skillMap[language] = {
              repositories: new Set(), // Use Set to track unique repos
              stars: 0,
              totalBytes: 0,
              commits: 0,
              type: 'language', // Mark as language
            };
          }
          skillMap[language].repositories.add(repo.id); // Track unique repository IDs
          skillMap[language].totalBytes += repo.languages[language] || 0;
        });
      } else if (repo.language) {
        // Fallback to primary language if languages object not available
        if (!skillMap[repo.language]) {
          skillMap[repo.language] = {
            repositories: new Set(),
            stars: 0,
            totalBytes: 0,
            commits: 0,
            type: 'language',
          };
        }
        skillMap[repo.language].repositories.add(repo.id);
      }

      // Extract topics/tools (frameworks, technologies, etc.)
      if (repo.metadata?.topics && Array.isArray(repo.metadata.topics)) {
        repo.metadata.topics.forEach((topic) => {
          // Normalize topic name (capitalize first letter)
          const toolName = topic.charAt(0).toUpperCase() + topic.slice(1).toLowerCase();
          if (!skillMap[toolName]) {
            skillMap[toolName] = {
              repositories: new Set(),
              stars: 0,
              totalBytes: 0,
              commits: 0,
              type: 'tool', // Mark as tool/framework
            };
          }
          skillMap[toolName].repositories.add(repo.id);
        });
      }

      // Add stars to all languages/tools in this repository
      Object.keys(skillMap).forEach((skill) => {
        if (skillMap[skill].repositories.has(repo.id)) {
          skillMap[skill].stars += repo.stars;
        }
      });
    });

    // Convert Sets to counts and calculate scores
    const skills = {};
    const maxRepos = Math.max(...Object.values(skillMap).map((s) => s.repositories.size), 1);
    const maxStars = Math.max(...Object.values(skillMap).map((s) => s.stars), 1);
    const maxBytes = Math.max(...Object.values(skillMap).map((s) => s.totalBytes), 1);

    Object.entries(skillMap).forEach(([skillName, data]) => {
      const repoCount = data.repositories.size; // Number of unique repositories
      const repoScore = (repoCount / maxRepos) * 40; // 40% weight for repository count
      const starScore = (data.stars / maxStars) * 30; // 30% weight for stars
      const byteScore = data.type === 'language' && data.totalBytes > 0
        ? (data.totalBytes / maxBytes) * 30 // 30% weight for code bytes (languages only)
        : 0;
      
      const totalScore = Math.min(100, Math.round(repoScore + starScore + byteScore));

      skills[skillName] = {
        score: totalScore,
        level: PortfolioSyncModel.getLevelFromScore(totalScore),
        evidenceCount: repoCount, // Number of repositories using this skill
        type: data.type, // 'language' or 'tool'
      };
    });

    return skills;
  }

  // ========== StackOverflow Integration ==========
  /**
   * Extract StackOverflow user ID from URL
   * Supports multiple URL formats:
   * - https://stackoverflow.com/users/12345
   * - https://stackoverflow.com/users/12345/username
   * - https://stackoverflow.com/users/12345/username?tab=answers
   * - stackoverflow.com/users/12345
   */
  static extractStackOverflowUserId(url) {
    if (!url) return null;
    
    // Try to match various StackOverflow URL patterns
    const patterns = [
      /\/users\/(\d+)(?:\/|$|\?)/,  // Matches /users/12345 or /users/12345/ or /users/12345?
      /\/users\/(\d+)$/,            // Matches /users/12345 at end of string
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    // If URL is just a number, return it
    if (/^\d+$/.test(url.trim())) {
      return url.trim();
    }
    
    return null;
  }

  static async fetchStackOverflowData(userId) {
    try {
      // StackOverflow API v2.3
      const response = await axios.get(
        `${API_URLS.STACKOVERFLOW_API_BASE_URL}/users/${userId}?order=desc&sort=reputation&site=${API_URLS.STACKOVERFLOW_SITE}`
      );

      if (!response.data.items || response.data.items.length === 0) {
        throw new Error(`StackOverflow user ${userId} not found`);
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

      const answers = (answersResponse.data.items || []).map((answer) => ({
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

      const tags = (tagsResponse.data.items || []).map((tag) => ({
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
          profileUrl: user.link || `https://stackoverflow.com/users/${user.user_id}`,
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
        throw new Error("GitHub not connected. Please connect your GitHub account first.");
      }

      // Fetch GitHub user info to get username and profile URL
      let githubUsername = token.platformUsername;
      let githubProfileUrl = null;

      try {
        const userResponse = await axios.get(`${API_URLS.GITHUB_API_BASE_URL}/user`, {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        });
        githubUsername = userResponse.data.login;
        githubProfileUrl = userResponse.data.html_url;
      } catch (error) {
        console.warn("Could not fetch GitHub user info:", error.message);
      }

      const githubData = await this.fetchGitHubData(token.accessToken, githubUsername);
      
      // Update user's githubUrl if it's missing or incorrect
      const user = await UserModel.getUserById(userId);
      if (user && githubProfileUrl && (!user.githubUrl || !user.githubUrl.includes(githubUsername))) {
        await UserModel.updateUser(userId, {
          githubUrl: githubProfileUrl,
        });
      }
      
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
        githubUsername: githubUsername,
        completedAt: new Date(),
      });

      return {
        success: true,
        data: githubData,
        skills,
        githubUsername: githubUsername,
        githubUrl: githubProfileUrl,
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

  static async syncStackOverflow(userId, stackOverflowUserId = null) {
    try {
      // If userId not provided, try to get from integration token
      if (!stackOverflowUserId) {
        const token = await PortfolioSyncModel.getIntegrationToken(userId, "stackoverflow");
        if (token && token.platformUserId) {
          stackOverflowUserId = token.platformUserId;
        } else {
          // Fallback: try to extract from user's stackoverflowUrl
          const user = await UserModel.getUserById(userId);
          if (user?.stackoverflowUrl) {
            stackOverflowUserId = this.extractStackOverflowUserId(user.stackoverflowUrl);
          }
        }
      }

      if (!stackOverflowUserId) {
        throw new Error("StackOverflow user ID not found. Please connect StackOverflow integration or provide a valid StackOverflow URL.");
      }

      const stackOverflowData = await this.fetchStackOverflowData(stackOverflowUserId);
      
      // Update user's stackoverflowUrl if it's missing or incorrect
      const user = await UserModel.getUserById(userId);
      if (user && (!user.stackoverflowUrl || !user.stackoverflowUrl.includes(stackOverflowUserId))) {
        await UserModel.updateUser(userId, {
          stackoverflowUrl: stackOverflowData.user.profileUrl,
        });
      }
      
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
        stackOverflowUserId: stackOverflowUserId,
        completedAt: new Date(),
      });

      return {
        success: true,
        data: stackOverflowData,
        skills,
        stackOverflowUserId: stackOverflowUserId,
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

  /**
   * Validate portfolio URL format
   */
  static validatePortfolioUrl(url) {
    if (!url) return false;
    
    try {
      const urlObj = new URL(url);
      // Check if it's http or https
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch (error) {
      return false;
    }
  }

  static async syncPortfolio(userId, portfolioUrl = null) {
    try {
      // If portfolioUrl not provided, get from user profile
      if (!portfolioUrl) {
        const user = await UserModel.getUserById(userId);
        if (user?.portfolioUrl) {
          portfolioUrl = user.portfolioUrl;
        } else {
          throw new Error("Portfolio URL not found. Please add a portfolio URL to your profile.");
        }
      }

      // Validate portfolio URL
      if (!this.validatePortfolioUrl(portfolioUrl)) {
        throw new Error(`Invalid portfolio URL format: ${portfolioUrl}. Please provide a valid HTTP or HTTPS URL.`);
      }

      // For now, portfolio sync is manual - user provides URL
      // In future, can add web scraping to extract skills
      const portfolioSkills = await this.fetchPortfolioSkills(portfolioUrl);

      // Update user's portfolio score based on overall skills
      const overallSkills = await PortfolioSyncModel.getOverallSkillScore(userId);
      const portfolioScore = overallSkills.overallScore;

      // Update user's portfolio score
      await UserModel.updateUser(userId, { portfolioScore });

      // Create sync history
      await PortfolioSyncModel.createSyncHistory(userId, "portfolio", "success", {
        itemsSynced: 1,
        itemsUpdated: 1,
        portfolioUrl: portfolioUrl,
        completedAt: new Date(),
      });

      return {
        success: true,
        portfolioScore,
        skills: overallSkills.skills,
        portfolioUrl: portfolioUrl,
      };
    } catch (error) {
      await PortfolioSyncModel.createSyncHistory(userId, "portfolio", "failed", {
        itemsSynced: 0,
        errorMessage: error.message,
        completedAt: new Date(),
      });
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

    // Sync GitHub (if connected via integration token)
    try {
      const githubToken = await PortfolioSyncModel.getIntegrationToken(userId, "github");
      if (githubToken && githubToken.accessToken) {
        results.github = await this.syncGitHub(userId);
      } else {
        results.errors.push({ platform: "github", error: "GitHub not connected. Please connect your GitHub account first." });
      }
    } catch (error) {
      results.errors.push({ platform: "github", error: error.message });
    }

    // Sync StackOverflow (check integration token first, then fallback to URL)
    try {
      const stackOverflowToken = await PortfolioSyncModel.getIntegrationToken(userId, "stackoverflow");
      const user = await UserModel.getUserById(userId);
      
      // Try to sync if we have a token or a URL
      if (stackOverflowToken?.platformUserId || user?.stackoverflowUrl) {
        results.stackoverflow = await this.syncStackOverflow(userId);
      } else {
        results.errors.push({ platform: "stackoverflow", error: "StackOverflow not connected. Please connect your StackOverflow account or add a StackOverflow URL to your profile." });
      }
    } catch (error) {
      results.errors.push({ platform: "stackoverflow", error: error.message });
    }

    // Sync Portfolio (if URL is provided in profile)
    try {
      const user = await UserModel.getUserById(userId);
      if (user?.portfolioUrl) {
        results.portfolio = await this.syncPortfolio(userId, user.portfolioUrl);
      } else {
        results.errors.push({ platform: "portfolio", error: "Portfolio URL not found. Please add a portfolio URL to your profile." });
      }
    } catch (error) {
      results.errors.push({ platform: "portfolio", error: error.message });
    }

    return results;
  }
}

module.exports = { PortfolioSyncService };

