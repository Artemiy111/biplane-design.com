

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE SCHEMA IF NOT EXISTS "drizzle";

ALTER SCHEMA "drizzle" OWNER TO "postgres";

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

COMMENT ON SCHEMA "public" IS 'standard public schema';

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE OR REPLACE FUNCTION "public"."category_default_order"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
  begin
    NEW."order" = (select count(*) + 1 from categories where group_id = NEW.group_id);
    return NEW;
  end;
  $$;

ALTER FUNCTION "public"."category_default_order"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."group_default_order"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
  begin
    NEW."order" = (select count(*) + 1 from groups);
    return NEW;
  end;
  $$;

ALTER FUNCTION "public"."group_default_order"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."ii"("groupid" integer) RETURNS integer
    LANGUAGE "sql"
    AS $$
    select count(*) from categories where groupId = groupId
  $$;

ALTER FUNCTION "public"."ii"("groupid" integer) OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "drizzle"."__drizzle_migrations" (
    "id" integer NOT NULL,
    "hash" "text" NOT NULL,
    "created_at" bigint
);

ALTER TABLE "drizzle"."__drizzle_migrations" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "drizzle"."__drizzle_migrations_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "drizzle"."__drizzle_migrations_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "drizzle"."__drizzle_migrations_id_seq" OWNED BY "drizzle"."__drizzle_migrations"."id";

CREATE TABLE IF NOT EXISTS "public"."categories" (
    "group_id" integer NOT NULL,
    "id" integer NOT NULL,
    "title" "text" NOT NULL,
    "uri" "text" NOT NULL,
    "order" integer NOT NULL,
    "layout" "text" NOT NULL
);

ALTER TABLE "public"."categories" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."categories_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."categories_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."categories_id_seq" OWNED BY "public"."categories"."id";

CREATE TABLE IF NOT EXISTS "public"."groups" (
    "id" integer NOT NULL,
    "title" "text" NOT NULL,
    "uri" "text" NOT NULL,
    "order" integer NOT NULL
);

ALTER TABLE "public"."groups" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."groups_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."groups_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."groups_id_seq" OWNED BY "public"."groups"."id";

CREATE TABLE IF NOT EXISTS "public"."images" (
    "project_id" integer NOT NULL,
    "id" "text" NOT NULL,
    "alt" "text" NOT NULL,
    "order" integer NOT NULL,
    "fit" "text" NOT NULL
);

ALTER TABLE "public"."images" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."images_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."images_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."images_id_seq" OWNED BY "public"."images"."id";

CREATE TABLE IF NOT EXISTS "public"."projects" (
    "category_id" integer NOT NULL,
    "id" integer NOT NULL,
    "title" "text" NOT NULL,
    "uri" "text" NOT NULL,
    "status" "text" NOT NULL,
    "year_start" integer,
    "year_end" integer,
    "location" "text",
    "order" integer NOT NULL,
    "is_minimal" boolean DEFAULT false NOT NULL
);

ALTER TABLE "public"."projects" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."projects_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."projects_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."projects_id_seq" OWNED BY "public"."projects"."id";

CREATE TABLE IF NOT EXISTS "public"."sessions" (
    "id" "text" NOT NULL,
    "user_id" integer NOT NULL,
    "expires_at" timestamp with time zone NOT NULL
);

ALTER TABLE "public"."sessions" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" integer NOT NULL,
    "username" "text" NOT NULL,
    "password_hash" "text" NOT NULL
);

ALTER TABLE "public"."users" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."users_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."users_id_seq" OWNED BY "public"."users"."id";

ALTER TABLE ONLY "drizzle"."__drizzle_migrations" ALTER COLUMN "id" SET DEFAULT "nextval"('"drizzle"."__drizzle_migrations_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."categories" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."categories_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."groups" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."groups_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."projects" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."projects_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."users" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."users_id_seq"'::"regclass");

ALTER TABLE ONLY "drizzle"."__drizzle_migrations"
    ADD CONSTRAINT "__drizzle_migrations_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_title_unique" UNIQUE ("title");

ALTER TABLE ONLY "public"."groups"
    ADD CONSTRAINT "groups_order_unique" UNIQUE ("order");

ALTER TABLE ONLY "public"."groups"
    ADD CONSTRAINT "groups_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."groups"
    ADD CONSTRAINT "groups_title_unique" UNIQUE ("title");

ALTER TABLE ONLY "public"."groups"
    ADD CONSTRAINT "groups_uri_unique" UNIQUE ("uri");

ALTER TABLE ONLY "public"."images"
    ADD CONSTRAINT "images_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_uri_unique" UNIQUE ("uri");

ALTER TABLE ONLY "public"."sessions"
    ADD CONSTRAINT "sessions_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "unique_order_for_category" UNIQUE ("category_id", "order");

ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "unique_order_for_group" UNIQUE ("group_id", "order");

ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "unique_uri_for_group" UNIQUE ("group_id", "uri");

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

CREATE UNIQUE INDEX "unique_order_for_project" ON "public"."images" USING "btree" ("project_id", "order");

ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."images"
    ADD CONSTRAINT "images_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."sessions"
    ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");

ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."category_default_order"() TO "anon";
GRANT ALL ON FUNCTION "public"."category_default_order"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."category_default_order"() TO "service_role";

GRANT ALL ON FUNCTION "public"."group_default_order"() TO "anon";
GRANT ALL ON FUNCTION "public"."group_default_order"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."group_default_order"() TO "service_role";

GRANT ALL ON FUNCTION "public"."ii"("groupid" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."ii"("groupid" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."ii"("groupid" integer) TO "service_role";

GRANT ALL ON TABLE "public"."categories" TO "anon";
GRANT ALL ON TABLE "public"."categories" TO "authenticated";
GRANT ALL ON TABLE "public"."categories" TO "service_role";

GRANT ALL ON SEQUENCE "public"."categories_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."categories_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."categories_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."groups" TO "anon";
GRANT ALL ON TABLE "public"."groups" TO "authenticated";
GRANT ALL ON TABLE "public"."groups" TO "service_role";

GRANT ALL ON SEQUENCE "public"."groups_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."groups_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."groups_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."images" TO "anon";
GRANT ALL ON TABLE "public"."images" TO "authenticated";
GRANT ALL ON TABLE "public"."images" TO "service_role";

GRANT ALL ON SEQUENCE "public"."images_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."images_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."images_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."projects" TO "anon";
GRANT ALL ON TABLE "public"."projects" TO "authenticated";
GRANT ALL ON TABLE "public"."projects" TO "service_role";

GRANT ALL ON SEQUENCE "public"."projects_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."projects_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."projects_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."sessions" TO "anon";
GRANT ALL ON TABLE "public"."sessions" TO "authenticated";
GRANT ALL ON TABLE "public"."sessions" TO "service_role";

GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";

GRANT ALL ON SEQUENCE "public"."users_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."users_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."users_id_seq" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
