# VTEGI Website

Marketing website and CMS for Virtual Technology Enterprise Group Inc.

**Stack:** Next.js (App Router) · Payload CMS 3 · PostgreSQL · Tailwind CSS v4 · TypeScript

## Getting started

Requirements: Node 20+, Yarn 1, a Supabase project (Postgres).

```bash
cp .env.example .env      # set DATABASE_URL (Supabase) and PAYLOAD_SECRET (others optional in dev)
yarn                      # install dependencies
yarn dev                  # http://localhost:3000
```

Open http://localhost:3000/admin and create the first user. It automatically becomes an **Admin**.

> **Supabase note:** Payload talks to Postgres directly; we don't use Supabase's auto-generated REST API.
> Turn it off (Supabase → Project Settings → Data API) so Payload's tables are never exposed through it.

## Scripts

| Script                 | Purpose                                                |
| ---------------------- | ------------------------------------------------------ |
| `yarn dev`             | Start the dev server                                   |
| `yarn build` / `start` | Production build / serve                               |
| `yarn lint`            | ESLint                                                 |
| `yarn typecheck`       | TypeScript check                                       |
| `yarn format`          | Prettier (sorts Tailwind classes too)                  |
| `yarn generate:types`  | Regenerate `src/payload-types.ts` after schema changes |
| `yarn seed`            | Load real VTEGI content (safe to re-run)               |

## Project structure

```
src/
  app/
    (frontend)/      Public website (Tailwind is scoped here)
    (payload)/       Payload admin panel + API routes (generated, rarely edited)
  access/            Reusable access-control rules
  collections/       Payload collections (database schema)
  globals/           Single-instance settings (SiteSettings)
  fields/            Reusable field definitions
  components/
    ui/              Design-system primitives (Button, Section, Heading...)
    motion/          Animation primitives (Reveal, Counter, Marquee...)
    layout/          Site header (mega menu, mobile drawer) and footer
    home/            Home page sections
  features/
    request-form/    Request form: shared options + Zod schema, server action, emails, UI
  hooks/             Payload hooks (page revalidation on content changes)
  lib/               Shared helpers: CMS queries, navigation, utils
  seed/              Seed script, data and logo assets
  payload.config.ts  CMS configuration
```

The component styleguide is at http://localhost:3000/styleguide (development only).

## Pages

| Route                                                               | Content source                                          |
| ------------------------------------------------------------------- | ------------------------------------------------------- |
| `/`                                                                 | Home Page global + Solutions, Capabilities, Partners    |
| `/solutions`, `/solutions/[slug]`                                   | Solutions collection                                    |
| `/capabilities`, `/capabilities/[slug]`                             | Capabilities collection                                 |
| `/company/about`                                                    | About Page global                                       |
| `/company/careers`, `/company/news`, `/company/events` (+ `[slug]`) | Jobs, News, Events (published only)                     |
| `/partners`                                                         | Partners collection                                     |
| `/contracting`, `/contact`                                          | Site Settings                                           |
| `/request`                                                          | Request form (`?solution=` / `?inquiry=` pre-select)    |
| `/store`                                                            | Static "coming soon" page (e-commerce is a later phase) |
| `/[slug]`                                                           | Pages collection (e.g. `/privacy`, `/accessibility`)    |

Website queries run with `overrideAccess: false`, so drafts and admin-only data never reach the public site.

## Request form

Lives on the home page (`/#request`) and at `/request`. Link with a pre-selected solution:
`/request?solution=government`. Submissions are saved as **Leads** (admin-only) and trigger two emails:
a team alert (to _Site Settings → Website request recipient_) and a confirmation to the visitor.

Spam protection: honeypot field, minimum fill time, max 3 requests per email per hour, and
Cloudflare Turnstile when `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` are set
(**required in production**). Without `RESEND_API_KEY`, emails are printed to the dev server console.

## Seeding content

```bash
yarn seed
```

Loads real VTEGI content (site settings, solutions, capabilities, partners with logos).
Safe to re-run: it only creates what is missing and never overwrites admin edits.

## Uploads (images and PDFs)

When the `S3_*` variables are set, uploads are stored in **Supabase Storage** (S3 protocol);
otherwise in the local `/media` folder (git-ignored). Files are always served through Payload
(`/api/media/file/...`), so the bucket can stay private.

To copy existing local uploads to the bucket (one time), add the `S3_*` variables to `.env`, then:

```bash
yarn media:upload
```

## Deploying to Vercel (preview)

1. **Supabase Storage:** create a private bucket, then create S3 access keys
   (Project Settings → Storage → S3 Connection).
2. **Vercel:** import the GitHub repo and add these environment variables:
   `DATABASE_URL`, `PAYLOAD_SECRET`, `S3_BUCKET`, `S3_ENDPOINT`, `S3_REGION`, `S3_ACCESS_KEY_ID`,
   `S3_SECRET_ACCESS_KEY`, and `NOINDEX=true` (keeps the preview out of search engines).
3. Run `yarn media:upload` locally once so existing images are in the bucket, then deploy.

Optional: `RESEND_API_KEY` + `EMAIL_FROM` (emails) and the Turnstile keys (spam protection).

## Database changes

In development, Payload syncs the schema to the database automatically (use a dev Supabase project, not production).
For staging/production, create and run migrations:

```bash
yarn payload migrate:create
yarn payload migrate
```

## Roles

- **Admin**: manages users, settings and all content.
- **Editor**: manages content only.
