-- Database backup created at 2025-10-01T01:26:22.601Z for settings-service

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

