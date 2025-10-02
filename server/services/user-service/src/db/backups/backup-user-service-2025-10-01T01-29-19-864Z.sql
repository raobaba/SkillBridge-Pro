-- Database backup created at 2025-10-01T01:29:19.979Z for user-service

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

