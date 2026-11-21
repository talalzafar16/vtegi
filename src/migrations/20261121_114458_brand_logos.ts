import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "brand_logos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"brand" varchar NOT NULL,
  	"logo_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "brand_logos_id" integer;
  ALTER TABLE "brand_logos" ADD CONSTRAINT "brand_logos_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE UNIQUE INDEX "brand_logos_brand_idx" ON "brand_logos" USING btree ("brand");
  CREATE INDEX "brand_logos_logo_idx" ON "brand_logos" USING btree ("logo_id");
  CREATE INDEX "brand_logos_updated_at_idx" ON "brand_logos" USING btree ("updated_at");
  CREATE INDEX "brand_logos_created_at_idx" ON "brand_logos" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_brand_logos_fk" FOREIGN KEY ("brand_logos_id") REFERENCES "public"."brand_logos"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_brand_logos_id_idx" ON "payload_locked_documents_rels" USING btree ("brand_logos_id");
  ALTER TABLE "media" DROP COLUMN "_objectkey";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "brand_logos" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "brand_logos" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_brand_logos_fk";
  
  DROP INDEX "payload_locked_documents_rels_brand_logos_id_idx";
  ALTER TABLE "media" ADD COLUMN "_objectkey" varchar;
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "brand_logos_id";`)
}
