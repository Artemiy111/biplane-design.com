import { defineConfig } from 'drizzle-kit'

import { env } from './server/utils/env'

export default defineConfig({
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  dialect: 'turso',
  out: './server/db/migrations',
  schema: './server/db/schema.ts',
  casing: 'snake_case',
})
