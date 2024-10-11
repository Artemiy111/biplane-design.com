/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { Lucia } from 'lucia'
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle'
import { db } from '~/server/db'
import { users, sessions, type UserDb } from '~/server/db/schema'

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users)

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: !import.meta.dev,
    },
  },
  getUserAttributes: (attrs) => {
    return {
      username: attrs.username,
    }
  },
})

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia
    UserId: number
    DatabaseUserAttributes: DatabaseUserAttributes
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface DatabaseUserAttributes extends UserDb { }

}
