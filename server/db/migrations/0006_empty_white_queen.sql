ALTER TABLE "images" DROP CONSTRAINT "images_url_unique";--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "title" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "images" ADD CONSTRAINT "unique_filename_for_project" UNIQUE("project_id","url");