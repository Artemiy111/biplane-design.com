CREATE TABLE IF NOT EXISTS "categories" (
	"group_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(128) NOT NULL,
	"uri" varchar(128) NOT NULL,
	"order" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categories_title_unique" UNIQUE("title"),
	CONSTRAINT "unique_uri_for_group" UNIQUE("group_id","uri"),
	CONSTRAINT "unique_order_for_group" UNIQUE("group_id","order")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "groups" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(128) NOT NULL,
	"uri" varchar(128) NOT NULL,
	"order" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "groups_title_unique" UNIQUE("title"),
	CONSTRAINT "groups_uri_unique" UNIQUE("uri"),
	CONSTRAINT "groups_order_unique" UNIQUE("order")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "images" (
	"project_id" integer NOT NULL,
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
	"uri" varchar(200) NOT NULL,
	"status" text NOT NULL,
	"year_start" integer,
	"year_end" integer,
	"location" text NOT NULL,
	"order" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "projects_uri_unique" UNIQUE("uri"),
	CONSTRAINT "unique_order_for_category" UNIQUE("category_id","order")
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_idx_filename_for_project" ON "images" ("project_id","filename");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_order_for_project" ON "images" ("project_id","order");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "categories" ADD CONSTRAINT "categories_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "images" ADD CONSTRAINT "images_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "projects" ADD CONSTRAINT "projects_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
