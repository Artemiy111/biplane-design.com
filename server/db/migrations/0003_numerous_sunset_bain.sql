ALTER TABLE "categories" ALTER COLUMN "order" SET DEFAULT select count(*) + 1 from categories where groupId = NEW.groupId;--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "order" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "order" SET DEFAULT select count(*) + 1 from projects where categoryId = NEW.categoryId;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "order" DROP NOT NULL;