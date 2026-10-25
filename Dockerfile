FROM oven/bun:1-alpine AS builder

WORKDIR /app

COPY package.json bun.lock ./
RUN bun i --frozen-lockfile

COPY . .

RUN bun run build


FROM oven/bun:1-alpine

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.output ./.output

CMD [ "bun", ".output/server/index.mjs" ]