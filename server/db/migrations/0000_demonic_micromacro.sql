CREATE TABLE IF NOT EXISTS "categories" (
	"group_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(128) NOT NULL,
	"url_friendly" varchar(128) NOT NULL,
	"order" serial NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categories_title_unique" UNIQUE("title"),
	CONSTRAINT "url_friendly_for_group" UNIQUE("group_id","url_friendly"),
	CONSTRAINT "unique_order_for_group" UNIQUE("group_id","order")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "groups" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(128) NOT NULL,
	"url_friendly" varchar(128) NOT NULL,
	"order" serial NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "groups_title_unique" UNIQUE("title"),
	CONSTRAINT "groups_url_friendly_unique" UNIQUE("url_friendly"),
	CONSTRAINT "groups_order_unique" UNIQUE("order")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "images" (
	"project_url_friendly" varchar(200) NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"filename" varchar(200) NOT NULL,
	"title" varchar(200),
	"order" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "projects" (
	"category_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(200) NOT NULL,
	"url_friendly" varchar(200) NOT NULL,
	"status" text NOT NULL,
	"year_start" integer,
	"year_end" integer,
	"location" text,
	"order" serial NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "projects_url_friendly_unique" UNIQUE("url_friendly"),
	CONSTRAINT "unique_order_for_category" UNIQUE("category_id","order")
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_idx_filename_for_project" ON "images" ("project_url_friendly","filename");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_order_for_project" ON "images" ("project_url_friendly","order");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "categories" ADD CONSTRAINT "categories_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "images" ADD CONSTRAINT "images_project_url_friendly_projects_url_friendly_fk" FOREIGN KEY ("project_url_friendly") REFERENCES "projects"("url_friendly") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "projects" ADD CONSTRAINT "projects_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
