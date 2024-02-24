ALTER TABLE "images" DROP CONSTRAINT "unique_filename_for_project";--> statement-breakpoint
ALTER TABLE "images" ADD COLUMN "project_url_friendly" varchar(200);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "images" ADD CONSTRAINT "images_project_url_friendly_projects_url_friendly_fk" FOREIGN KEY ("project_url_friendly") REFERENCES "projects"("url_friendly") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "images" ADD CONSTRAINT "unique_filename_for_project" UNIQUE("project_url_friendly","url");