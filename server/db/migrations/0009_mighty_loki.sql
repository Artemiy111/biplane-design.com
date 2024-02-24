ALTER TABLE "themes" RENAME TO "groups";--> statement-breakpoint
ALTER TABLE "categories" RENAME COLUMN "theme_id" TO "group_id";--> statement-breakpoint
ALTER TABLE "groups" DROP CONSTRAINT "themes_title_unique";--> statement-breakpoint
ALTER TABLE "groups" DROP CONSTRAINT "themes_url_friendly_unique";--> statement-breakpoint
ALTER TABLE "groups" DROP CONSTRAINT "themes_order_unique";--> statement-breakpoint
ALTER TABLE "categories" DROP CONSTRAINT "categories_theme_id_themes_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "categories" ADD CONSTRAINT "categories_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "groups" ADD CONSTRAINT "groups_title_unique" UNIQUE("title");--> statement-breakpoint
ALTER TABLE "groups" ADD CONSTRAINT "groups_url_friendly_unique" UNIQUE("url_friendly");--> statement-breakpoint
ALTER TABLE "groups" ADD CONSTRAINT "groups_order_unique" UNIQUE("order");