ALTER TABLE "images" RENAME COLUMN "url" TO "filename";--> statement-breakpoint
ALTER TABLE "images" DROP CONSTRAINT "unique_filename_for_project";--> statement-breakpoint
ALTER TABLE "images" ADD CONSTRAINT "unique_filename_for_project" UNIQUE("project_url_friendly","filename");