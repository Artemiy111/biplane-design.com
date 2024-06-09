import type { Config } from 'drizzle-kit'
import { env } from './server/shared/env'

export default {
  dialect: 'postgresql',
  schema: './server/db/schema.ts',
  out: './server/db/migrations',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
} satisfies Config
