import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('en', 'ka');
  CREATE TYPE "public"."enum_articles_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__articles_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__articles_v_published_locale" AS ENUM('en', 'ka');
  CREATE TYPE "public"."enum_subscribers_status" AS ENUM('active', 'unsubscribed', 'bounced');
  CREATE TYPE "public"."enum_subscribers_locale" AS ENUM('ka', 'en');
  CREATE TABLE "articles_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "articles_facts_locales" (
  	"label" varchar,
  	"value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "articles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"cover_image_id" integer,
  	"category_id" integer,
  	"author_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"newsletter_sent_at" timestamp(3) with time zone,
  	"review_is_review" boolean DEFAULT false,
  	"review_rating" numeric,
  	"review_best_rating" numeric DEFAULT 100,
  	"review_worst_rating" numeric DEFAULT 50,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_articles_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "articles_locales" (
  	"title" varchar,
  	"excerpt" varchar,
  	"body" jsonb,
  	"slug" varchar,
  	"review_wine_name" varchar,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_articles_v_version_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_articles_v_version_facts_locales" (
  	"label" varchar,
  	"value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_articles_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_cover_image_id" integer,
  	"version_category_id" integer,
  	"version_author_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_newsletter_sent_at" timestamp(3) with time zone,
  	"version_review_is_review" boolean DEFAULT false,
  	"version_review_rating" numeric,
  	"version_review_best_rating" numeric DEFAULT 100,
  	"version_review_worst_rating" numeric DEFAULT 50,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__articles_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__articles_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_articles_v_locales" (
  	"version_title" varchar,
  	"version_excerpt" varchar,
  	"version_body" jsonb,
  	"version_slug" varchar,
  	"version_review_wine_name" varchar,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "categories_locales" (
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar,
  	"sizes_og_url" varchar,
  	"sizes_og_width" numeric,
  	"sizes_og_height" numeric,
  	"sizes_og_mime_type" varchar,
  	"sizes_og_filesize" numeric,
  	"sizes_og_filename" varchar
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "subscribers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"status" "enum_subscribers_status" DEFAULT 'active' NOT NULL,
  	"locale" "enum_subscribers_locale" DEFAULT 'en',
  	"subscribed_at" timestamp(3) with time zone,
  	"unsubscribed_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "users_locales" (
  	"bio" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"articles_id" integer,
  	"categories_id" integer,
  	"media_id" integer,
  	"subscribers_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"social_links_twitter" varchar,
  	"social_links_instagram" varchar,
  	"social_links_pinterest" varchar,
  	"default_og_image_id" integer,
  	"footer_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings_locales" (
  	"site_name" varchar DEFAULT 'Homeland of Wine' NOT NULL,
  	"site_description" varchar NOT NULL,
  	"meta_title" varchar,
  	"footer_tagline" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_partners_partners" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"logo_id" integer NOT NULL,
  	"url" varchar
  );
  
  CREATE TABLE "homepage_blocks_partners" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_partners_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_about_strip" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_about_strip_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_featured_slides_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"article_id" integer
  );
  
  CREATE TABLE "homepage_blocks_featured_slides_slides_locales" (
  	"title" varchar NOT NULL,
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_featured_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_magazine_covers_covers" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_magazine_covers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_magazine_covers_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_stats_items_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_stats_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_articles_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"count" numeric DEFAULT 6,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_articles_grid_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_newsletter" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_newsletter_locales" (
  	"title_line1" varchar,
  	"title_line2" varchar,
  	"helper_title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_steps_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "homepage_blocks_steps_items_locales" (
  	"title" varchar NOT NULL,
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_steps_locales" (
  	"heading" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_testimonials_quotes" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"author" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_testimonials_quotes_locales" (
  	"quote" varchar NOT NULL,
  	"role" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_testimonials_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_faq_items_locales" (
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_faq_locales" (
  	"heading" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_info_cards_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "homepage_blocks_info_cards_cards_locales" (
  	"title" varchar NOT NULL,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_info_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_info_cards_locales" (
  	"heading" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"button_href" varchar NOT NULL,
  	"background_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_cta_locales" (
  	"heading" varchar NOT NULL,
  	"button_label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_video_id" integer,
  	"hero_poster_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "articles_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"banner_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "articles_page_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "about_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "about_page_locales" (
  	"title" varchar NOT NULL,
  	"intro" varchar,
  	"body" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "contact_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar,
  	"phone" varchar,
  	"instagram" varchar,
  	"company" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "contact_page_locales" (
  	"heading" varchar NOT NULL,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
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
  
  CREATE TABLE "ambassador_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "ambassador_page_locales" (
  	"title" varchar NOT NULL,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
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
  
  CREATE TABLE "n_line_print_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "n_line_print_page_locales" (
  	"title" varchar NOT NULL,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "privacy_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "privacy_page_locales" (
  	"title" varchar NOT NULL,
  	"body" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "articles_facts" ADD CONSTRAINT "articles_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_facts_locales" ADD CONSTRAINT "articles_facts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles_facts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_locales" ADD CONSTRAINT "articles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_version_facts" ADD CONSTRAINT "_articles_v_version_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_version_facts_locales" ADD CONSTRAINT "_articles_v_version_facts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v_version_facts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_parent_id_articles_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."articles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_category_id_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_author_id_users_id_fk" FOREIGN KEY ("version_author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v_locales" ADD CONSTRAINT "_articles_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_locales" ADD CONSTRAINT "categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_locales" ADD CONSTRAINT "users_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_subscribers_fk" FOREIGN KEY ("subscribers_id") REFERENCES "public"."subscribers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_default_og_image_id_media_id_fk" FOREIGN KEY ("default_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_footer_image_id_media_id_fk" FOREIGN KEY ("footer_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_locales" ADD CONSTRAINT "site_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_partners_partners" ADD CONSTRAINT "homepage_blocks_partners_partners_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_blocks_partners_partners" ADD CONSTRAINT "homepage_blocks_partners_partners_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_partners" ADD CONSTRAINT "homepage_blocks_partners_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_partners_locales" ADD CONSTRAINT "homepage_blocks_partners_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_about_strip" ADD CONSTRAINT "homepage_blocks_about_strip_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_about_strip_locales" ADD CONSTRAINT "homepage_blocks_about_strip_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_about_strip"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_featured_slides_slides" ADD CONSTRAINT "homepage_blocks_featured_slides_slides_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_blocks_featured_slides_slides" ADD CONSTRAINT "homepage_blocks_featured_slides_slides_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_blocks_featured_slides_slides" ADD CONSTRAINT "homepage_blocks_featured_slides_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_featured_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_featured_slides_slides_locales" ADD CONSTRAINT "homepage_blocks_featured_slides_slides_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_featured_slides_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_featured_slides" ADD CONSTRAINT "homepage_blocks_featured_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_magazine_covers_covers" ADD CONSTRAINT "homepage_blocks_magazine_covers_covers_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_blocks_magazine_covers_covers" ADD CONSTRAINT "homepage_blocks_magazine_covers_covers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_magazine_covers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_magazine_covers" ADD CONSTRAINT "homepage_blocks_magazine_covers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_magazine_covers_locales" ADD CONSTRAINT "homepage_blocks_magazine_covers_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_magazine_covers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_stats_items" ADD CONSTRAINT "homepage_blocks_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_stats_items_locales" ADD CONSTRAINT "homepage_blocks_stats_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_stats_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_stats" ADD CONSTRAINT "homepage_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_stats_locales" ADD CONSTRAINT "homepage_blocks_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_articles_grid" ADD CONSTRAINT "homepage_blocks_articles_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_articles_grid_locales" ADD CONSTRAINT "homepage_blocks_articles_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_articles_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_newsletter" ADD CONSTRAINT "homepage_blocks_newsletter_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_newsletter_locales" ADD CONSTRAINT "homepage_blocks_newsletter_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_newsletter"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_steps_items" ADD CONSTRAINT "homepage_blocks_steps_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_blocks_steps_items" ADD CONSTRAINT "homepage_blocks_steps_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_steps_items_locales" ADD CONSTRAINT "homepage_blocks_steps_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_steps_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_steps" ADD CONSTRAINT "homepage_blocks_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_steps_locales" ADD CONSTRAINT "homepage_blocks_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_testimonials_quotes" ADD CONSTRAINT "homepage_blocks_testimonials_quotes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_testimonials_quotes_locales" ADD CONSTRAINT "homepage_blocks_testimonials_quotes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_testimonials_quotes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_testimonials" ADD CONSTRAINT "homepage_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_testimonials_locales" ADD CONSTRAINT "homepage_blocks_testimonials_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_faq_items" ADD CONSTRAINT "homepage_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_faq_items_locales" ADD CONSTRAINT "homepage_blocks_faq_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_faq_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_faq" ADD CONSTRAINT "homepage_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_faq_locales" ADD CONSTRAINT "homepage_blocks_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_info_cards_cards" ADD CONSTRAINT "homepage_blocks_info_cards_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_blocks_info_cards_cards" ADD CONSTRAINT "homepage_blocks_info_cards_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_info_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_info_cards_cards_locales" ADD CONSTRAINT "homepage_blocks_info_cards_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_info_cards_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_info_cards" ADD CONSTRAINT "homepage_blocks_info_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_info_cards_locales" ADD CONSTRAINT "homepage_blocks_info_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_info_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_cta" ADD CONSTRAINT "homepage_blocks_cta_background_id_media_id_fk" FOREIGN KEY ("background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_blocks_cta" ADD CONSTRAINT "homepage_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_cta_locales" ADD CONSTRAINT "homepage_blocks_cta_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_hero_video_id_media_id_fk" FOREIGN KEY ("hero_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_hero_poster_id_media_id_fk" FOREIGN KEY ("hero_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_page" ADD CONSTRAINT "articles_page_banner_id_media_id_fk" FOREIGN KEY ("banner_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_page_locales" ADD CONSTRAINT "articles_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page" ADD CONSTRAINT "about_page_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page_locales" ADD CONSTRAINT "about_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_page_locales" ADD CONSTRAINT "contact_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ambassador_page_gallery" ADD CONSTRAINT "ambassador_page_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ambassador_page_gallery" ADD CONSTRAINT "ambassador_page_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ambassador_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ambassador_page_gallery_locales" ADD CONSTRAINT "ambassador_page_gallery_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ambassador_page_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ambassador_page" ADD CONSTRAINT "ambassador_page_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ambassador_page_locales" ADD CONSTRAINT "ambassador_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ambassador_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "n_line_print_page_gallery" ADD CONSTRAINT "n_line_print_page_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "n_line_print_page_gallery" ADD CONSTRAINT "n_line_print_page_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."n_line_print_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "n_line_print_page_gallery_locales" ADD CONSTRAINT "n_line_print_page_gallery_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."n_line_print_page_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "n_line_print_page" ADD CONSTRAINT "n_line_print_page_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "n_line_print_page_locales" ADD CONSTRAINT "n_line_print_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."n_line_print_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "privacy_page_locales" ADD CONSTRAINT "privacy_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."privacy_page"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "articles_facts_order_idx" ON "articles_facts" USING btree ("_order");
  CREATE INDEX "articles_facts_parent_id_idx" ON "articles_facts" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "articles_facts_locales_locale_parent_id_unique" ON "articles_facts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "articles_cover_image_idx" ON "articles" USING btree ("cover_image_id");
  CREATE INDEX "articles_category_idx" ON "articles" USING btree ("category_id");
  CREATE INDEX "articles_author_idx" ON "articles" USING btree ("author_id");
  CREATE INDEX "articles_updated_at_idx" ON "articles" USING btree ("updated_at");
  CREATE INDEX "articles_created_at_idx" ON "articles" USING btree ("created_at");
  CREATE INDEX "articles__status_idx" ON "articles" USING btree ("_status");
  CREATE UNIQUE INDEX "articles_slug_idx" ON "articles_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "articles_locales_locale_parent_id_unique" ON "articles_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_articles_v_version_facts_order_idx" ON "_articles_v_version_facts" USING btree ("_order");
  CREATE INDEX "_articles_v_version_facts_parent_id_idx" ON "_articles_v_version_facts" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_articles_v_version_facts_locales_locale_parent_id_unique" ON "_articles_v_version_facts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_articles_v_parent_idx" ON "_articles_v" USING btree ("parent_id");
  CREATE INDEX "_articles_v_version_version_cover_image_idx" ON "_articles_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_articles_v_version_version_category_idx" ON "_articles_v" USING btree ("version_category_id");
  CREATE INDEX "_articles_v_version_version_author_idx" ON "_articles_v" USING btree ("version_author_id");
  CREATE INDEX "_articles_v_version_version_updated_at_idx" ON "_articles_v" USING btree ("version_updated_at");
  CREATE INDEX "_articles_v_version_version_created_at_idx" ON "_articles_v" USING btree ("version_created_at");
  CREATE INDEX "_articles_v_version_version__status_idx" ON "_articles_v" USING btree ("version__status");
  CREATE INDEX "_articles_v_created_at_idx" ON "_articles_v" USING btree ("created_at");
  CREATE INDEX "_articles_v_updated_at_idx" ON "_articles_v" USING btree ("updated_at");
  CREATE INDEX "_articles_v_snapshot_idx" ON "_articles_v" USING btree ("snapshot");
  CREATE INDEX "_articles_v_published_locale_idx" ON "_articles_v" USING btree ("published_locale");
  CREATE INDEX "_articles_v_latest_idx" ON "_articles_v" USING btree ("latest");
  CREATE INDEX "_articles_v_autosave_idx" ON "_articles_v" USING btree ("autosave");
  CREATE INDEX "_articles_v_version_version_slug_idx" ON "_articles_v_locales" USING btree ("version_slug","_locale");
  CREATE UNIQUE INDEX "_articles_v_locales_locale_parent_id_unique" ON "_articles_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "categories_locales_locale_parent_id_unique" ON "categories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE INDEX "media_sizes_og_sizes_og_filename_idx" ON "media" USING btree ("sizes_og_filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "subscribers_email_idx" ON "subscribers" USING btree ("email");
  CREATE INDEX "subscribers_updated_at_idx" ON "subscribers" USING btree ("updated_at");
  CREATE INDEX "subscribers_created_at_idx" ON "subscribers" USING btree ("created_at");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "users_locales_locale_parent_id_unique" ON "users_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_articles_id_idx" ON "payload_locked_documents_rels" USING btree ("articles_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_subscribers_id_idx" ON "payload_locked_documents_rels" USING btree ("subscribers_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_default_og_image_idx" ON "site_settings" USING btree ("default_og_image_id");
  CREATE INDEX "site_settings_footer_image_idx" ON "site_settings" USING btree ("footer_image_id");
  CREATE UNIQUE INDEX "site_settings_locales_locale_parent_id_unique" ON "site_settings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_blocks_partners_partners_order_idx" ON "homepage_blocks_partners_partners" USING btree ("_order");
  CREATE INDEX "homepage_blocks_partners_partners_parent_id_idx" ON "homepage_blocks_partners_partners" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_partners_partners_logo_idx" ON "homepage_blocks_partners_partners" USING btree ("logo_id");
  CREATE INDEX "homepage_blocks_partners_order_idx" ON "homepage_blocks_partners" USING btree ("_order");
  CREATE INDEX "homepage_blocks_partners_parent_id_idx" ON "homepage_blocks_partners" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_partners_path_idx" ON "homepage_blocks_partners" USING btree ("_path");
  CREATE UNIQUE INDEX "homepage_blocks_partners_locales_locale_parent_id_unique" ON "homepage_blocks_partners_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_blocks_about_strip_order_idx" ON "homepage_blocks_about_strip" USING btree ("_order");
  CREATE INDEX "homepage_blocks_about_strip_parent_id_idx" ON "homepage_blocks_about_strip" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_about_strip_path_idx" ON "homepage_blocks_about_strip" USING btree ("_path");
  CREATE UNIQUE INDEX "homepage_blocks_about_strip_locales_locale_parent_id_unique" ON "homepage_blocks_about_strip_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_blocks_featured_slides_slides_order_idx" ON "homepage_blocks_featured_slides_slides" USING btree ("_order");
  CREATE INDEX "homepage_blocks_featured_slides_slides_parent_id_idx" ON "homepage_blocks_featured_slides_slides" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_featured_slides_slides_image_idx" ON "homepage_blocks_featured_slides_slides" USING btree ("image_id");
  CREATE INDEX "homepage_blocks_featured_slides_slides_article_idx" ON "homepage_blocks_featured_slides_slides" USING btree ("article_id");
  CREATE UNIQUE INDEX "homepage_blocks_featured_slides_slides_locales_locale_parent" ON "homepage_blocks_featured_slides_slides_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_blocks_featured_slides_order_idx" ON "homepage_blocks_featured_slides" USING btree ("_order");
  CREATE INDEX "homepage_blocks_featured_slides_parent_id_idx" ON "homepage_blocks_featured_slides" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_featured_slides_path_idx" ON "homepage_blocks_featured_slides" USING btree ("_path");
  CREATE INDEX "homepage_blocks_magazine_covers_covers_order_idx" ON "homepage_blocks_magazine_covers_covers" USING btree ("_order");
  CREATE INDEX "homepage_blocks_magazine_covers_covers_parent_id_idx" ON "homepage_blocks_magazine_covers_covers" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_magazine_covers_covers_image_idx" ON "homepage_blocks_magazine_covers_covers" USING btree ("image_id");
  CREATE INDEX "homepage_blocks_magazine_covers_order_idx" ON "homepage_blocks_magazine_covers" USING btree ("_order");
  CREATE INDEX "homepage_blocks_magazine_covers_parent_id_idx" ON "homepage_blocks_magazine_covers" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_magazine_covers_path_idx" ON "homepage_blocks_magazine_covers" USING btree ("_path");
  CREATE UNIQUE INDEX "homepage_blocks_magazine_covers_locales_locale_parent_id_uni" ON "homepage_blocks_magazine_covers_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_blocks_stats_items_order_idx" ON "homepage_blocks_stats_items" USING btree ("_order");
  CREATE INDEX "homepage_blocks_stats_items_parent_id_idx" ON "homepage_blocks_stats_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "homepage_blocks_stats_items_locales_locale_parent_id_unique" ON "homepage_blocks_stats_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_blocks_stats_order_idx" ON "homepage_blocks_stats" USING btree ("_order");
  CREATE INDEX "homepage_blocks_stats_parent_id_idx" ON "homepage_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_stats_path_idx" ON "homepage_blocks_stats" USING btree ("_path");
  CREATE UNIQUE INDEX "homepage_blocks_stats_locales_locale_parent_id_unique" ON "homepage_blocks_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_blocks_articles_grid_order_idx" ON "homepage_blocks_articles_grid" USING btree ("_order");
  CREATE INDEX "homepage_blocks_articles_grid_parent_id_idx" ON "homepage_blocks_articles_grid" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_articles_grid_path_idx" ON "homepage_blocks_articles_grid" USING btree ("_path");
  CREATE UNIQUE INDEX "homepage_blocks_articles_grid_locales_locale_parent_id_uniqu" ON "homepage_blocks_articles_grid_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_blocks_newsletter_order_idx" ON "homepage_blocks_newsletter" USING btree ("_order");
  CREATE INDEX "homepage_blocks_newsletter_parent_id_idx" ON "homepage_blocks_newsletter" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_newsletter_path_idx" ON "homepage_blocks_newsletter" USING btree ("_path");
  CREATE UNIQUE INDEX "homepage_blocks_newsletter_locales_locale_parent_id_unique" ON "homepage_blocks_newsletter_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_blocks_steps_items_order_idx" ON "homepage_blocks_steps_items" USING btree ("_order");
  CREATE INDEX "homepage_blocks_steps_items_parent_id_idx" ON "homepage_blocks_steps_items" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_steps_items_image_idx" ON "homepage_blocks_steps_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "homepage_blocks_steps_items_locales_locale_parent_id_unique" ON "homepage_blocks_steps_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_blocks_steps_order_idx" ON "homepage_blocks_steps" USING btree ("_order");
  CREATE INDEX "homepage_blocks_steps_parent_id_idx" ON "homepage_blocks_steps" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_steps_path_idx" ON "homepage_blocks_steps" USING btree ("_path");
  CREATE UNIQUE INDEX "homepage_blocks_steps_locales_locale_parent_id_unique" ON "homepage_blocks_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_blocks_testimonials_quotes_order_idx" ON "homepage_blocks_testimonials_quotes" USING btree ("_order");
  CREATE INDEX "homepage_blocks_testimonials_quotes_parent_id_idx" ON "homepage_blocks_testimonials_quotes" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "homepage_blocks_testimonials_quotes_locales_locale_parent_id" ON "homepage_blocks_testimonials_quotes_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_blocks_testimonials_order_idx" ON "homepage_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "homepage_blocks_testimonials_parent_id_idx" ON "homepage_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_testimonials_path_idx" ON "homepage_blocks_testimonials" USING btree ("_path");
  CREATE UNIQUE INDEX "homepage_blocks_testimonials_locales_locale_parent_id_unique" ON "homepage_blocks_testimonials_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_blocks_faq_items_order_idx" ON "homepage_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "homepage_blocks_faq_items_parent_id_idx" ON "homepage_blocks_faq_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "homepage_blocks_faq_items_locales_locale_parent_id_unique" ON "homepage_blocks_faq_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_blocks_faq_order_idx" ON "homepage_blocks_faq" USING btree ("_order");
  CREATE INDEX "homepage_blocks_faq_parent_id_idx" ON "homepage_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_faq_path_idx" ON "homepage_blocks_faq" USING btree ("_path");
  CREATE UNIQUE INDEX "homepage_blocks_faq_locales_locale_parent_id_unique" ON "homepage_blocks_faq_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_blocks_info_cards_cards_order_idx" ON "homepage_blocks_info_cards_cards" USING btree ("_order");
  CREATE INDEX "homepage_blocks_info_cards_cards_parent_id_idx" ON "homepage_blocks_info_cards_cards" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_info_cards_cards_image_idx" ON "homepage_blocks_info_cards_cards" USING btree ("image_id");
  CREATE UNIQUE INDEX "homepage_blocks_info_cards_cards_locales_locale_parent_id_un" ON "homepage_blocks_info_cards_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_blocks_info_cards_order_idx" ON "homepage_blocks_info_cards" USING btree ("_order");
  CREATE INDEX "homepage_blocks_info_cards_parent_id_idx" ON "homepage_blocks_info_cards" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_info_cards_path_idx" ON "homepage_blocks_info_cards" USING btree ("_path");
  CREATE UNIQUE INDEX "homepage_blocks_info_cards_locales_locale_parent_id_unique" ON "homepage_blocks_info_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_blocks_cta_order_idx" ON "homepage_blocks_cta" USING btree ("_order");
  CREATE INDEX "homepage_blocks_cta_parent_id_idx" ON "homepage_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_cta_path_idx" ON "homepage_blocks_cta" USING btree ("_path");
  CREATE INDEX "homepage_blocks_cta_background_idx" ON "homepage_blocks_cta" USING btree ("background_id");
  CREATE UNIQUE INDEX "homepage_blocks_cta_locales_locale_parent_id_unique" ON "homepage_blocks_cta_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_hero_video_idx" ON "homepage" USING btree ("hero_video_id");
  CREATE INDEX "homepage_hero_poster_idx" ON "homepage" USING btree ("hero_poster_id");
  CREATE INDEX "articles_page_banner_idx" ON "articles_page" USING btree ("banner_id");
  CREATE UNIQUE INDEX "articles_page_locales_locale_parent_id_unique" ON "articles_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_page_hero_image_idx" ON "about_page" USING btree ("hero_image_id");
  CREATE UNIQUE INDEX "about_page_locales_locale_parent_id_unique" ON "about_page_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "contact_page_locales_locale_parent_id_unique" ON "contact_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "ambassador_page_gallery_order_idx" ON "ambassador_page_gallery" USING btree ("_order");
  CREATE INDEX "ambassador_page_gallery_parent_id_idx" ON "ambassador_page_gallery" USING btree ("_parent_id");
  CREATE INDEX "ambassador_page_gallery_image_idx" ON "ambassador_page_gallery" USING btree ("image_id");
  CREATE UNIQUE INDEX "ambassador_page_gallery_locales_locale_parent_id_unique" ON "ambassador_page_gallery_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "ambassador_page_logo_idx" ON "ambassador_page" USING btree ("logo_id");
  CREATE UNIQUE INDEX "ambassador_page_locales_locale_parent_id_unique" ON "ambassador_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "n_line_print_page_gallery_order_idx" ON "n_line_print_page_gallery" USING btree ("_order");
  CREATE INDEX "n_line_print_page_gallery_parent_id_idx" ON "n_line_print_page_gallery" USING btree ("_parent_id");
  CREATE INDEX "n_line_print_page_gallery_image_idx" ON "n_line_print_page_gallery" USING btree ("image_id");
  CREATE UNIQUE INDEX "n_line_print_page_gallery_locales_locale_parent_id_unique" ON "n_line_print_page_gallery_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "n_line_print_page_logo_idx" ON "n_line_print_page" USING btree ("logo_id");
  CREATE UNIQUE INDEX "n_line_print_page_locales_locale_parent_id_unique" ON "n_line_print_page_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "privacy_page_locales_locale_parent_id_unique" ON "privacy_page_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "articles_facts" CASCADE;
  DROP TABLE "articles_facts_locales" CASCADE;
  DROP TABLE "articles" CASCADE;
  DROP TABLE "articles_locales" CASCADE;
  DROP TABLE "_articles_v_version_facts" CASCADE;
  DROP TABLE "_articles_v_version_facts_locales" CASCADE;
  DROP TABLE "_articles_v" CASCADE;
  DROP TABLE "_articles_v_locales" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "categories_locales" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "subscribers" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "users_locales" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "site_settings_locales" CASCADE;
  DROP TABLE "homepage_blocks_partners_partners" CASCADE;
  DROP TABLE "homepage_blocks_partners" CASCADE;
  DROP TABLE "homepage_blocks_partners_locales" CASCADE;
  DROP TABLE "homepage_blocks_about_strip" CASCADE;
  DROP TABLE "homepage_blocks_about_strip_locales" CASCADE;
  DROP TABLE "homepage_blocks_featured_slides_slides" CASCADE;
  DROP TABLE "homepage_blocks_featured_slides_slides_locales" CASCADE;
  DROP TABLE "homepage_blocks_featured_slides" CASCADE;
  DROP TABLE "homepage_blocks_magazine_covers_covers" CASCADE;
  DROP TABLE "homepage_blocks_magazine_covers" CASCADE;
  DROP TABLE "homepage_blocks_magazine_covers_locales" CASCADE;
  DROP TABLE "homepage_blocks_stats_items" CASCADE;
  DROP TABLE "homepage_blocks_stats_items_locales" CASCADE;
  DROP TABLE "homepage_blocks_stats" CASCADE;
  DROP TABLE "homepage_blocks_stats_locales" CASCADE;
  DROP TABLE "homepage_blocks_articles_grid" CASCADE;
  DROP TABLE "homepage_blocks_articles_grid_locales" CASCADE;
  DROP TABLE "homepage_blocks_newsletter" CASCADE;
  DROP TABLE "homepage_blocks_newsletter_locales" CASCADE;
  DROP TABLE "homepage_blocks_steps_items" CASCADE;
  DROP TABLE "homepage_blocks_steps_items_locales" CASCADE;
  DROP TABLE "homepage_blocks_steps" CASCADE;
  DROP TABLE "homepage_blocks_steps_locales" CASCADE;
  DROP TABLE "homepage_blocks_testimonials_quotes" CASCADE;
  DROP TABLE "homepage_blocks_testimonials_quotes_locales" CASCADE;
  DROP TABLE "homepage_blocks_testimonials" CASCADE;
  DROP TABLE "homepage_blocks_testimonials_locales" CASCADE;
  DROP TABLE "homepage_blocks_faq_items" CASCADE;
  DROP TABLE "homepage_blocks_faq_items_locales" CASCADE;
  DROP TABLE "homepage_blocks_faq" CASCADE;
  DROP TABLE "homepage_blocks_faq_locales" CASCADE;
  DROP TABLE "homepage_blocks_info_cards_cards" CASCADE;
  DROP TABLE "homepage_blocks_info_cards_cards_locales" CASCADE;
  DROP TABLE "homepage_blocks_info_cards" CASCADE;
  DROP TABLE "homepage_blocks_info_cards_locales" CASCADE;
  DROP TABLE "homepage_blocks_cta" CASCADE;
  DROP TABLE "homepage_blocks_cta_locales" CASCADE;
  DROP TABLE "homepage" CASCADE;
  DROP TABLE "articles_page" CASCADE;
  DROP TABLE "articles_page_locales" CASCADE;
  DROP TABLE "about_page" CASCADE;
  DROP TABLE "about_page_locales" CASCADE;
  DROP TABLE "contact_page" CASCADE;
  DROP TABLE "contact_page_locales" CASCADE;
  DROP TABLE "ambassador_page_gallery" CASCADE;
  DROP TABLE "ambassador_page_gallery_locales" CASCADE;
  DROP TABLE "ambassador_page" CASCADE;
  DROP TABLE "ambassador_page_locales" CASCADE;
  DROP TABLE "n_line_print_page_gallery" CASCADE;
  DROP TABLE "n_line_print_page_gallery_locales" CASCADE;
  DROP TABLE "n_line_print_page" CASCADE;
  DROP TABLE "n_line_print_page_locales" CASCADE;
  DROP TABLE "privacy_page" CASCADE;
  DROP TABLE "privacy_page_locales" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_articles_status";
  DROP TYPE "public"."enum__articles_v_version_status";
  DROP TYPE "public"."enum__articles_v_published_locale";
  DROP TYPE "public"."enum_subscribers_status";
  DROP TYPE "public"."enum_subscribers_locale";`)
}
