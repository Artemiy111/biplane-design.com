import 'dotenv/config'

import process from 'node:process'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const connectionString = process.env.DATABASE_URL!
export const client = postgres(connectionString, { prepare: false })
export const db = drizzle(client, { schema })

export type Db = typeof db
export type DbTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0]
