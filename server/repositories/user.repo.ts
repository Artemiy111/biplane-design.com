import { hash } from 'argon2'
import { eq } from 'drizzle-orm'

import type { CreateUserDb, UserDb } from '../db/schema'
import type { UserId } from '../use-cases/types'

import { db } from '../db'
import { users } from '../db/schema'

export class UserRepo {
  async getByUsername(username: string): Promise<UserDb | null> {
    return (await db.query.users.findFirst({ where: eq(users.username, username) })) || null
  }

  async create(create: CreateUserDb): Promise<UserDb> {
    return (await db.insert(users).values(create).returning())[0]
  }

  async changePassword(userId: UserId, newPassword: string): Promise<UserDb> {
    const passwordHash = await hash(newPassword)

    return (await db.update(users).set({
      passwordHash,
    }).where(eq(users.id, userId)).returning())[0]
  }
}
