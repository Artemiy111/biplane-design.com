ALTER TABLE "images" DROP CONSTRAINT "images_project_id_projects_id_fk";
--> statement-breakpoint
ALTER TABLE "images" DROP COLUMN IF EXISTS "project_id";--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "url_friendly_for_group_id" UNIQUE("group_id","url_friendly");