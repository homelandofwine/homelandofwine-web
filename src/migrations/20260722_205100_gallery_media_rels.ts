import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "ambassador_page_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "n_line_print_page_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  ALTER TABLE "ambassador_page_rels" ADD CONSTRAINT "ambassador_page_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."ambassador_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ambassador_page_rels" ADD CONSTRAINT "ambassador_page_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "n_line_print_page_rels" ADD CONSTRAINT "n_line_print_page_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."n_line_print_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "n_line_print_page_rels" ADD CONSTRAINT "n_line_print_page_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "ambassador_page_rels_order_idx" ON "ambassador_page_rels" USING btree ("order");
  CREATE INDEX "ambassador_page_rels_parent_idx" ON "ambassador_page_rels" USING btree ("parent_id");
  CREATE INDEX "ambassador_page_rels_path_idx" ON "ambassador_page_rels" USING btree ("path");
  CREATE INDEX "ambassador_page_rels_media_id_idx" ON "ambassador_page_rels" USING btree ("media_id");
  CREATE INDEX "n_line_print_page_rels_order_idx" ON "n_line_print_page_rels" USING btree ("order");
  CREATE INDEX "n_line_print_page_rels_parent_idx" ON "n_line_print_page_rels" USING btree ("parent_id");
  CREATE INDEX "n_line_print_page_rels_path_idx" ON "n_line_print_page_rels" USING btree ("path");
  CREATE INDEX "n_line_print_page_rels_media_id_idx" ON "n_line_print_page_rels" USING btree ("media_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "ambassador_page_rels" CASCADE;
  DROP TABLE "n_line_print_page_rels" CASCADE;`)
}
