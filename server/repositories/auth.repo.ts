import type { H3Event } from 'h3'

import { TRPCError } from '@trpc/server'
import { Argon2id } from 'oslo/password'

import type { LoginDto } from '~~/src/shared/config/validation/auth'

import { lucia } from '~~/src/shared/lib/utils/auth'

import type { UserRepo } from './user.repo'

export class AuthRepo {
  constructor(private userRepo: UserRepo) { }

  async login(dto: LoginDto, event: H3Event) {
    const existingUser = await this.userRepo.getByUsername(dto.username)
    if (!existingUser) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Неверные данные' })

    const isValidPassword = await new Argon2id().verify(existingUser.passwordHash, dto.password)
    if (!isValidPassword) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Неверные данные' })

    const session = await lucia.createSession(existingUser.id, {})
    const sessionCookie = lucia.createSessionCookie(session.id)
    setCookie(event, sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
  }

  async register(dto: LoginDto, event: H3Event) {
    const passwordHash = await new Argon2id().hash(dto.password)
    const createdUser = await this.userRepo.create({
      username: dto.username,
      passwordHash,
    })

    const session = await lucia.createSession(createdUser.id, {})
    const sessionCookie = lucia.createSessionCookie(session.id)
    setCookie(event, sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
  }

  async logout(event: H3Event, sessionId: string) {
    await lucia.invalidateSession(sessionId)
    const sessionCookie = lucia.createBlankSessionCookie()
    setCookie(event, sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
  }
}
