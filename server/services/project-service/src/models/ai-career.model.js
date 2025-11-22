const {
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
  boolean,
  integer,
  jsonb,
  numeric,
  pgEnum,
} = require("drizzle-orm/pg-core");
const { eq, and, desc, or, gte, lte, asc } = require("drizzle-orm");
const { db } = require("../config/database");

// Enums
const recommendationTypeEnum = pgEnum("recommendation_type", [
  "career_path",
  "skill_development",
  "project_match",
  "learning_path",
]);

const priorityEnum = pgEnum("priority_level", ["low", "medium", "high", "critical"]);

const impactEnum = pgEnum("impact_level", ["low", "medium", "high", "critical"]);

// Career Recommendations Table
const careerRecommendationsTable = pgTable("career_recommendations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // FK -> users.id
  title: text("title").notNull(),
  description: text("description").notNull(),
  matchScore: integer("match_score").notNull(), // 0-100
  category: text("category"),
  skills: jsonb("skills").default([]), // Array of skills
  growth: varchar("growth", { length: 20 }), // e.g., "+15%"
  salary: text("salary"), // e.g., "$80k - $120k"
  icon: varchar("icon", { length: 10 }),
  type: recommendationTypeEnum("type").default("career_path"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Resume Suggestions Table
const resumeSuggestionsTable = pgTable("resume_suggestions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // FK -> users.id
  text: text("text").notNull(),
  category: text("category").notNull(), // e.g., "Content", "Keywords", "Customization"
  priority: priorityEnum("priority").default("medium"),
  icon: varchar("icon", { length: 10 }),
  isApplied: boolean("is_applied").default(false),
  appliedAt: timestamp("applied_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Skill Gap Analysis Table
const skillGapsTable = pgTable("skill_gaps", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // FK -> users.id
  skill: text("skill").notNull(),
  requiredLevel: text("required_level").notNull(), // e.g., "Intermediate", "Advanced"
  currentLevel: text("current_level").notNull(), // e.g., "Beginner", "Intermediate"
  category: text("category"), // e.g., "DevOps", "Cloud", "Architecture"
  gapLevel: text("gap_level").notNull(), // "Low", "Medium", "High"
  progress: integer("progress").default(0), // 0-100
  icon: varchar("icon", { length: 10 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Developer Matches Table (for project owners)
const developerMatchesTable = pgTable("developer_matches", {
  id: serial("id").primaryKey(),
  projectOwnerId: integer("project_owner_id").notNull(), // FK -> users.id
  projectId: integer("project_id"), // FK -> projects.id (optional)
  developerId: integer("developer_id").notNull(), // FK -> users.id
  matchScore: integer("match_score").notNull(), // 0-100
  skills: jsonb("skills").default([]), // Array of matching skills
  experience: text("experience"),
  availability: text("availability"), // e.g., "Available", "Part-time"
  rate: text("rate"), // e.g., "$75/hour"
  location: text("location"),
  highlights: jsonb("highlights").default([]), // Array of highlight strings
  isContacted: boolean("is_contacted").default(false),
  contactedAt: timestamp("contacted_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Project Optimizations Table
const projectOptimizationsTable = pgTable("project_optimizations", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(), // FK -> projects.id
  projectOwnerId: integer("project_owner_id").notNull(), // FK -> users.id
  title: text("title").notNull(),
  description: text("description").notNull(),
  impact: impactEnum("impact").default("medium"),
  category: text("category").notNull(), // e.g., "Content", "Matching", "Marketing"
  suggestions: jsonb("suggestions").default([]), // Array of suggestion strings
  icon: varchar("icon", { length: 10 }),
  isApplied: boolean("is_applied").default(false),
  appliedAt: timestamp("applied_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Skill Trends Table (for admins)
const skillTrendsTable = pgTable("skill_trends", {
  id: serial("id").primaryKey(),
  skill: text("skill").notNull().unique(),
  demand: integer("demand").notNull(), // 0-100
  growth: varchar("growth", { length: 20 }), // e.g., "+12%"
  trend: varchar("trend", { length: 10 }).default("up"), // "up", "down", "stable"
  category: text("category"), // e.g., "Frontend", "Backend", "DevOps"
  projectsCount: integer("projects_count").default(0),
  developersCount: integer("developers_count").default(0),
  icon: varchar("icon", { length: 10 }),
  color: varchar("color", { length: 50 }), // Tailwind color classes
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Platform Insights Table (for admins)
const platformInsightsTable = pgTable("platform_insights", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  impact: impactEnum("impact").default("medium"),
  recommendation: text("recommendation"),
  category: text("category"), // e.g., "User Behavior", "Project Quality"
  metrics: jsonb("metrics").default({}), // Object with various metrics
  icon: varchar("icon", { length: 10 }),
  isResolved: boolean("is_resolved").default(false),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Team Analysis Table (for project owners)
const teamAnalysisTable = pgTable("team_analysis", {
  id: serial("id").primaryKey(),
  projectOwnerId: integer("project_owner_id").notNull(), // FK -> users.id
  projectId: integer("project_id"), // FK -> projects.id (optional)
  skill: text("skill").notNull(),
  currentCount: integer("current_count").default(0),
  neededCount: integer("needed_count").notNull(),
  gap: integer("gap").notNull(), // neededCount - currentCount
  priority: priorityEnum("priority").default("medium"),
  category: text("category"), // e.g., "Development", "Infrastructure", "Design"
  suggestions: jsonb("suggestions").default([]), // Array of suggestion strings
  icon: varchar("icon", { length: 10 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Model Classes
class CareerRecommendationsModel {
  static async createRecommendation(data) {
    const [recommendation] = await db
      .insert(careerRecommendationsTable)
      .values({
        userId: data.userId,
        title: data.title,
        description: data.description,
        matchScore: data.matchScore || 0,
        category: data.category,
        skills: data.skills || [],
        growth: data.growth,
        salary: data.salary,
        icon: data.icon,
        type: data.type || "career_path",
      })
      .returning();
    return recommendation;
  }

  static async getRecommendationsByUserId(userId, limit = 10) {
    return await db
      .select()
      .from(careerRecommendationsTable)
      .where(and(eq(careerRecommendationsTable.userId, userId), eq(careerRecommendationsTable.isActive, true)))
      .orderBy(desc(careerRecommendationsTable.matchScore))
      .limit(limit);
  }

  static async deactivateOldRecommendations(userId) {
    await db
      .update(careerRecommendationsTable)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(careerRecommendationsTable.userId, userId));
  }
}

class ResumeSuggestionsModel {
  static async createSuggestion(data) {
    const [suggestion] = await db
      .insert(resumeSuggestionsTable)
      .values({
        userId: data.userId,
        text: data.text,
        category: data.category,
        priority: data.priority || "medium",
        icon: data.icon,
      })
      .returning();
    return suggestion;
  }

  static async getSuggestionsByUserId(userId, limit = 10) {
    return await db
      .select()
      .from(resumeSuggestionsTable)
      .where(eq(resumeSuggestionsTable.userId, userId))
      .orderBy(desc(resumeSuggestionsTable.createdAt))
      .limit(limit);
  }

  static async markAsApplied(id) {
    const [suggestion] = await db
      .update(resumeSuggestionsTable)
      .set({ isApplied: true, appliedAt: new Date(), updatedAt: new Date() })
      .where(eq(resumeSuggestionsTable.id, id))
      .returning();
    return suggestion;
  }
}

class SkillGapsModel {
  static async createSkillGap(data) {
    const [skillGap] = await db
      .insert(skillGapsTable)
      .values({
        userId: data.userId,
        skill: data.skill,
        requiredLevel: data.requiredLevel,
        currentLevel: data.currentLevel,
        category: data.category,
        gapLevel: data.gapLevel,
        progress: data.progress || 0,
        icon: data.icon,
      })
      .returning();
    return skillGap;
  }

  static async getSkillGapsByUserId(userId, limit = 10) {
    return await db
      .select()
      .from(skillGapsTable)
      .where(eq(skillGapsTable.userId, userId))
      .orderBy(desc(skillGapsTable.createdAt))
      .limit(limit);
  }

  static async updateProgress(id, progress) {
    const [skillGap] = await db
      .update(skillGapsTable)
      .set({ progress, updatedAt: new Date() })
      .where(eq(skillGapsTable.id, id))
      .returning();
    return skillGap;
  }
}

class DeveloperMatchesModel {
  static async createMatch(data) {
    const [match] = await db
      .insert(developerMatchesTable)
      .values({
        projectOwnerId: data.projectOwnerId,
        projectId: data.projectId,
        developerId: data.developerId,
        matchScore: data.matchScore,
        skills: data.skills || [],
        experience: data.experience,
        availability: data.availability,
        rate: data.rate,
        location: data.location,
        highlights: data.highlights || [],
      })
      .returning();
    return match;
  }

  static async getMatchesByProjectOwner(projectOwnerId, projectId = null, limit = 10) {
    const conditions = [eq(developerMatchesTable.projectOwnerId, projectOwnerId)];
    if (projectId) {
      conditions.push(eq(developerMatchesTable.projectId, projectId));
    }
    return await db
      .select()
      .from(developerMatchesTable)
      .where(and(...conditions))
      .orderBy(desc(developerMatchesTable.matchScore))
      .limit(limit);
  }

  static async markAsContacted(id) {
    const [match] = await db
      .update(developerMatchesTable)
      .set({ isContacted: true, contactedAt: new Date(), updatedAt: new Date() })
      .where(eq(developerMatchesTable.id, id))
      .returning();
    return match;
  }
}

class ProjectOptimizationsModel {
  static async createOptimization(data) {
    const [optimization] = await db
      .insert(projectOptimizationsTable)
      .values({
        projectId: data.projectId,
        projectOwnerId: data.projectOwnerId,
        title: data.title,
        description: data.description,
        impact: data.impact || "medium",
        category: data.category,
        suggestions: data.suggestions || [],
        icon: data.icon,
      })
      .returning();
    return optimization;
  }

  static async getOptimizationsByProjectId(projectId, limit = 10) {
    return await db
      .select()
      .from(projectOptimizationsTable)
      .where(eq(projectOptimizationsTable.projectId, projectId))
      .orderBy(desc(projectOptimizationsTable.createdAt))
      .limit(limit);
  }

  static async markAsApplied(id) {
    const [optimization] = await db
      .update(projectOptimizationsTable)
      .set({ isApplied: true, appliedAt: new Date(), updatedAt: new Date() })
      .where(eq(projectOptimizationsTable.id, id))
      .returning();
    return optimization;
  }
}

class SkillTrendsModel {
  static async createOrUpdateTrend(data) {
    const existing = await db
      .select()
      .from(skillTrendsTable)
      .where(eq(skillTrendsTable.skill, data.skill))
      .limit(1);

    if (existing.length > 0) {
      const [trend] = await db
        .update(skillTrendsTable)
        .set({
          demand: data.demand,
          growth: data.growth,
          trend: data.trend || "up",
          category: data.category,
          projectsCount: data.projectsCount || 0,
          developersCount: data.developersCount || 0,
          icon: data.icon,
          color: data.color,
          lastUpdated: new Date(),
        })
        .where(eq(skillTrendsTable.skill, data.skill))
        .returning();
      return trend;
    } else {
      const [trend] = await db
        .insert(skillTrendsTable)
        .values({
          skill: data.skill,
          demand: data.demand,
          growth: data.growth,
          trend: data.trend || "up",
          category: data.category,
          projectsCount: data.projectsCount || 0,
          developersCount: data.developersCount || 0,
          icon: data.icon,
          color: data.color,
        })
        .returning();
      return trend;
    }
  }

  static async getAllTrends(limit = 20) {
    return await db
      .select()
      .from(skillTrendsTable)
      .orderBy(desc(skillTrendsTable.demand))
      .limit(limit);
  }
}

class PlatformInsightsModel {
  static async createInsight(data) {
    const [insight] = await db
      .insert(platformInsightsTable)
      .values({
        title: data.title,
        description: data.description,
        impact: data.impact || "medium",
        recommendation: data.recommendation,
        category: data.category,
        metrics: data.metrics || {},
        icon: data.icon,
      })
      .returning();
    return insight;
  }

  static async getAllInsights(limit = 20) {
    return await db
      .select()
      .from(platformInsightsTable)
      .where(eq(platformInsightsTable.isResolved, false))
      .orderBy(desc(platformInsightsTable.createdAt))
      .limit(limit);
  }

  static async markAsResolved(id) {
    const [insight] = await db
      .update(platformInsightsTable)
      .set({ isResolved: true, resolvedAt: new Date(), updatedAt: new Date() })
      .where(eq(platformInsightsTable.id, id))
      .returning();
    return insight;
  }
}

class TeamAnalysisModel {
  static async createAnalysis(data) {
    const [analysis] = await db
      .insert(teamAnalysisTable)
      .values({
        projectOwnerId: data.projectOwnerId,
        projectId: data.projectId,
        skill: data.skill,
        currentCount: data.currentCount || 0,
        neededCount: data.neededCount,
        gap: data.gap || (data.neededCount - (data.currentCount || 0)),
        priority: data.priority || "medium",
        category: data.category,
        suggestions: data.suggestions || [],
        icon: data.icon,
      })
      .returning();
    return analysis;
  }

  static async getAnalysisByProjectOwner(projectOwnerId, projectId = null, limit = 10) {
    const conditions = [eq(teamAnalysisTable.projectOwnerId, projectOwnerId)];
    if (projectId) {
      conditions.push(eq(teamAnalysisTable.projectId, projectId));
    }
    return await db
      .select()
      .from(teamAnalysisTable)
      .where(and(...conditions))
      .orderBy(desc(teamAnalysisTable.priority), desc(teamAnalysisTable.gap))
      .limit(limit);
  }
}

module.exports = {
  // Tables
  careerRecommendationsTable,
  resumeSuggestionsTable,
  skillGapsTable,
  developerMatchesTable,
  projectOptimizationsTable,
  skillTrendsTable,
  platformInsightsTable,
  teamAnalysisTable,
  // Models
  CareerRecommendationsModel,
  ResumeSuggestionsModel,
  SkillGapsModel,
  DeveloperMatchesModel,
  ProjectOptimizationsModel,
  SkillTrendsModel,
  PlatformInsightsModel,
  TeamAnalysisModel,
};

