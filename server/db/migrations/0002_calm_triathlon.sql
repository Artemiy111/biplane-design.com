CREATE TABLE IF NOT EXISTS "images" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text,
	"project_id" integer NOT NULL,
	"url" text
);
--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "title" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "url_friendly" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "url_friendly" text;--> statement-breakpoint
ALTER TABLE "themes" ADD COLUMN "url_friendly" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "images" ADD CONSTRAINT "images_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_url_friendly_unique" UNIQUE("url_friendly");--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_url_friendly_unique" UNIQUE("url_friendly");--> statement-breakpoint
ALTER TABLE "themes" ADD CONSTRAINT "themes_url_friendly_unique" UNIQUE("url_friendly");