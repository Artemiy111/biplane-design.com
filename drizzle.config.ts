import type { Config } from 'drizzle-kit'

import { env } from './server/shared/env'

export default {
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  dialect: 'postgresql',
  out: './server/db/migrations',
  schema: './server/db/schema.ts',
  casing: 'snake_case',
} satisfies Config
