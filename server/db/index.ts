import { drizzle } from 'drizzle-orm/libsql'

import { env } from '../utils/env'
import * as schema from './schema'

export const db = drizzle({
  connection: {
    url: env.DATABASE_URL,
    authToken: env.DATABASE_AUTH_TOKEN,
  }, schema, logger: false, casing: 'snake_case',
})

export type Db = typeof db
