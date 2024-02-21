ALTER TABLE "categories" ALTER COLUMN "url_friendly" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "images" ALTER COLUMN "url" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "url_friendly" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "themes" ALTER COLUMN "url_friendly" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "images" ADD CONSTRAINT "images_url_unique" UNIQUE("url");