FROM oven/bun

WORKDIR /app

COPY package.json bun.lockb /app/

RUN bun i

COPY . .

RUN bun run build

CMD [ "node", ".output/server/index.mjs" ]