ALTER TABLE "images" DROP CONSTRAINT "unique_order_for_project";--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_order_for_project" ON "images" ("project_url_friendly","order");