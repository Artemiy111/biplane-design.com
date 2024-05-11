import { migrate } from 'drizzle-orm/postgres-js/migrator'

import { client, db } from '.'

await migrate(db, { migrationsFolder: 'server/db/migrations' })
console.log('Migration succesfull')
await client.end()
