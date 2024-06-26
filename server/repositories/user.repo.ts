import { eq } from 'drizzle-orm'
import { Argon2id } from 'oslo/password'
import { db } from '../db'
import type { CreateUserDb } from '../db/schema'
import { users } from '../db/schema'
import type { UserId } from '../use-cases/types'

export class UserRepo {
  async getByUsername(username: string) {
    return (await db.query.users.findFirst({ where: eq(users.username, username) })) || null
  }

  async create(create: CreateUserDb) {
    return (await db.insert(users).values(create).returning())[0]
  }

  async changePassword(userId: UserId, newPassword: string) {
    const passwordHash = await new Argon2id().hash(newPassword)

    return (await db.update(users).set({
      passwordHash,
    }).where(eq(users.id, userId)).returning())[0]
  }
}
