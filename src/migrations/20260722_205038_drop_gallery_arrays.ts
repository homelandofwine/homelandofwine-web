import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "ambassador_page_gallery" CASCADE;
  DROP TABLE "ambassador_page_gallery_locales" CASCADE;
  DROP TABLE "n_line_print_page_gallery" CASCADE;
  DROP TABLE "n_line_print_page_gallery_locales" CASCADE;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "ambassador_page_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "ambassador_page_gallery_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "n_line_print_page_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "n_line_print_page_gallery_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  ALTER TABLE "ambassador_page_gallery" ADD CONSTRAINT "ambassador_page_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ambassador_page_gallery" ADD CONSTRAINT "ambassador_page_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ambassador_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ambassador_page_gallery_locales" ADD CONSTRAINT "ambassador_page_gallery_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ambassador_page_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "n_line_print_page_gallery" ADD CONSTRAINT "n_line_print_page_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "n_line_print_page_gallery" ADD CONSTRAINT "n_line_print_page_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."n_line_print_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "n_line_print_page_gallery_locales" ADD CONSTRAINT "n_line_print_page_gallery_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."n_line_print_page_gallery"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "ambassador_page_gallery_order_idx" ON "ambassador_page_gallery" USING btree ("_order");
  CREATE INDEX "ambassador_page_gallery_parent_id_idx" ON "ambassador_page_gallery" USING btree ("_parent_id");
  CREATE INDEX "ambassador_page_gallery_image_idx" ON "ambassador_page_gallery" USING btree ("image_id");
  CREATE UNIQUE INDEX "ambassador_page_gallery_locales_locale_parent_id_unique" ON "ambassador_page_gallery_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "n_line_print_page_gallery_order_idx" ON "n_line_print_page_gallery" USING btree ("_order");
  CREATE INDEX "n_line_print_page_gallery_parent_id_idx" ON "n_line_print_page_gallery" USING btree ("_parent_id");
  CREATE INDEX "n_line_print_page_gallery_image_idx" ON "n_line_print_page_gallery" USING btree ("image_id");
  CREATE UNIQUE INDEX "n_line_print_page_gallery_locales_locale_parent_id_unique" ON "n_line_print_page_gallery_locales" USING btree ("_locale","_parent_id");`)
}
