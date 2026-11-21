# VTEGI Website

Marketing website and CMS for Virtual Technology Enterprise Group Inc.

**Stack:** Next.js (App Router) · Payload CMS 3 · PostgreSQL · Tailwind CSS v4 · TypeScript

## Getting started

Requirements: Node 20+, pnpm, Docker.

```bash
cp .env.example .env                  # set POSTGRES_PASSWORD and PAYLOAD_SECRET (others optional in dev)
docker compose up -d postgres         # local database
pnpm install                          # install dependencies
pnpm dev                              # creates the tables; http://localhost:3000
pnpm seed                             # optional: real VTEGI content
```

Open http://localhost:3000/admin and create the first user. It automatically becomes an **Admin**.

## Scripts

| Script                 | Purpose                                                |
| ---------------------- | ------------------------------------------------------ |
| `pnpm dev`             | Start the dev server                                   |
| `pnpm build` / `start` | Production build / serve                               |
| `pnpm lint`            | ESLint                                                 |
| `pnpm typecheck`       | TypeScript check                                       |
| `pnpm format`          | Prettier (sorts Tailwind classes too)                  |
| `pnpm generate:types`  | Regenerate `src/payload-types.ts` after schema changes |
| `pnpm seed`            | Load real VTEGI content (safe to re-run)               |

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
(**required in production**). Without `SMTP_HOST`, emails are printed to the dev server console.

## Seeding content

```bash
pnpm seed
```

Loads real VTEGI content (site settings, solutions, capabilities, partners with logos, and store
brand logos from those partner logos). Safe to re-run: it only creates what is missing and never
overwrites admin edits.

## Uploads (images and PDFs)

Uploads are stored in the local `/media` folder (git-ignored; on the VPS `./media`, mounted into the
app) and served through Payload at `/api/media/file/...`.

## Store product images

Hardware shows the product's **Icecat** photo (up to 5 on the product page), else the brand logo,
else the category icon; software shows the brand logo or the icon. Brand logos come from
**Store → Brand Logos** (an upload always wins) or automatically from Icecat for brands it knows.
Images are downloaded once and saved in `media/store/`, served by `/store/images/...`.

Set `ICECAT_USERNAME` (free Open Icecat account). After upgrading to Full Icecat, add
`ICECAT_APP_KEY` and restart: all brands get photos, no code change.

## Deploying on the VPS (Plesk + Docker)

| Part                                             | Runs in                                                    |
| ------------------------------------------------ | ---------------------------------------------------------- |
| Domain, HTTPS certificate, forwarding to the app | **Plesk** (its nginx)                                      |
| Database                                         | **Plesk's PostgreSQL** (backed up by Plesk Backup Manager) |
| Website and Redis cache                          | **Docker** (`docker-compose.yml`), on `127.0.0.1` only     |

Uploads are stored in `./media` next to the code (git-ignored). Plesk manages the firewall
(Tools & Settings → Firewall); `ufw` stays off.

### 1. Prepare the server (once)

```bash
# 4 GB swap: the build needs more memory than is free next to Plesk
sudo fallocate -l 4G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
# Docker (log out and back in afterwards)
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
```

### 2. Database in Plesk (once)

1. **Tools & Settings → Updates → Add/Remove Components**: install **PostgreSQL server**.
2. **Websites & Domains → (domain) → Databases → Add Database**: type **PostgreSQL**, a database
   name, a user and a password (letters and digits only).

### 3. Code and settings

```bash
git clone <repo-url> vtegi && cd vtegi
cp .env.example .env && chmod 600 .env && nano .env
```

In `.env`: `POSTGRES_USER`, `POSTGRES_DB` and `POSTGRES_PASSWORD` from step 2, `PAYLOAD_SECRET`
(`openssl rand -hex 32`), `NOINDEX=true` while testing, and the SMTP, Turnstile, Ingram and Pax8
keys. Leave `REDIS_URL` empty (Docker sets it).

### 4. First start (empty database)

Tables and content come first, because the build renders pages from the database.

```bash
docker compose run --rm tools pnpm payload migrate   # create the tables
docker compose run --rm tools pnpm seed              # site content
docker compose run --rm tools pnpm store:sync        # distributor names (a few minutes)
docker compose run --rm tools pnpm store:seed        # store categories
docker compose up -d --build                         # build and start the website
curl -I http://localhost:3000                        # expect 200
```

Then open `/admin`, create the first user (it becomes Admin) and fill in **Store Settings**.

### 5. Domain and HTTPS in Plesk

1. Point the domain (DNS A record) to the server's IP.
2. **Websites & Domains → Add Domain → Blank website**.
3. Domain → **SSL/TLS Certificates** → Let's Encrypt (domain name only), then turn on the
   redirect from http to https.
4. Domain → **Hosting & DNS → Apache & nginx**: untick **Proxy mode** and **Serve static files
   directly by nginx**, and paste into **Additional nginx directives**:

```nginx
location ~ / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}
```

**Going live:** repeat step 5 for `vtegi.com` (and a `www` record), then clear `NOINDEX` and run
`docker compose up -d --build app` (static pages read `NOINDEX` at build time).

### 6. Image cleanup (once)

Downloaded product photos and Icecat logos (`media/store/`) are deleted after 30 days, so they are
fetched fresh on the next view and unused ones don't pile up. Uploads elsewhere in `media/` are
never touched. Add this line with `crontab -e` (runs nightly at 04:00):

```
0 4 * * * cd /home/<user>/vtegi && docker compose exec -T app find /app/media/store -type f -mtime +30 -exec rm -f {} +
```

### 7. Backups

Plesk → **Tools & Settings → Backup Manager → Schedule**: daily, including databases, stored on
remote storage (not only on the server).

**Updates:** `git pull && docker compose up -d --build app` (new migrations run during the build).
**Logs:** `docker compose logs -f app`.

## Database changes

In development, Payload syncs the schema to the database automatically. Before deploying a schema
change, create a migration and commit it; the VPS runs it during the next build:

```bash
pnpm payload migrate:create <name>
```

Never point `pnpm dev` at the production database: a database changed by dev mode stops
migrations from running.

## Roles

- **Admin**: manages users, settings and all content.
- **Editor**: manages content only.
