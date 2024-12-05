import { sha256 } from '@oslojs/crypto/sha2'
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding'
import { eq } from 'drizzle-orm'

import { db } from '../db'
import { sessions, users, type SessionDb, type SessionId, type UserDb } from '../db/schema'

export type SessionValidationResult =
  | { session: SessionDb, user: UserDb }
  | { session: null, user: null }

export class SessionRepo {
  generateSessionToken(): string {
    const bytes = new Uint8Array(20)
    crypto.getRandomValues(bytes)
    const token = encodeBase32LowerCaseNoPadding(bytes)
    return token
  }

  async createSession(token: string, userId: number): Promise<SessionDb> {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
    const session: SessionDb = {
      id: sessionId,
      userId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    }
    await db.insert(sessions).values(session)
    return session
  }

  async validateSessionToken(token: string): Promise<SessionValidationResult> {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
    const result = await db
      .select({ user: users, session: sessions })
      .from(sessions)
      .innerJoin(users, eq(sessions.userId, users.id))
      .where(eq(sessions.id, sessionId))
    if (result.length < 1) {
      return { session: null, user: null }
    }
    const { user, session } = result[0]
    if (Date.now() >= session.expiresAt.getTime()) {
      await this.deleteSession(session.id)
      return { session: null, user: null }
    }
    const ONE_DAY = 1000 * 60 * 60 * 24
    if (Date.now() >= session.expiresAt.getTime() - ONE_DAY * 15) {
      session.expiresAt = new Date(Date.now() + ONE_DAY * 30)
      await db
        .update(sessions)
        .set({
          expiresAt: session.expiresAt,
        })
        .where(eq(sessions.id, session.id))
    }
    return { session, user }
  }

  async deleteSession(sessionId: SessionId): Promise<void> {
    await db.delete(sessions).where(eq(sessions.id, sessionId))
  }
}
