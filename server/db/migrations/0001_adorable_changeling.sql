ALTER TABLE "categories" ADD CONSTRAINT "categories_title_unique" UNIQUE("title");--> statement-breakpoint
ALTER TABLE "themes" ADD CONSTRAINT "themes_title_unique" UNIQUE("title");