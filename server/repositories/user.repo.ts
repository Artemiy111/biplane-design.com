import { hash } from 'argon2'
import { eq } from 'drizzle-orm'

import type { CreateUserDb, UserDb } from '../db/schema'

import { db } from '../db'
import { users } from '../db/schema'

class UserRepo {
  async getByUsername(username: string): Promise<UserDb | null> {
    return (await db.query.users.findFirst({ where: eq(users.username, username) })) || null
  }

  async create(create: CreateUserDb): Promise<UserDb> {
    const [user] = await db.insert(users).values(create).returning()
    if (!user) throw new Error('Could not create user')
    return user
  }

  async changePassword(userId: UserDb['id'], newPassword: string): Promise<UserDb> {
    const passwordHash = await hash(newPassword)

    const [user] = await db.update(users).set({
      passwordHash,
    }).where(eq(users.id, userId)).returning()
    if (!user) throw new Error(`Could not find user with id '${userId}'`)
    return user
  }
}

export const userRepo = new UserRepo()
