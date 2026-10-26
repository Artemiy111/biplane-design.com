# syntax=docker/dockerfile:1
# check=skip=SecretsUsedInArgOrEnv

# ---------- build ----------
FROM oven/bun:1.4.4-alpine AS builder

WORKDIR /app

# The build runs on Node, not Bun: modern Nuxt modules use Node APIs that
# Bun does not implement yet (`module.findPackageJSON`, for instance in
# `nuxt-og-image`), which crash `nuxt build` in this image.
RUN apk add --no-cache nodejs

# No runtime env is needed here: `nuxt.config.ts` no longer parses the env
# schema, so builds do not depend on database or S3 credentials.
ENV NUXT_TELEMETRY_DISABLED=1

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

# Nitro's traced `.output/server/node_modules` contains only the files it
# could resolve statically, which leaves some packages broken (e.g. `ofetch`
# inside `ipx` has no `dist/index.mjs`). Dropping it makes every import
# resolve from the full `node_modules` copied next to `.output` below.
RUN node ./node_modules/nuxt/bin/nuxt.mjs build \
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
