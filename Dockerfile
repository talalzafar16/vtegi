# Code + packages, not built yet: the "tools" service uses this to run migrations and seeders.
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat && npm install -g pnpm@12.16.1
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
ENV NODE_ENV=production

# The website. .env comes in as a build secret (never stored in the image): migrations run first,
# then the build renders static pages from the database.
FROM deps
RUN --mount=type=secret,id=env,target=/app/.env pnpm payload migrate && pnpm build
# Localhost only: the container shares the server's network, and Plesk's nginx forwards to it.
CMD ["node_modules/.bin/next", "start", "-H", "127.0.0.1"]
