import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "authors" ADD COLUMN "role" varchar;
  ALTER TABLE "authors" ADD COLUMN "role_ka" varchar;
  ALTER TABLE "authors" ADD COLUMN "bio" varchar;
  ALTER TABLE "authors" ADD COLUMN "bio_ka" varchar;

  UPDATE "authors" a SET "role" = l."role", "bio" = l."bio"
    FROM "authors_locales" l WHERE l."_parent_id" = a."id" AND l."_locale" = 'en';
  UPDATE "authors" a SET "role_ka" = l."role", "bio_ka" = l."bio"
    FROM "authors_locales" l WHERE l."_parent_id" = a."id" AND l."_locale" = 'ka';

  DROP TABLE "authors_locales" CASCADE;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "authors_locales" (
  	"role" varchar,
  	"bio" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "authors_locales" ADD CONSTRAINT "authors_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "authors_locales_locale_parent_id_unique" ON "authors_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "authors" DROP COLUMN "role";
  ALTER TABLE "authors" DROP COLUMN "role_ka";
  ALTER TABLE "authors" DROP COLUMN "bio";
  ALTER TABLE "authors" DROP COLUMN "bio_ka";`)
}
