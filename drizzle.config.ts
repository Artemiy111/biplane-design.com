import { defineConfig } from 'drizzle-kit'

import { env } from './server/utils/env'

export default defineConfig({
  dbCredentials: {
    url: env.DATABASE_URL,
    authToken: env.DATABASE_AUTH_TOKEN,
  },
  dialect: 'turso',
  out: './server/db/migrations',
  schema: './server/db/schema.ts',
  casing: 'snake_case',
})
