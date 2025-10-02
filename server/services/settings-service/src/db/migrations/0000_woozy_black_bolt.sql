CREATE TABLE "user_subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"plan" text DEFAULT 'Free' NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"current_period_start" timestamp,
	"current_period_end" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_notification_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"email" boolean DEFAULT true NOT NULL,
	"sms" boolean DEFAULT false NOT NULL,
	"push" boolean DEFAULT true NOT NULL,
	"reminders" boolean DEFAULT true NOT NULL,
	"project_updates" boolean DEFAULT true NOT NULL,
	"xp_notifications" boolean DEFAULT true NOT NULL,
	"ai_suggestions" boolean DEFAULT true NOT NULL,
	"profile_reminders" boolean DEFAULT false NOT NULL,
	"security_alerts" boolean DEFAULT true NOT NULL,
	"sound_enabled" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_notification_frequency" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"email_frequency" text DEFAULT 'daily' NOT NULL,
	"push_frequency" text DEFAULT 'immediate' NOT NULL,
	"reminders_frequency" text DEFAULT 'weekly' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_quiet_hours" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"enabled" boolean DEFAULT false NOT NULL,
	"start" time,
	"end" time,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_privacy_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"profile_public" boolean DEFAULT true NOT NULL,
	"data_sharing" boolean DEFAULT false NOT NULL,
	"search_visibility" boolean DEFAULT true NOT NULL,
	"personalized_ads" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_integrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"github" boolean DEFAULT false NOT NULL,
	"linkedin" boolean DEFAULT false NOT NULL,
	"google_calendar" boolean DEFAULT true NOT NULL,
	"github_connected_at" timestamp,
	"linkedin_connected_at" timestamp,
	"google_calendar_connected_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
