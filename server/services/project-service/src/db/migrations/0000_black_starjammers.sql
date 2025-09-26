CREATE TYPE "project_status" AS ENUM('draft', 'upcoming', 'active', 'paused', 'completed', 'cancelled');
CREATE TYPE "applicant_status" AS ENUM('applied', 'shortlisted', 'interviewing', 'rejected', 'accepted');
CREATE TYPE "priority" AS ENUM('low', 'medium', 'high');
CREATE TYPE "experience_level" AS ENUM('entry', 'mid', 'senior', 'lead');
CREATE TYPE "boost_plan" AS ENUM('basic', 'premium', 'spotlight');

CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"role_needed" text NOT NULL,
	"status" "project_status" DEFAULT 'draft' NOT NULL,
	"priority" "priority" DEFAULT 'medium',
	"category" text,
	"experience_level" "experience_level",
	"budget_min" integer,
	"budget_max" integer,
	"currency" varchar(8) DEFAULT 'USD',
	"is_remote" boolean DEFAULT true,
	"location" text,
	"duration" text,
	"start_date" timestamp,
	"deadline" timestamp,
	"requirements" text,
	"benefits" text,
	"company" text,
	"website" text,
	"featured_until" timestamp,
	"is_urgent" boolean DEFAULT false,
	"is_featured" boolean DEFAULT false,
	"max_applicants" integer,
	"language" text DEFAULT 'English',
	"timezone" text,
	"match_score_avg" integer DEFAULT 0,
	"rating_avg" numeric DEFAULT '0',
	"rating_count" integer DEFAULT 0,
	"applicants_count" integer DEFAULT 0,
	"new_applicants_count" integer DEFAULT 0,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "projects_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE "project_skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_applicants" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"status" "applicant_status" DEFAULT 'applied' NOT NULL,
	"match_score" integer,
	"rating" integer,
	"notes" text,
	"applied_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "project_invites" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"invited_email" text NOT NULL,
	"invited_user_id" integer,
	"role" text,
	"message" text,
	"status" text DEFAULT 'pending',
	"sent_at" timestamp DEFAULT now(),
	"responded_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "project_team" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"role" text,
	"joined_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "project_files" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"uploader_id" integer NOT NULL,
	"name" text NOT NULL,
	"url" text NOT NULL,
	"mime_type" text,
	"size_kb" integer,
	"uploaded_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "project_updates" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"author_id" integer NOT NULL,
	"type" text DEFAULT 'note',
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "project_reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"reviewer_id" integer NOT NULL,
	"rating" integer NOT NULL,
	"comment" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "project_boosts" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"purchased_by" integer NOT NULL,
	"plan" "boost_plan" DEFAULT 'basic' NOT NULL,
	"amount_cents" integer NOT NULL,
	"currency" varchar(8) DEFAULT 'USD',
	"start_at" timestamp NOT NULL,
	"end_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now()
);
