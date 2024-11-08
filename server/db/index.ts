import { drizzle } from 'drizzle-orm/libsql'

import { env } from '../shared/env'
import * as schema from './schema'

export const db = drizzle({
  connection: {
    url: env.DATABASE_URL,
  }, schema, logger: false, casing: 'snake_case',
})

export type Db = typeof db
