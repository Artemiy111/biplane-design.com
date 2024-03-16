ALTER TABLE "projects" ADD COLUMN "preview_id" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "projects" ADD CONSTRAINT "projects_preview_id_images_id_fk" FOREIGN KEY ("preview_id") REFERENCES "images"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN IF EXISTS "preview_filename";