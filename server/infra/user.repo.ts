import { eq } from 'drizzle-orm'
import { db } from '../db'
import type { CreateUserDb } from '../db/schema'
import { users } from '../db/schema'

export class UserRepo {
  async getUserByUsername(username: string) {
    return (await db.query.users.findFirst({ where: eq(users.username, username) })) || null
  }

  async createUser(create: CreateUserDb) {
    return (await db.insert(users).values(create).returning())[0]
  }
}
