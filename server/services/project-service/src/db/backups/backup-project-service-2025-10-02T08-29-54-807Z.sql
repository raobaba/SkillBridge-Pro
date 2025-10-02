-- Database backup created at 2025-10-02T08:29:54.904Z for project-service

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

