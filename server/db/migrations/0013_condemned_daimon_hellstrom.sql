ALTER TABLE "categories" DROP CONSTRAINT "categories_order_unique";--> statement-breakpoint
ALTER TABLE "categories" DROP CONSTRAINT "url_friendly_for_group_id";--> statement-breakpoint
ALTER TABLE "projects" DROP CONSTRAINT "projects_order_unique";--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "url_friendly_for_group" UNIQUE("group_id","url_friendly");--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "unique_order_for_group" UNIQUE("group_id","order");--> statement-breakpoint
ALTER TABLE "images" ADD CONSTRAINT "unique_order_for_project" UNIQUE("project_url_friendly","order");--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "unique_order_for_category" UNIQUE("category_id","order");