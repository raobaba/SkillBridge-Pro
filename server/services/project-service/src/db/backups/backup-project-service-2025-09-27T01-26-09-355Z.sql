-- Database backup created at 2025-09-27T01:26:09.479Z for project-service

-- Table: playing_with_neon
CREATE TABLE IF NOT EXISTS "playing_with_neon" (
  "id" integer NOT NULL DEFAULT nextval('playing_with_neon_id_seq'::regclass),
  "name" text NOT NULL,
  "value" real
);

-- Data for playing_with_neon
INSERT INTO "playing_with_neon" VALUES ('1', 'c4ca4238a0', '0.6150648');
INSERT INTO "playing_with_neon" VALUES ('2', 'c81e728d9d', '0.43602696');
INSERT INTO "playing_with_neon" VALUES ('3', 'eccbc87e4b', '0.10411993');
INSERT INTO "playing_with_neon" VALUES ('4', 'a87ff679a2', '0.5418204');
INSERT INTO "playing_with_neon" VALUES ('5', 'e4da3b7fbb', '0.09298487');
INSERT INTO "playing_with_neon" VALUES ('6', '1679091c5a', '0.07495373');
INSERT INTO "playing_with_neon" VALUES ('7', '8f14e45fce', '0.7811433');
INSERT INTO "playing_with_neon" VALUES ('8', 'c9f0f895fb', '0.9321972');
INSERT INTO "playing_with_neon" VALUES ('9', '45c48cce2e', '0.95572007');
INSERT INTO "playing_with_neon" VALUES ('10', 'd3d9446802', '0.5820877');

-- Table: project_applicants
CREATE TABLE IF NOT EXISTS "project_applicants" (
  "id" integer NOT NULL DEFAULT nextval('project_applicants_id_seq'::regclass),
  "project_id" integer NOT NULL,
  "user_id" integer NOT NULL,
  "status" USER-DEFINED NOT NULL DEFAULT 'applied'::applicant_status,
  "match_score" numeric,
  "rating" integer,
  "notes" text,
  "applied_at" timestamp without time zone DEFAULT now(),
  "updated_at" timestamp without time zone DEFAULT now()
);

-- Table: project_boosts
CREATE TABLE IF NOT EXISTS "project_boosts" (
  "id" integer NOT NULL DEFAULT nextval('project_boosts_id_seq'::regclass),
  "project_id" integer NOT NULL,
  "purchased_by" integer NOT NULL,
  "plan" USER-DEFINED NOT NULL DEFAULT 'basic'::boost_plan,
  "amount_cents" integer NOT NULL,
  "currency" character varying DEFAULT 'USD'::character varying,
  "start_at" timestamp without time zone NOT NULL,
  "end_at" timestamp without time zone NOT NULL,
  "created_at" timestamp without time zone DEFAULT now()
);

-- Table: project_files
CREATE TABLE IF NOT EXISTS "project_files" (
  "id" integer NOT NULL DEFAULT nextval('project_files_id_seq'::regclass),
  "project_id" integer NOT NULL,
  "uploader_id" integer NOT NULL,
  "name" text NOT NULL,
  "url" text NOT NULL,
  "mime_type" text,
  "size_kb" integer,
  "uploaded_at" timestamp without time zone DEFAULT now()
);

-- Table: project_invites
CREATE TABLE IF NOT EXISTS "project_invites" (
  "id" integer NOT NULL DEFAULT nextval('project_invites_id_seq'::regclass),
  "project_id" integer NOT NULL,
  "invited_email" text NOT NULL,
  "invited_user_id" integer,
  "role" text,
  "message" text,
  "status" text DEFAULT 'pending'::text,
  "sent_at" timestamp without time zone DEFAULT now(),
  "responded_at" timestamp without time zone
);

-- Table: project_reviews
CREATE TABLE IF NOT EXISTS "project_reviews" (
  "id" integer NOT NULL DEFAULT nextval('project_reviews_id_seq'::regclass),
  "project_id" integer NOT NULL,
  "reviewer_id" integer NOT NULL,
  "rating" integer NOT NULL,
  "comment" text,
  "created_at" timestamp without time zone DEFAULT now()
);

-- Table: project_skills
CREATE TABLE IF NOT EXISTS "project_skills" (
  "id" integer NOT NULL DEFAULT nextval('project_skills_id_seq'::regclass),
  "project_id" integer NOT NULL,
  "name" text NOT NULL
);

-- Data for project_skills
INSERT INTO "project_skills" VALUES ('1', '1', 'React');
INSERT INTO "project_skills" VALUES ('2', '1', 'Node.js');
INSERT INTO "project_skills" VALUES ('3', '1', 'MongoDB');

-- Table: project_tags
CREATE TABLE IF NOT EXISTS "project_tags" (
  "id" integer NOT NULL DEFAULT nextval('project_tags_id_seq'::regclass),
  "project_id" integer NOT NULL,
  "name" text NOT NULL
);

-- Data for project_tags
INSERT INTO "project_tags" VALUES ('1', '1', 'ecommerce');
INSERT INTO "project_tags" VALUES ('2', '1', 'react');
INSERT INTO "project_tags" VALUES ('3', '1', 'nodejs');

-- Table: project_team
CREATE TABLE IF NOT EXISTS "project_team" (
  "id" integer NOT NULL DEFAULT nextval('project_team_id_seq'::regclass),
  "project_id" integer NOT NULL,
  "user_id" integer NOT NULL,
  "role" text,
  "joined_at" timestamp without time zone DEFAULT now()
);

-- Table: project_updates
CREATE TABLE IF NOT EXISTS "project_updates" (
  "id" integer NOT NULL DEFAULT nextval('project_updates_id_seq'::regclass),
  "project_id" integer NOT NULL,
  "author_id" integer NOT NULL,
  "type" text DEFAULT 'note'::text,
  "message" text NOT NULL,
  "created_at" timestamp without time zone DEFAULT now()
);

-- Table: projects
CREATE TABLE IF NOT EXISTS "projects" (
  "id" integer NOT NULL DEFAULT nextval('projects_id_seq'::regclass),
  "uuid" uuid NOT NULL DEFAULT gen_random_uuid(),
  "owner_id" integer NOT NULL,
  "title" text NOT NULL,
  "description" text NOT NULL,
  "role_needed" text NOT NULL,
  "status" USER-DEFINED NOT NULL DEFAULT 'draft'::project_status,
  "priority" USER-DEFINED DEFAULT 'medium'::priority,
  "category" text,
  "experience_level" USER-DEFINED,
  "budget_min" integer,
  "budget_max" integer,
  "currency" character varying DEFAULT 'USD'::character varying,
  "is_remote" boolean DEFAULT true,
  "location" text,
  "duration" text,
  "start_date" timestamp without time zone,
  "deadline" timestamp without time zone,
  "requirements" text,
  "benefits" text,
  "company" text,
  "website" text,
  "featured_until" timestamp without time zone,
  "is_urgent" boolean DEFAULT false,
  "is_featured" boolean DEFAULT false,
  "max_applicants" integer,
  "language" text DEFAULT 'English'::text,
  "timezone" text,
  "match_score_avg" integer DEFAULT 0,
  "rating_avg" numeric DEFAULT '0'::numeric,
  "rating_count" integer DEFAULT 0,
  "applicants_count" integer DEFAULT 0,
  "new_applicants_count" integer DEFAULT 0,
  "is_deleted" boolean NOT NULL DEFAULT false,
  "created_at" timestamp without time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp without time zone NOT NULL DEFAULT now()
);

-- Data for projects
INSERT INTO "projects" VALUES ('1', '076216c4-fe75-4cb6-98b4-5ebedd645d9a', '1', 'E-commerce Application Development', 'Build a modern e-commerce platform with React and Node.js', 'Full Stack Developer', 'draft', 'medium', 'Web Development', 'mid', '5000', '15000', 'USD', 'true', 'Remote', '3 months', 'Mon Jan 15 2024 00:00:00 GMT+0530 (India Standard Time)', 'Mon Apr 15 2024 00:00:00 GMT+0530 (India Standard Time)', '3+ years React experience, Node.js knowledge', 'Flexible hours, learning opportunities', 'TechCorp Inc.', 'https://techcorp.com', NULL, 'false', 'false', '10', 'English', 'UTC-5', '0', '0', '0', '0', '0', 'false', 'Sat Sep 27 2025 00:23:46 GMT+0530 (India Standard Time)', 'Sat Sep 27 2025 00:28:45 GMT+0530 (India Standard Time)');

-- Table: users
CREATE TABLE IF NOT EXISTS "users" (
  "id" integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
  "uuid" uuid NOT NULL DEFAULT gen_random_uuid(),
  "name" text NOT NULL,
  "email" text NOT NULL,
  "password" character varying,
  "oauth_provider" text,
  "oauth_id" text,
  "bio" text,
  "avatar_url" text,
  "domain_preferences" text,
  "skills" json,
  "experience" text,
  "location" text,
  "availability" text,
  "resume_url" text,
  "xp" integer DEFAULT 0,
  "badges" json DEFAULT '[]'::json,
  "level" integer DEFAULT 1,
  "github_url" text,
  "linkedin_url" text,
  "stackoverflow_url" text,
  "portfolio_url" text,
  "portfolio_score" integer,
  "is_email_verified" boolean DEFAULT false,
  "reset_password_token" text,
  "reset_password_expire" timestamp without time zone,
  "notification_prefs" json DEFAULT '{}'::json,
  "role" USER-DEFINED NOT NULL DEFAULT 'developer'::role,
  "is_deleted" boolean NOT NULL DEFAULT false,
  "created_at" timestamp without time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp without time zone NOT NULL DEFAULT now()
);

-- Data for users
INSERT INTO "users" VALUES ('1', '7cc8d883-23a3-4a56-9afe-39ba03d5aa79', 'Rajan Kumar', 'raorajan9576@gmail.com', '$2b$10$Ew9lKCbAxB8yv96znoccs.A/N7wK92HOhXEOvoXWcUxcBYLyXIhOS', NULL, NULL, NULL, NULL, NULL, NULL, '3 years', NULL, 'full-time', NULL, '0', '', '1', NULL, NULL, NULL, NULL, NULL, 'true', NULL, NULL, '[object Object]', 'developer', 'false', 'Sat Sep 27 2025 00:21:00 GMT+0530 (India Standard Time)', 'Sat Sep 27 2025 00:22:17 GMT+0530 (India Standard Time)');

