ALTER TABLE "categories" ALTER COLUMN "title" SET DATA TYPE varchar(128);--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "url_friendly" SET DATA TYPE varchar(128);--> statement-breakpoint
ALTER TABLE "images" ALTER COLUMN "project_url_friendly" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "images" ALTER COLUMN "url" SET DATA TYPE varchar(200);--> statement-breakpoint
ALTER TABLE "images" ALTER COLUMN "title" SET DATA TYPE varchar(200);--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "title" SET DATA TYPE varchar(200);--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "url_friendly" SET DATA TYPE varchar(200);--> statement-breakpoint
ALTER TABLE "themes" ALTER COLUMN "title" SET DATA TYPE varchar(128);--> statement-breakpoint
ALTER TABLE "themes" ALTER COLUMN "url_friendly" SET DATA TYPE varchar(128);