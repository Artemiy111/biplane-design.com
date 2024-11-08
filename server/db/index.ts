import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import { env } from '../shared/env'
import * as schema from './schema'

export const client = postgres(env.DATABASE_URL, { prepare: false })
export const db = drizzle(client, { schema: schema, logger: false, casing: 'snake_case' })

export type Db = typeof db
