ALTER TABLE "categories" ADD COLUMN "order" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "images" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "images" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "order" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "themes" ADD COLUMN "order" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_order_unique" UNIQUE("order");--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_order_unique" UNIQUE("order");--> statement-breakpoint
ALTER TABLE "themes" ADD CONSTRAINT "themes_order_unique" UNIQUE("order");