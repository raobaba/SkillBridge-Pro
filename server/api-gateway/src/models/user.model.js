// src/models/user.model.js

import { pgTable, serial, text, varchar, timestamp, boolean, integer, json, uuid } from "drizzle-orm/pg-core";

export const userTable = pgTable("users", {
  id: serial("id").primaryKey(),

  // Basic Auth Info
  uuid: uuid("uuid").defaultRandom().unique().notNull(), // for public referencing
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: varchar("password", { length: 255 }), // optional if OAuth
  oauthProvider: text("oauth_provider"), // e.g. 'google', 'github'
  oauthId: text("oauth_id"), // ID from OAuth provider

  // Profile Info
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  domainPreferences: text("domain_preferences"), // e.g. 'AI, Web3'
  skills: json("skills"), // array of { name, level }
  experience: text("experience"), // summary or rich text
  location: text("location"),
  availability: text("availability"), // e.g. 'full-time', 'part-time'
  resumeUrl: text("resume_url"), // link to uploaded or AI-enhanced resume

  // Gamification
  xp: integer("xp").default(0),
  badges: json("badges").default([]), // array of badge names or objects
  level: integer("level").default(1),

  // Integrations
  githubUrl: text("github_url"),
  linkedinUrl: text("linkedin_url"),
  stackoverflowUrl: text("stackoverflow_url"),
  portfolioScore: integer("portfolio_score"), // based on integrations

  // Settings
  isEmailVerified: boolean("is_email_verified").default(false),
  notificationPrefs: json("notification_prefs").default({}), // e.g. { email: true, sms: false }

  // Meta
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
