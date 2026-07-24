import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users" ADD COLUMN "avatar_id" integer;
  ALTER TABLE "users_locales" ADD COLUMN "role" varchar;
  ALTER TABLE "homepage_blocks_steps_items" ADD COLUMN "article_id" integer;
  ALTER TABLE "users" ADD CONSTRAINT "users_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_blocks_steps_items" ADD CONSTRAINT "homepage_blocks_steps_items_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "users_avatar_idx" ON "users" USING btree ("avatar_id");
  CREATE INDEX "homepage_blocks_steps_items_article_idx" ON "homepage_blocks_steps_items" USING btree ("article_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users" DROP CONSTRAINT "users_avatar_id_media_id_fk";
  
  ALTER TABLE "homepage_blocks_steps_items" DROP CONSTRAINT "homepage_blocks_steps_items_article_id_articles_id_fk";
  
  DROP INDEX "users_avatar_idx";
  DROP INDEX "homepage_blocks_steps_items_article_idx";
  ALTER TABLE "users" DROP COLUMN "avatar_id";
  ALTER TABLE "users_locales" DROP COLUMN "role";
  ALTER TABLE "homepage_blocks_steps_items" DROP COLUMN "article_id";`)
}
