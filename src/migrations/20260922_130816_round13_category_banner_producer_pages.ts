import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "homepage_blocks_producer_pages_pages" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"name" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "homepage_blocks_producer_pages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_producer_pages_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  ALTER TABLE "categories" ADD COLUMN "banner_id" integer;
  ALTER TABLE "homepage_blocks_producer_pages_pages" ADD CONSTRAINT "homepage_blocks_producer_pages_pages_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_blocks_producer_pages_pages" ADD CONSTRAINT "homepage_blocks_producer_pages_pages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_producer_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_producer_pages" ADD CONSTRAINT "homepage_blocks_producer_pages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_producer_pages_locales" ADD CONSTRAINT "homepage_blocks_producer_pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_producer_pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "homepage_blocks_producer_pages_pages_order_idx" ON "homepage_blocks_producer_pages_pages" USING btree ("_order");
  CREATE INDEX "homepage_blocks_producer_pages_pages_parent_id_idx" ON "homepage_blocks_producer_pages_pages" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_producer_pages_pages_image_idx" ON "homepage_blocks_producer_pages_pages" USING btree ("image_id");
  CREATE INDEX "homepage_blocks_producer_pages_order_idx" ON "homepage_blocks_producer_pages" USING btree ("_order");
  CREATE INDEX "homepage_blocks_producer_pages_parent_id_idx" ON "homepage_blocks_producer_pages" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_producer_pages_path_idx" ON "homepage_blocks_producer_pages" USING btree ("_path");
  CREATE UNIQUE INDEX "homepage_blocks_producer_pages_locales_locale_parent_id_uniq" ON "homepage_blocks_producer_pages_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "categories" ADD CONSTRAINT "categories_banner_id_media_id_fk" FOREIGN KEY ("banner_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "categories_banner_idx" ON "categories" USING btree ("banner_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "homepage_blocks_producer_pages_pages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "homepage_blocks_producer_pages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "homepage_blocks_producer_pages_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "homepage_blocks_producer_pages_pages" CASCADE;
  DROP TABLE "homepage_blocks_producer_pages" CASCADE;
  DROP TABLE "homepage_blocks_producer_pages_locales" CASCADE;
  ALTER TABLE "categories" DROP CONSTRAINT "categories_banner_id_media_id_fk";
  
  DROP INDEX "categories_banner_idx";
  ALTER TABLE "categories" DROP COLUMN "banner_id";`)
}
