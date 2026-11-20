import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_solutions_icon" AS ENUM('landmark', 'building', 'graduation-cap', 'heart-pulse', 'headset', 'cart', 'server', 'database', 'network', 'shield', 'phone', 'map', 'wrench', 'laptop', 'cable', 'cloud', 'life-buoy', 'megaphone', 'settings', 'briefcase');
  CREATE TYPE "public"."enum_capabilities_icon" AS ENUM('landmark', 'building', 'graduation-cap', 'heart-pulse', 'headset', 'cart', 'server', 'database', 'network', 'shield', 'phone', 'map', 'wrench', 'laptop', 'cable', 'cloud', 'life-buoy', 'megaphone', 'settings', 'briefcase');
  CREATE TYPE "public"."enum_partners_category" AS ENUM('distributor', 'hardware', 'software', 'security', 'cloud');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_news_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__news_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_events_format" AS ENUM('in-person', 'virtual', 'hybrid');
  CREATE TYPE "public"."enum_events_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__events_v_version_format" AS ENUM('in-person', 'virtual', 'hybrid');
  CREATE TYPE "public"."enum__events_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_jobs_workplace" AS ENUM('on-site', 'hybrid', 'remote');
  CREATE TYPE "public"."enum_jobs_employment_type" AS ENUM('full-time', 'part-time', 'contract');
  CREATE TYPE "public"."enum_jobs_clearance" AS ENUM('none', 'public-trust', 'secret', 'top-secret', 'ts-sci');
  CREATE TYPE "public"."enum_jobs_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__jobs_v_version_workplace" AS ENUM('on-site', 'hybrid', 'remote');
  CREATE TYPE "public"."enum__jobs_v_version_employment_type" AS ENUM('full-time', 'part-time', 'contract');
  CREATE TYPE "public"."enum__jobs_v_version_clearance" AS ENUM('none', 'public-trust', 'secret', 'top-secret', 'ts-sci');
  CREATE TYPE "public"."enum__jobs_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_leads_inquiry_type" AS ENUM('service', 'quote', 'custom-build', 'general', 'career', 'event', 'media');
  CREATE TYPE "public"."enum_leads_organization_type" AS ENUM('government', 'commercial', 'education', 'healthcare', 'other', 'individual');
  CREATE TYPE "public"."enum_leads_timeline" AS ENUM('asap', '30-days', '1-3-months', '3-6-months', 'exploring');
  CREATE TYPE "public"."enum_leads_status" AS ENUM('new', 'contacted', 'qualified', 'closed');
  CREATE TYPE "public"."enum_store_categories_icon" AS ENUM('landmark', 'building', 'graduation-cap', 'heart-pulse', 'headset', 'cart', 'server', 'database', 'network', 'shield', 'phone', 'map', 'wrench', 'laptop', 'cable', 'cloud', 'life-buoy', 'megaphone', 'settings', 'briefcase');
  CREATE TYPE "public"."enum_quote_requests_product_vendor" AS ENUM('ingram', 'pax8');
  CREATE TYPE "public"."enum_quote_requests_billing_term" AS ENUM('monthly', 'annual', 'one-time');
  CREATE TYPE "public"."enum_quote_requests_organization_type" AS ENUM('government', 'commercial', 'education', 'healthcare', 'other', 'individual');
  CREATE TYPE "public"."enum_quote_requests_status" AS ENUM('sent', 'manual', 'quoted');
  CREATE TYPE "public"."enum_quote_requests_manual_reason" AS ENUM('no-price', 'volume', 'unavailable', 'email-failed', 'out-of-stock');
  CREATE TYPE "public"."enum_distributor_lists_distributor" AS ENUM('ingram', 'pax8');
  CREATE TYPE "public"."enum_distributor_lists_kind" AS ENUM('category', 'brand');
  CREATE TYPE "public"."enum_store_syncs_status" AS ENUM('running', 'success', 'failed');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TABLE "solutions_audiences" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_capabilities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_scenarios" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "solutions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"title" varchar NOT NULL,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"icon" "enum_solutions_icon" NOT NULL,
  	"short_description" varchar NOT NULL,
  	"cta_label" varchar NOT NULL,
  	"hero_headline" varchar NOT NULL,
  	"hero_intro" varchar NOT NULL,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "solutions_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"solutions_id" integer
  );
  
  CREATE TABLE "capabilities_offerings" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "capabilities" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"title" varchar NOT NULL,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"icon" "enum_capabilities_icon" NOT NULL,
  	"summary" varchar NOT NULL,
  	"description" jsonb,
  	"starting_context" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "partners" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"name" varchar NOT NULL,
  	"logo_id" integer NOT NULL,
  	"category" "enum_partners_category" NOT NULL,
  	"website" varchar,
  	"featured" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"intro" varchar,
  	"content" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_intro" varchar,
  	"version_content" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "news" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"published_at" timestamp(3) with time zone,
  	"excerpt" varchar,
  	"cover_image_id" integer,
  	"content" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_news_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_news_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_excerpt" varchar,
  	"version_cover_image_id" integer,
  	"version_content" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__news_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"start_date" timestamp(3) with time zone,
  	"end_date" timestamp(3) with time zone,
  	"format" "enum_events_format" DEFAULT 'in-person',
  	"location" varchar,
  	"registration_url" varchar,
  	"summary" varchar,
  	"cover_image_id" integer,
  	"content" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_events_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_events_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_start_date" timestamp(3) with time zone,
  	"version_end_date" timestamp(3) with time zone,
  	"version_format" "enum__events_v_version_format" DEFAULT 'in-person',
  	"version_location" varchar,
  	"version_registration_url" varchar,
  	"version_summary" varchar,
  	"version_cover_image_id" integer,
  	"version_content" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__events_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"location" varchar,
  	"workplace" "enum_jobs_workplace" DEFAULT 'on-site',
  	"employment_type" "enum_jobs_employment_type" DEFAULT 'full-time',
  	"clearance" "enum_jobs_clearance" DEFAULT 'none',
  	"summary" varchar,
  	"description" jsonb,
  	"apply_url" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_jobs_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_jobs_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_location" varchar,
  	"version_workplace" "enum__jobs_v_version_workplace" DEFAULT 'on-site',
  	"version_employment_type" "enum__jobs_v_version_employment_type" DEFAULT 'full-time',
  	"version_clearance" "enum__jobs_v_version_clearance" DEFAULT 'none',
  	"version_summary" varchar,
  	"version_description" jsonb,
  	"version_apply_url" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__jobs_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "leads" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"inquiry_type" "enum_leads_inquiry_type" NOT NULL,
  	"solution_id" integer,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"organization" varchar,
  	"organization_type" "enum_leads_organization_type",
  	"timeline" "enum_leads_timeline",
  	"message" varchar NOT NULL,
  	"details" jsonb,
  	"status" "enum_leads_status" DEFAULT 'new' NOT NULL,
  	"notes" varchar,
  	"source_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "store_categories_ingram_groups" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"category_id" integer NOT NULL,
  	"keyword" varchar,
  	"brand_id" integer
  );
  
  CREATE TABLE "store_categories_pax8_rules" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"brand_id" integer NOT NULL
  );
  
  CREATE TABLE "store_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"title" varchar NOT NULL,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"icon" "enum_store_categories_icon" NOT NULL,
  	"visible" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "store_categories_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "quote_requests" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"product_name" varchar NOT NULL,
  	"product_vendor" "enum_quote_requests_product_vendor" NOT NULL,
  	"product_vendor_product_id" varchar NOT NULL,
  	"product_part_number" varchar,
  	"product_brand" varchar,
  	"quantity" numeric NOT NULL,
  	"billing_term" "enum_quote_requests_billing_term",
  	"term_months" numeric,
  	"term_label" varchar,
  	"stock_at_request" varchar,
  	"restock_expected" timestamp(3) with time zone,
  	"price_cost" numeric,
  	"price_markup_percent" numeric,
  	"price_list_price" numeric,
  	"price_discount_percent" numeric,
  	"price_unit_price" numeric,
  	"price_total" numeric,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"organization" varchar NOT NULL,
  	"organization_type" "enum_quote_requests_organization_type",
  	"zip" varchar,
  	"address" varchar,
  	"notes" varchar,
  	"quote_number" varchar,
  	"status" "enum_quote_requests_status" DEFAULT 'manual' NOT NULL,
  	"manual_reason" "enum_quote_requests_manual_reason",
  	"customer_emailed_at" timestamp(3) with time zone,
  	"email_error" varchar,
  	"internal_notes" varchar,
  	"source_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "distributor_lists" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"distributor" "enum_distributor_lists_distributor" NOT NULL,
  	"kind" "enum_distributor_lists_kind" NOT NULL,
  	"product_count" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "store_syncs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"status" "enum_store_syncs_status" DEFAULT 'running' NOT NULL,
  	"started_by_id" integer,
  	"finished_at" timestamp(3) with time zone,
  	"summary" varchar,
  	"progress" varchar,
  	"error" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"_objectkey" varchar,
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
  	"focal_y" numeric
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
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
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
  	"solutions_id" integer,
  	"capabilities_id" integer,
  	"partners_id" integer,
  	"pages_id" integer,
  	"news_id" integer,
  	"events_id" integer,
  	"jobs_id" integer,
  	"leads_id" integer,
  	"store_categories_id" integer,
  	"quote_requests_id" integer,
  	"distributor_lists_id" integer,
  	"store_syncs_id" integer,
  	"media_id" integer,
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
  
  CREATE TABLE "home_page_process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_why_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" numeric NOT NULL,
  	"suffix" varchar,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "home_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar NOT NULL,
  	"hero_headline" varchar NOT NULL,
  	"hero_intro" varchar NOT NULL,
  	"solutions_heading" varchar NOT NULL,
  	"solutions_intro" varchar NOT NULL,
  	"process_heading" varchar NOT NULL,
  	"process_intro" varchar NOT NULL,
  	"expert_heading" varchar NOT NULL,
  	"expert_text" varchar NOT NULL,
  	"capabilities_heading" varchar NOT NULL,
  	"why_heading" varchar NOT NULL,
  	"why_text" varchar NOT NULL,
  	"partners_heading" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "about_page_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "about_page_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "about_page_team_certifications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "about_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_headline" varchar NOT NULL,
  	"hero_intro" varchar NOT NULL,
  	"mission" varchar NOT NULL,
  	"vision" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings_offices" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"address" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_naics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"code" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"primary" boolean
  );
  
  CREATE TABLE "site_settings_socioeconomic" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_certifications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"logo_id" integer
  );
  
  CREATE TABLE "site_settings_contract_vehicles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"contract_number" varchar
  );
  
  CREATE TABLE "site_settings_agencies" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"logo_id" integer
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"company_name" varchar NOT NULL,
  	"tagline" varchar,
  	"phone" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"lead_email" varchar,
  	"linkedin_url" varchar,
  	"cage" varchar,
  	"uei" varchar,
  	"duns" varchar,
  	"tax_id" varchar,
  	"capability_statement_id" integer,
  	"show_agencies" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "store_settings_quantity_discounts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"min_quantity" numeric NOT NULL,
  	"discount_percent" numeric NOT NULL
  );
  
  CREATE TABLE "store_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"show_prices" boolean DEFAULT true,
  	"markup_percent" numeric NOT NULL,
  	"custom_pricing_from" numeric,
  	"notification_email" varchar,
  	"salesperson" varchar,
  	"first_quote_number" numeric DEFAULT 1,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "store_settings_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"distributor_lists_id" integer
  );
  
  ALTER TABLE "solutions_audiences" ADD CONSTRAINT "solutions_audiences_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_capabilities" ADD CONSTRAINT "solutions_capabilities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_scenarios" ADD CONSTRAINT "solutions_scenarios_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_faqs" ADD CONSTRAINT "solutions_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions" ADD CONSTRAINT "solutions_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "solutions_rels" ADD CONSTRAINT "solutions_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_rels" ADD CONSTRAINT "solutions_rels_solutions_fk" FOREIGN KEY ("solutions_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "capabilities_offerings" ADD CONSTRAINT "capabilities_offerings_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."capabilities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "capabilities" ADD CONSTRAINT "capabilities_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partners" ADD CONSTRAINT "partners_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_parent_id_news_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."news"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_parent_id_events_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "jobs" ADD CONSTRAINT "jobs_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_jobs_v" ADD CONSTRAINT "_jobs_v_parent_id_jobs_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."jobs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_jobs_v" ADD CONSTRAINT "_jobs_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "leads" ADD CONSTRAINT "leads_solution_id_solutions_id_fk" FOREIGN KEY ("solution_id") REFERENCES "public"."solutions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "store_categories_ingram_groups" ADD CONSTRAINT "store_categories_ingram_groups_category_id_distributor_lists_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."distributor_lists"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "store_categories_ingram_groups" ADD CONSTRAINT "store_categories_ingram_groups_brand_id_distributor_lists_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."distributor_lists"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "store_categories_ingram_groups" ADD CONSTRAINT "store_categories_ingram_groups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."store_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "store_categories_pax8_rules" ADD CONSTRAINT "store_categories_pax8_rules_brand_id_distributor_lists_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."distributor_lists"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "store_categories_pax8_rules" ADD CONSTRAINT "store_categories_pax8_rules_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."store_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "store_categories_texts" ADD CONSTRAINT "store_categories_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."store_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "store_syncs" ADD CONSTRAINT "store_syncs_started_by_id_users_id_fk" FOREIGN KEY ("started_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_solutions_fk" FOREIGN KEY ("solutions_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_capabilities_fk" FOREIGN KEY ("capabilities_id") REFERENCES "public"."capabilities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_jobs_fk" FOREIGN KEY ("jobs_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_leads_fk" FOREIGN KEY ("leads_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_store_categories_fk" FOREIGN KEY ("store_categories_id") REFERENCES "public"."store_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_quote_requests_fk" FOREIGN KEY ("quote_requests_id") REFERENCES "public"."quote_requests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_distributor_lists_fk" FOREIGN KEY ("distributor_lists_id") REFERENCES "public"."distributor_lists"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_store_syncs_fk" FOREIGN KEY ("store_syncs_id") REFERENCES "public"."store_syncs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_process_steps" ADD CONSTRAINT "home_page_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_why_stats" ADD CONSTRAINT "home_page_why_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_values" ADD CONSTRAINT "about_page_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_highlights" ADD CONSTRAINT "about_page_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_team_certifications" ADD CONSTRAINT "about_page_team_certifications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_offices" ADD CONSTRAINT "site_settings_offices_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_naics" ADD CONSTRAINT "site_settings_naics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_socioeconomic" ADD CONSTRAINT "site_settings_socioeconomic_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_certifications" ADD CONSTRAINT "site_settings_certifications_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_certifications" ADD CONSTRAINT "site_settings_certifications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_contract_vehicles" ADD CONSTRAINT "site_settings_contract_vehicles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_agencies" ADD CONSTRAINT "site_settings_agencies_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_agencies" ADD CONSTRAINT "site_settings_agencies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_capability_statement_id_media_id_fk" FOREIGN KEY ("capability_statement_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "store_settings_quantity_discounts" ADD CONSTRAINT "store_settings_quantity_discounts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."store_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "store_settings_rels" ADD CONSTRAINT "store_settings_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."store_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "store_settings_rels" ADD CONSTRAINT "store_settings_rels_distributor_lists_fk" FOREIGN KEY ("distributor_lists_id") REFERENCES "public"."distributor_lists"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "solutions_audiences_order_idx" ON "solutions_audiences" USING btree ("_order");
  CREATE INDEX "solutions_audiences_parent_id_idx" ON "solutions_audiences" USING btree ("_parent_id");
  CREATE INDEX "solutions_capabilities_order_idx" ON "solutions_capabilities" USING btree ("_order");
  CREATE INDEX "solutions_capabilities_parent_id_idx" ON "solutions_capabilities" USING btree ("_parent_id");
  CREATE INDEX "solutions_scenarios_order_idx" ON "solutions_scenarios" USING btree ("_order");
  CREATE INDEX "solutions_scenarios_parent_id_idx" ON "solutions_scenarios" USING btree ("_parent_id");
  CREATE INDEX "solutions_faqs_order_idx" ON "solutions_faqs" USING btree ("_order");
  CREATE INDEX "solutions_faqs_parent_id_idx" ON "solutions_faqs" USING btree ("_parent_id");
  CREATE INDEX "solutions__order_idx" ON "solutions" USING btree ("_order");
  CREATE UNIQUE INDEX "solutions_slug_idx" ON "solutions" USING btree ("slug");
  CREATE INDEX "solutions_meta_meta_image_idx" ON "solutions" USING btree ("meta_image_id");
  CREATE INDEX "solutions_updated_at_idx" ON "solutions" USING btree ("updated_at");
  CREATE INDEX "solutions_created_at_idx" ON "solutions" USING btree ("created_at");
  CREATE INDEX "solutions_rels_order_idx" ON "solutions_rels" USING btree ("order");
  CREATE INDEX "solutions_rels_parent_idx" ON "solutions_rels" USING btree ("parent_id");
  CREATE INDEX "solutions_rels_path_idx" ON "solutions_rels" USING btree ("path");
  CREATE INDEX "solutions_rels_solutions_id_idx" ON "solutions_rels" USING btree ("solutions_id");
  CREATE INDEX "capabilities_offerings_order_idx" ON "capabilities_offerings" USING btree ("_order");
  CREATE INDEX "capabilities_offerings_parent_id_idx" ON "capabilities_offerings" USING btree ("_parent_id");
  CREATE INDEX "capabilities__order_idx" ON "capabilities" USING btree ("_order");
  CREATE UNIQUE INDEX "capabilities_slug_idx" ON "capabilities" USING btree ("slug");
  CREATE INDEX "capabilities_meta_meta_image_idx" ON "capabilities" USING btree ("meta_image_id");
  CREATE INDEX "capabilities_updated_at_idx" ON "capabilities" USING btree ("updated_at");
  CREATE INDEX "capabilities_created_at_idx" ON "capabilities" USING btree ("created_at");
  CREATE INDEX "partners__order_idx" ON "partners" USING btree ("_order");
  CREATE INDEX "partners_logo_idx" ON "partners" USING btree ("logo_id");
  CREATE INDEX "partners_updated_at_idx" ON "partners" USING btree ("updated_at");
  CREATE INDEX "partners_created_at_idx" ON "partners" USING btree ("created_at");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages" USING btree ("meta_image_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_meta_version_meta_image_idx" ON "_pages_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE UNIQUE INDEX "news_slug_idx" ON "news" USING btree ("slug");
  CREATE INDEX "news_cover_image_idx" ON "news" USING btree ("cover_image_id");
  CREATE INDEX "news_meta_meta_image_idx" ON "news" USING btree ("meta_image_id");
  CREATE INDEX "news_updated_at_idx" ON "news" USING btree ("updated_at");
  CREATE INDEX "news_created_at_idx" ON "news" USING btree ("created_at");
  CREATE INDEX "news__status_idx" ON "news" USING btree ("_status");
  CREATE INDEX "_news_v_parent_idx" ON "_news_v" USING btree ("parent_id");
  CREATE INDEX "_news_v_version_version_slug_idx" ON "_news_v" USING btree ("version_slug");
  CREATE INDEX "_news_v_version_version_cover_image_idx" ON "_news_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_news_v_version_meta_version_meta_image_idx" ON "_news_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_news_v_version_version_updated_at_idx" ON "_news_v" USING btree ("version_updated_at");
  CREATE INDEX "_news_v_version_version_created_at_idx" ON "_news_v" USING btree ("version_created_at");
  CREATE INDEX "_news_v_version_version__status_idx" ON "_news_v" USING btree ("version__status");
  CREATE INDEX "_news_v_created_at_idx" ON "_news_v" USING btree ("created_at");
  CREATE INDEX "_news_v_updated_at_idx" ON "_news_v" USING btree ("updated_at");
  CREATE INDEX "_news_v_latest_idx" ON "_news_v" USING btree ("latest");
  CREATE UNIQUE INDEX "events_slug_idx" ON "events" USING btree ("slug");
  CREATE INDEX "events_cover_image_idx" ON "events" USING btree ("cover_image_id");
  CREATE INDEX "events_meta_meta_image_idx" ON "events" USING btree ("meta_image_id");
  CREATE INDEX "events_updated_at_idx" ON "events" USING btree ("updated_at");
  CREATE INDEX "events_created_at_idx" ON "events" USING btree ("created_at");
  CREATE INDEX "events__status_idx" ON "events" USING btree ("_status");
  CREATE INDEX "_events_v_parent_idx" ON "_events_v" USING btree ("parent_id");
  CREATE INDEX "_events_v_version_version_slug_idx" ON "_events_v" USING btree ("version_slug");
  CREATE INDEX "_events_v_version_version_cover_image_idx" ON "_events_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_events_v_version_meta_version_meta_image_idx" ON "_events_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_events_v_version_version_updated_at_idx" ON "_events_v" USING btree ("version_updated_at");
  CREATE INDEX "_events_v_version_version_created_at_idx" ON "_events_v" USING btree ("version_created_at");
  CREATE INDEX "_events_v_version_version__status_idx" ON "_events_v" USING btree ("version__status");
  CREATE INDEX "_events_v_created_at_idx" ON "_events_v" USING btree ("created_at");
  CREATE INDEX "_events_v_updated_at_idx" ON "_events_v" USING btree ("updated_at");
  CREATE INDEX "_events_v_latest_idx" ON "_events_v" USING btree ("latest");
  CREATE UNIQUE INDEX "jobs_slug_idx" ON "jobs" USING btree ("slug");
  CREATE INDEX "jobs_meta_meta_image_idx" ON "jobs" USING btree ("meta_image_id");
  CREATE INDEX "jobs_updated_at_idx" ON "jobs" USING btree ("updated_at");
  CREATE INDEX "jobs_created_at_idx" ON "jobs" USING btree ("created_at");
  CREATE INDEX "jobs__status_idx" ON "jobs" USING btree ("_status");
  CREATE INDEX "_jobs_v_parent_idx" ON "_jobs_v" USING btree ("parent_id");
  CREATE INDEX "_jobs_v_version_version_slug_idx" ON "_jobs_v" USING btree ("version_slug");
  CREATE INDEX "_jobs_v_version_meta_version_meta_image_idx" ON "_jobs_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_jobs_v_version_version_updated_at_idx" ON "_jobs_v" USING btree ("version_updated_at");
  CREATE INDEX "_jobs_v_version_version_created_at_idx" ON "_jobs_v" USING btree ("version_created_at");
  CREATE INDEX "_jobs_v_version_version__status_idx" ON "_jobs_v" USING btree ("version__status");
  CREATE INDEX "_jobs_v_created_at_idx" ON "_jobs_v" USING btree ("created_at");
  CREATE INDEX "_jobs_v_updated_at_idx" ON "_jobs_v" USING btree ("updated_at");
  CREATE INDEX "_jobs_v_latest_idx" ON "_jobs_v" USING btree ("latest");
  CREATE INDEX "leads_solution_idx" ON "leads" USING btree ("solution_id");
  CREATE INDEX "leads_updated_at_idx" ON "leads" USING btree ("updated_at");
  CREATE INDEX "leads_created_at_idx" ON "leads" USING btree ("created_at");
  CREATE INDEX "store_categories_ingram_groups_order_idx" ON "store_categories_ingram_groups" USING btree ("_order");
  CREATE INDEX "store_categories_ingram_groups_parent_id_idx" ON "store_categories_ingram_groups" USING btree ("_parent_id");
  CREATE INDEX "store_categories_ingram_groups_category_idx" ON "store_categories_ingram_groups" USING btree ("category_id");
  CREATE INDEX "store_categories_ingram_groups_brand_idx" ON "store_categories_ingram_groups" USING btree ("brand_id");
  CREATE INDEX "store_categories_pax8_rules_order_idx" ON "store_categories_pax8_rules" USING btree ("_order");
  CREATE INDEX "store_categories_pax8_rules_parent_id_idx" ON "store_categories_pax8_rules" USING btree ("_parent_id");
  CREATE INDEX "store_categories_pax8_rules_brand_idx" ON "store_categories_pax8_rules" USING btree ("brand_id");
  CREATE INDEX "store_categories__order_idx" ON "store_categories" USING btree ("_order");
  CREATE UNIQUE INDEX "store_categories_slug_idx" ON "store_categories" USING btree ("slug");
  CREATE INDEX "store_categories_updated_at_idx" ON "store_categories" USING btree ("updated_at");
  CREATE INDEX "store_categories_created_at_idx" ON "store_categories" USING btree ("created_at");
  CREATE INDEX "store_categories_texts_order_parent" ON "store_categories_texts" USING btree ("order","parent_id");
  CREATE UNIQUE INDEX "quote_requests_quote_number_idx" ON "quote_requests" USING btree ("quote_number");
  CREATE INDEX "quote_requests_updated_at_idx" ON "quote_requests" USING btree ("updated_at");
  CREATE INDEX "quote_requests_created_at_idx" ON "quote_requests" USING btree ("created_at");
  CREATE INDEX "distributor_lists_updated_at_idx" ON "distributor_lists" USING btree ("updated_at");
  CREATE INDEX "distributor_lists_created_at_idx" ON "distributor_lists" USING btree ("created_at");
  CREATE UNIQUE INDEX "distributor_kind_name_idx" ON "distributor_lists" USING btree ("distributor","kind","name");
  CREATE INDEX "store_syncs_started_by_idx" ON "store_syncs" USING btree ("started_by_id");
  CREATE INDEX "store_syncs_updated_at_idx" ON "store_syncs" USING btree ("updated_at");
  CREATE INDEX "store_syncs_created_at_idx" ON "store_syncs" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_solutions_id_idx" ON "payload_locked_documents_rels" USING btree ("solutions_id");
  CREATE INDEX "payload_locked_documents_rels_capabilities_id_idx" ON "payload_locked_documents_rels" USING btree ("capabilities_id");
  CREATE INDEX "payload_locked_documents_rels_partners_id_idx" ON "payload_locked_documents_rels" USING btree ("partners_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_news_id_idx" ON "payload_locked_documents_rels" USING btree ("news_id");
  CREATE INDEX "payload_locked_documents_rels_events_id_idx" ON "payload_locked_documents_rels" USING btree ("events_id");
  CREATE INDEX "payload_locked_documents_rels_jobs_id_idx" ON "payload_locked_documents_rels" USING btree ("jobs_id");
  CREATE INDEX "payload_locked_documents_rels_leads_id_idx" ON "payload_locked_documents_rels" USING btree ("leads_id");
  CREATE INDEX "payload_locked_documents_rels_store_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("store_categories_id");
  CREATE INDEX "payload_locked_documents_rels_quote_requests_id_idx" ON "payload_locked_documents_rels" USING btree ("quote_requests_id");
  CREATE INDEX "payload_locked_documents_rels_distributor_lists_id_idx" ON "payload_locked_documents_rels" USING btree ("distributor_lists_id");
  CREATE INDEX "payload_locked_documents_rels_store_syncs_id_idx" ON "payload_locked_documents_rels" USING btree ("store_syncs_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
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
  CREATE INDEX "home_page_process_steps_order_idx" ON "home_page_process_steps" USING btree ("_order");
  CREATE INDEX "home_page_process_steps_parent_id_idx" ON "home_page_process_steps" USING btree ("_parent_id");
  CREATE INDEX "home_page_why_stats_order_idx" ON "home_page_why_stats" USING btree ("_order");
  CREATE INDEX "home_page_why_stats_parent_id_idx" ON "home_page_why_stats" USING btree ("_parent_id");
  CREATE INDEX "about_page_values_order_idx" ON "about_page_values" USING btree ("_order");
  CREATE INDEX "about_page_values_parent_id_idx" ON "about_page_values" USING btree ("_parent_id");
  CREATE INDEX "about_page_highlights_order_idx" ON "about_page_highlights" USING btree ("_order");
  CREATE INDEX "about_page_highlights_parent_id_idx" ON "about_page_highlights" USING btree ("_parent_id");
  CREATE INDEX "about_page_team_certifications_order_idx" ON "about_page_team_certifications" USING btree ("_order");
  CREATE INDEX "about_page_team_certifications_parent_id_idx" ON "about_page_team_certifications" USING btree ("_parent_id");
  CREATE INDEX "site_settings_offices_order_idx" ON "site_settings_offices" USING btree ("_order");
  CREATE INDEX "site_settings_offices_parent_id_idx" ON "site_settings_offices" USING btree ("_parent_id");
  CREATE INDEX "site_settings_naics_order_idx" ON "site_settings_naics" USING btree ("_order");
  CREATE INDEX "site_settings_naics_parent_id_idx" ON "site_settings_naics" USING btree ("_parent_id");
  CREATE INDEX "site_settings_socioeconomic_order_idx" ON "site_settings_socioeconomic" USING btree ("_order");
  CREATE INDEX "site_settings_socioeconomic_parent_id_idx" ON "site_settings_socioeconomic" USING btree ("_parent_id");
  CREATE INDEX "site_settings_certifications_order_idx" ON "site_settings_certifications" USING btree ("_order");
  CREATE INDEX "site_settings_certifications_parent_id_idx" ON "site_settings_certifications" USING btree ("_parent_id");
  CREATE INDEX "site_settings_certifications_logo_idx" ON "site_settings_certifications" USING btree ("logo_id");
  CREATE INDEX "site_settings_contract_vehicles_order_idx" ON "site_settings_contract_vehicles" USING btree ("_order");
  CREATE INDEX "site_settings_contract_vehicles_parent_id_idx" ON "site_settings_contract_vehicles" USING btree ("_parent_id");
  CREATE INDEX "site_settings_agencies_order_idx" ON "site_settings_agencies" USING btree ("_order");
  CREATE INDEX "site_settings_agencies_parent_id_idx" ON "site_settings_agencies" USING btree ("_parent_id");
  CREATE INDEX "site_settings_agencies_logo_idx" ON "site_settings_agencies" USING btree ("logo_id");
  CREATE INDEX "site_settings_capability_statement_idx" ON "site_settings" USING btree ("capability_statement_id");
  CREATE INDEX "store_settings_quantity_discounts_order_idx" ON "store_settings_quantity_discounts" USING btree ("_order");
  CREATE INDEX "store_settings_quantity_discounts_parent_id_idx" ON "store_settings_quantity_discounts" USING btree ("_parent_id");
  CREATE INDEX "store_settings_rels_order_idx" ON "store_settings_rels" USING btree ("order");
  CREATE INDEX "store_settings_rels_parent_idx" ON "store_settings_rels" USING btree ("parent_id");
  CREATE INDEX "store_settings_rels_path_idx" ON "store_settings_rels" USING btree ("path");
  CREATE INDEX "store_settings_rels_distributor_lists_id_idx" ON "store_settings_rels" USING btree ("distributor_lists_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "solutions_audiences" CASCADE;
  DROP TABLE "solutions_capabilities" CASCADE;
  DROP TABLE "solutions_scenarios" CASCADE;
  DROP TABLE "solutions_faqs" CASCADE;
  DROP TABLE "solutions" CASCADE;
  DROP TABLE "solutions_rels" CASCADE;
  DROP TABLE "capabilities_offerings" CASCADE;
  DROP TABLE "capabilities" CASCADE;
  DROP TABLE "partners" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "news" CASCADE;
  DROP TABLE "_news_v" CASCADE;
  DROP TABLE "events" CASCADE;
  DROP TABLE "_events_v" CASCADE;
  DROP TABLE "jobs" CASCADE;
  DROP TABLE "_jobs_v" CASCADE;
  DROP TABLE "leads" CASCADE;
  DROP TABLE "store_categories_ingram_groups" CASCADE;
  DROP TABLE "store_categories_pax8_rules" CASCADE;
  DROP TABLE "store_categories" CASCADE;
  DROP TABLE "store_categories_texts" CASCADE;
  DROP TABLE "quote_requests" CASCADE;
  DROP TABLE "distributor_lists" CASCADE;
  DROP TABLE "store_syncs" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "home_page_process_steps" CASCADE;
  DROP TABLE "home_page_why_stats" CASCADE;
  DROP TABLE "home_page" CASCADE;
  DROP TABLE "about_page_values" CASCADE;
  DROP TABLE "about_page_highlights" CASCADE;
  DROP TABLE "about_page_team_certifications" CASCADE;
  DROP TABLE "about_page" CASCADE;
  DROP TABLE "site_settings_offices" CASCADE;
  DROP TABLE "site_settings_naics" CASCADE;
  DROP TABLE "site_settings_socioeconomic" CASCADE;
  DROP TABLE "site_settings_certifications" CASCADE;
  DROP TABLE "site_settings_contract_vehicles" CASCADE;
  DROP TABLE "site_settings_agencies" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "store_settings_quantity_discounts" CASCADE;
  DROP TABLE "store_settings" CASCADE;
  DROP TABLE "store_settings_rels" CASCADE;
  DROP TYPE "public"."enum_solutions_icon";
  DROP TYPE "public"."enum_capabilities_icon";
  DROP TYPE "public"."enum_partners_category";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum_news_status";
  DROP TYPE "public"."enum__news_v_version_status";
  DROP TYPE "public"."enum_events_format";
  DROP TYPE "public"."enum_events_status";
  DROP TYPE "public"."enum__events_v_version_format";
  DROP TYPE "public"."enum__events_v_version_status";
  DROP TYPE "public"."enum_jobs_workplace";
  DROP TYPE "public"."enum_jobs_employment_type";
  DROP TYPE "public"."enum_jobs_clearance";
  DROP TYPE "public"."enum_jobs_status";
  DROP TYPE "public"."enum__jobs_v_version_workplace";
  DROP TYPE "public"."enum__jobs_v_version_employment_type";
  DROP TYPE "public"."enum__jobs_v_version_clearance";
  DROP TYPE "public"."enum__jobs_v_version_status";
  DROP TYPE "public"."enum_leads_inquiry_type";
  DROP TYPE "public"."enum_leads_organization_type";
  DROP TYPE "public"."enum_leads_timeline";
  DROP TYPE "public"."enum_leads_status";
  DROP TYPE "public"."enum_store_categories_icon";
  DROP TYPE "public"."enum_quote_requests_product_vendor";
  DROP TYPE "public"."enum_quote_requests_billing_term";
  DROP TYPE "public"."enum_quote_requests_organization_type";
  DROP TYPE "public"."enum_quote_requests_status";
  DROP TYPE "public"."enum_quote_requests_manual_reason";
  DROP TYPE "public"."enum_distributor_lists_distributor";
  DROP TYPE "public"."enum_distributor_lists_kind";
  DROP TYPE "public"."enum_store_syncs_status";
  DROP TYPE "public"."enum_users_role";`)
}
