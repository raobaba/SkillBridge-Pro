-- Database backup created at 2025-10-02T08:41:56.327Z for project-service

-- Table: project_analytics
CREATE TABLE IF NOT EXISTS "project_analytics" (
  "id" integer NOT NULL DEFAULT nextval('project_analytics_id_seq'::regclass),
  "project_id" integer NOT NULL,
  "metric_name" text NOT NULL,
  "metric_value" numeric NOT NULL,
  "metric_date" date NOT NULL,
  "created_at" timestamp without time zone DEFAULT now()
);

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

-- Table: project_collaborators
CREATE TABLE IF NOT EXISTS "project_collaborators" (
  "id" integer NOT NULL DEFAULT nextval('project_collaborators_id_seq'::regclass),
  "project_id" integer NOT NULL,
  "user_id" integer NOT NULL,
  "role" text NOT NULL,
  "permissions" ARRAY,
  "invited_by" integer NOT NULL,
  "invited_at" timestamp without time zone DEFAULT now(),
  "accepted_at" timestamp without time zone,
  "status" text DEFAULT 'pending'::text
);

-- Table: project_comments
CREATE TABLE IF NOT EXISTS "project_comments" (
  "id" integer NOT NULL DEFAULT nextval('project_comments_id_seq'::regclass),
  "project_id" integer NOT NULL,
  "user_id" integer NOT NULL,
  "parent_id" integer,
  "content" text NOT NULL,
  "is_edited" boolean DEFAULT false,
  "edited_at" timestamp without time zone,
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
  "description" text,
  "category" text DEFAULT 'other'::text,
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

-- Table: project_milestones
CREATE TABLE IF NOT EXISTS "project_milestones" (
  "id" integer NOT NULL DEFAULT nextval('project_milestones_id_seq'::regclass),
  "project_id" integer NOT NULL,
  "title" text NOT NULL,
  "description" text,
  "due_date" timestamp without time zone,
  "completed_at" timestamp without time zone,
  "is_completed" boolean DEFAULT false,
  "created_at" timestamp without time zone DEFAULT now()
);

-- Table: project_notifications
CREATE TABLE IF NOT EXISTS "project_notifications" (
  "id" integer NOT NULL DEFAULT nextval('project_notifications_id_seq'::regclass),
  "project_id" integer NOT NULL,
  "user_id" integer NOT NULL,
  "type" text NOT NULL,
  "title" text NOT NULL,
  "message" text NOT NULL,
  "is_read" boolean DEFAULT false,
  "created_at" timestamp without time zone DEFAULT now()
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
INSERT INTO "project_skills" VALUES ('1', '2', 'React');
INSERT INTO "project_skills" VALUES ('2', '2', 'Node.js');
INSERT INTO "project_skills" VALUES ('3', '2', 'MongoDB');

-- Table: project_tags
CREATE TABLE IF NOT EXISTS "project_tags" (
  "id" integer NOT NULL DEFAULT nextval('project_tags_id_seq'::regclass),
  "project_id" integer NOT NULL,
  "name" text NOT NULL
);

-- Data for project_tags
INSERT INTO "project_tags" VALUES ('1', '2', 'ecommerce');
INSERT INTO "project_tags" VALUES ('2', '2', 'react');
INSERT INTO "project_tags" VALUES ('3', '2', 'nodejs');

-- Table: project_tasks
CREATE TABLE IF NOT EXISTS "project_tasks" (
  "id" integer NOT NULL DEFAULT nextval('project_tasks_id_seq'::regclass),
  "project_id" integer NOT NULL,
  "milestone_id" integer,
  "assigned_to" integer,
  "title" text NOT NULL,
  "description" text,
  "priority" text DEFAULT 'medium'::text,
  "status" text DEFAULT 'todo'::text,
  "due_date" timestamp without time zone,
  "completed_at" timestamp without time zone,
  "created_at" timestamp without time zone DEFAULT now()
);

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
  "subcategory" text,
  "contact_email" text,
  "contact_phone" text,
  "color" character varying DEFAULT '#7f00ff'::character varying,
  "progress" integer DEFAULT 0,
  "work_arrangement" text DEFAULT 'remote'::text,
  "visibility" text DEFAULT 'public'::text,
  "payment_terms" text DEFAULT 'fixed'::text,
  "activity_count" integer DEFAULT 0,
  "views_count" integer DEFAULT 0,
  "favorites_count" integer DEFAULT 0,
  "shares_count" integer DEFAULT 0,
  "disputes_count" integer DEFAULT 0,
  "is_flagged" boolean DEFAULT false,
  "is_verified" boolean DEFAULT false,
  "is_suspended" boolean DEFAULT false,
  "suspension_reason" text,
  "verification_notes" text,
  "last_activity_at" timestamp without time zone,
  "boost_level" integer DEFAULT 0,
  "is_deleted" boolean NOT NULL DEFAULT false,
  "created_at" timestamp without time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp without time zone NOT NULL DEFAULT now()
);

-- Data for projects
INSERT INTO "projects" VALUES ('2', '9fb88890-68f0-40c0-a842-26a124930c6c', '1', 'E-commerce Website Development', 'Build a modern e-commerce platform with React and Node.js', 'Full Stack Developer', 'draft', 'medium', 'Web Development', 'mid', '5000', '15000', 'USD', 'true', 'Remote', '3 months', 'Mon Jan 15 2024 00:00:00 GMT+0530 (India Standard Time)', 'Mon Apr 15 2024 00:00:00 GMT+0530 (India Standard Time)', '3+ years React experience, Node.js knowledge', 'Flexible hours, learning opportunities', 'TechCorp Inc.', 'https://techcorp.com', NULL, 'false', 'false', '10', 'English', 'UTC-5', '0', '0', '0', '0', '0', NULL, NULL, NULL, '#7f00ff', '0', 'remote', 'public', 'fixed', '0', '0', '0', '0', '0', 'false', 'false', 'false', NULL, NULL, NULL, '0', 'false', 'Thu Oct 02 2025 08:32:51 GMT+0530 (India Standard Time)', 'Thu Oct 02 2025 08:32:51 GMT+0530 (India Standard Time)');

-- Table: user_integrations
CREATE TABLE IF NOT EXISTS "user_integrations" (
  "id" integer NOT NULL DEFAULT nextval('user_integrations_id_seq'::regclass),
  "user_id" integer,
  "github" boolean NOT NULL DEFAULT false,
  "linkedin" boolean NOT NULL DEFAULT false,
  "google_calendar" boolean NOT NULL DEFAULT true,
  "github_connected_at" timestamp without time zone,
  "linkedin_connected_at" timestamp without time zone,
  "google_calendar_connected_at" timestamp without time zone,
  "created_at" timestamp without time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp without time zone NOT NULL DEFAULT now()
);

-- Table: user_notification_frequency
CREATE TABLE IF NOT EXISTS "user_notification_frequency" (
  "id" integer NOT NULL DEFAULT nextval('user_notification_frequency_id_seq'::regclass),
  "user_id" integer,
  "email_frequency" text NOT NULL DEFAULT 'daily'::text,
  "push_frequency" text NOT NULL DEFAULT 'immediate'::text,
  "reminders_frequency" text NOT NULL DEFAULT 'weekly'::text,
  "created_at" timestamp without time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp without time zone NOT NULL DEFAULT now()
);

-- Table: user_notification_settings
CREATE TABLE IF NOT EXISTS "user_notification_settings" (
  "id" integer NOT NULL DEFAULT nextval('user_notification_settings_id_seq'::regclass),
  "user_id" integer,
  "email" boolean NOT NULL DEFAULT true,
  "sms" boolean NOT NULL DEFAULT false,
  "push" boolean NOT NULL DEFAULT true,
  "reminders" boolean NOT NULL DEFAULT true,
  "project_updates" boolean NOT NULL DEFAULT true,
  "xp_notifications" boolean NOT NULL DEFAULT true,
  "ai_suggestions" boolean NOT NULL DEFAULT true,
  "profile_reminders" boolean NOT NULL DEFAULT false,
  "security_alerts" boolean NOT NULL DEFAULT true,
  "sound_enabled" boolean NOT NULL DEFAULT true,
  "created_at" timestamp without time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp without time zone NOT NULL DEFAULT now()
);

-- Table: user_privacy_settings
CREATE TABLE IF NOT EXISTS "user_privacy_settings" (
  "id" integer NOT NULL DEFAULT nextval('user_privacy_settings_id_seq'::regclass),
  "user_id" integer,
  "profile_public" boolean NOT NULL DEFAULT true,
  "data_sharing" boolean NOT NULL DEFAULT false,
  "search_visibility" boolean NOT NULL DEFAULT true,
  "personalized_ads" boolean NOT NULL DEFAULT false,
  "created_at" timestamp without time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp without time zone NOT NULL DEFAULT now()
);

-- Table: user_quiet_hours
CREATE TABLE IF NOT EXISTS "user_quiet_hours" (
  "id" integer NOT NULL DEFAULT nextval('user_quiet_hours_id_seq'::regclass),
  "user_id" integer,
  "enabled" boolean NOT NULL DEFAULT false,
  "start" time without time zone,
  "end" time without time zone,
  "created_at" timestamp without time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp without time zone NOT NULL DEFAULT now()
);

-- Table: user_subscriptions
CREATE TABLE IF NOT EXISTS "user_subscriptions" (
  "id" integer NOT NULL DEFAULT nextval('user_subscriptions_id_seq'::regclass),
  "user_id" integer NOT NULL,
  "plan" text NOT NULL DEFAULT 'Free'::text,
  "status" text NOT NULL DEFAULT 'active'::text,
  "current_period_start" timestamp without time zone,
  "current_period_end" timestamp without time zone,
  "created_at" timestamp without time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp without time zone NOT NULL DEFAULT now()
);

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
INSERT INTO "users" VALUES ('3', '1089f056-ca3c-44e1-b1ab-2cacf862c6f0', 'Rajan Kumar', 'shrikishunr7@gmail.com', '$2b$10$gzRpJfe.5C7Re0cPz3P21e68gZDcqJn/9og70CYwy2MaLXknwRMMm', NULL, NULL, NULL, NULL, NULL, NULL, '2', NULL, 'full-time', NULL, '0', '', '1', NULL, NULL, NULL, NULL, NULL, 'true', NULL, NULL, '[object Object]', 'project-owner', 'false', 'Thu Oct 02 2025 03:59:24 GMT+0530 (India Standard Time)', 'Thu Oct 02 2025 03:59:37 GMT+0530 (India Standard Time)');
INSERT INTO "users" VALUES ('4', '2b828963-6830-47f2-a0fb-e029ea06ff1e', 'Admin Role', 'nexthire6@gmail.com', '$2b$10$e96OpO6Z5B30qEtUq.TNQO6DMkglbLvGZXyEk0hJOSBYgU9RnkHTu', NULL, NULL, NULL, NULL, NULL, NULL, '2', NULL, 'full-time', NULL, '0', '', '1', NULL, NULL, NULL, NULL, NULL, 'true', NULL, NULL, '[object Object]', 'admin', 'false', 'Thu Oct 02 2025 04:01:20 GMT+0530 (India Standard Time)', 'Thu Oct 02 2025 04:01:32 GMT+0530 (India Standard Time)');
INSERT INTO "users" VALUES ('2', 'fd2d5e11-6c98-4b74-bcd2-498e08fd5ae8', 'Rajan Kumar', 'raorajan9576@gmail.com', '$2b$10$q6SftbdCrHLntLjOkYQRX.rrSyjQem1apfrqZ0FEGmpzFCf0IIFn2', NULL, NULL, NULL, NULL, NULL, NULL, '3 years', NULL, 'full-time', NULL, '0', '', '1', NULL, NULL, NULL, NULL, NULL, 'true', NULL, NULL, '[object Object]', 'developer', 'false', 'Wed Oct 01 2025 01:58:37 GMT+0530 (India Standard Time)', 'Thu Oct 02 2025 08:02:09 GMT+0530 (India Standard Time)');

