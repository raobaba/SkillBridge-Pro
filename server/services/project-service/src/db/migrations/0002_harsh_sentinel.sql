ALTER TABLE "project_files" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "project_files" ADD COLUMN "category" text DEFAULT 'other';