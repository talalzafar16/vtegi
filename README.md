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

Loads real VTEGI content (site settings, solutions, capabilities, partners with logos).
Safe to re-run: it only creates what is missing and never overwrites admin edits.

## Uploads (images and PDFs)

Uploads are stored in the local `/media` folder (git-ignored; on the VPS `./media`, mounted into the
app) and served through Payload at `/api/media/file/...`.

## Deploying on the VPS (Docker)

**Caddy** runs on the server itself (HTTPS, the only thing open to the internet) and forwards to
the app on `localhost:3000`. `docker-compose.yml` runs the **app**, **Postgres** and **Redis**
(cache), none reachable from outside. Data lives next to the code: database in `./pgdata`,
uploads in `./media` (both git-ignored). Never delete the project folder or run `git clean -x`
on the server: that deletes the database and images.

### 1. Prepare the server (once)

```bash
# 2 GB swap as a safety net
sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
# Firewall: SSH, HTTP and HTTPS only
sudo ufw allow OpenSSH && sudo ufw allow 80 && sudo ufw allow 443 && sudo ufw enable
# Docker (log out and back in afterwards)
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
# Caddy (runs as a service and starts on boot)
sudo apt install --yes debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo chmod o+r /usr/share/keyrings/caddy-stable-archive-keyring.gpg /etc/apt/sources.list.d/caddy-stable.list
sudo apt update && sudo apt install caddy
```

### 2. Code and settings

```bash
git clone <repo-url> vtegi && cd vtegi
cp .env.example .env && nano .env
```

In `.env` on the server:

- `POSTGRES_USER`, `POSTGRES_DB` (e.g. `vtegi`) and `POSTGRES_PASSWORD` (`openssl rand -hex 24`).
  They are used once, when the database is first created.
- `PAYLOAD_SECRET`: a long random value (`openssl rand -hex 32`)
- `NOINDEX=true` while testing on `new.vtegi.com`
- SMTP, Turnstile, Ingram and Pax8 keys as in `.env.example`

### 3. First start (empty database)

Tables and content come first, because the build renders pages from the database.

```bash
docker compose up -d postgres
docker compose run --rm tools pnpm payload migrate   # create the tables
docker compose run --rm tools pnpm seed              # site content
docker compose run --rm tools pnpm store:sync        # distributor names (a few minutes)
docker compose run --rm tools pnpm store:seed        # store categories
docker compose up -d --build                         # build and start the website
```

Then open `/admin`, create the first user (it becomes Admin) and fill in **Store Settings**
(markup, discounts, quote notifications email, salesperson, first quote number).

### 4. HTTPS with Caddy

Point `new.vtegi.com` (DNS A record) to the server's IP, put this in `/etc/caddy/Caddyfile` and run
`sudo systemctl reload caddy`. Caddy gets the certificate by itself.

```
new.vtegi.com {
	encode zstd gzip
	reverse_proxy 127.0.0.1:3000
}
```

**Going live:** point `vtegi.com` and `www` to the server, replace the Caddyfile with the block
below and reload Caddy, clear `NOINDEX`, then `docker compose up -d --build app` (static pages read
`NOINDEX` at build time).

```
www.vtegi.com {
	redir https://vtegi.com{uri} permanent
}

vtegi.com {
	encode zstd gzip
	reverse_proxy 127.0.0.1:3000
}
```

**Updates:** `git pull && docker compose up -d --build app` (new migrations run during the build).
**Logs:** `docker compose logs -f app` and `journalctl -u caddy -f`.
**Database access:** `ssh -L 5432:127.0.0.1:5432 <user>@<server-ip>`, then connect a database client to `localhost:5432`.

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
