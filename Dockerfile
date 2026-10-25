# syntax=docker/dockerfile:1
# check=skip=SecretsUsedInArgOrEnv

# ---------- build ----------
FROM oven/bun:1.4.4-alpine AS builder

WORKDIR /app

# `nuxt.config.ts` parses the whole env schema at build time, so the build
# needs these values even though the placeholders below are never used.
# The real runtime values are supplied by the deployment (see README).
ENV BASE_URL=http://localhost:3000 \
    DATABASE_URL=http://127.0.0.1:8080 \
    DATABASE_AUTH_TOKEN=build \
    AWS_ACCESS_KEY_ID=build \
    AWS_SECRET_ACCESS_KEY=build \
    ENDPOINT_URL=http://127.0.0.1:9000 \
    REGION=build \
    BUCKET_NAME=build \
    NUXT_TELEMETRY_DISABLED=1

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

# Nitro's traced `.output/server/node_modules` contains only the files it
# could resolve statically, which leaves some packages broken (e.g. `ofetch`
# inside `ipx` has no `dist/index.mjs`). Dropping it makes every import
# resolve from the full `node_modules` copied next to `.output` below.
RUN bun run build \
 && rm -rf .output/server/node_modules

# ---------- runtime ----------
FROM oven/bun:1.4.4-alpine

WORKDIR /app

# SSR tRPC calls itself at `${BASE_URL}/api/trpc` (src/shared/api/index.ts),
# so BASE_URL is the internal address, not the public domain. Keep it in
# sync with PORT and the value baked in at build time.
ENV NODE_ENV=production \
    NUXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    BASE_URL=http://localhost:3000

# `.output` is not self-contained on its own (see the note above), so the
# full node_modules has to sit next to it for imports to resolve.
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.output ./.output

USER bun

EXPOSE 3000

CMD ["bun", ".output/server/index.mjs"]
