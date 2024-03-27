ALTER TABLE "categories" ALTER COLUMN "order" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "groups" ALTER COLUMN "order" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "groups" ALTER COLUMN "order" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "order" DROP DEFAULT;