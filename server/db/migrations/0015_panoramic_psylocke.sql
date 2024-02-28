ALTER TABLE "images" DROP CONSTRAINT "images_project_url_friendly_projects_url_friendly_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "images" ADD CONSTRAINT "images_project_url_friendly_projects_url_friendly_fk" FOREIGN KEY ("project_url_friendly") REFERENCES "projects"("url_friendly") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
