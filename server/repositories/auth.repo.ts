import type { H3Event } from 'h3'

import { TRPCError } from '@trpc/server'
import { hash, verify } from 'argon2'

import type { LoginDto } from '~~/src/shared/config/validation/auth'

import { sessionRepo } from './session.repo'
import { userRepo } from './user.repo'

export class AuthRepo {

  async login(dto: LoginDto, event: H3Event) {
    const existingUser = await userRepo.getByUsername(dto.username)
    if (!existingUser) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Неверные данные' })

    const isValidPassword = await verify(existingUser.passwordHash, dto.password)
    if (!isValidPassword) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Неверные данные' })

    const token = sessionRepo.generateSessionToken()
    const session = await sessionRepo.createSession(token, existingUser.id)
    setCookie(event, 'token', token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      expires: session.expiresAt,
      secure: import.meta.env.PROD as unknown as boolean,
    })
  }

  async register(dto: LoginDto, event: H3Event) {
    const passwordHash = await hash(dto.password)
    const createdUser = await userRepo.create({
      username: dto.username,
      passwordHash,
    })
    const token = sessionRepo.generateSessionToken()
    const session = await sessionRepo.createSession(token, createdUser.id)
    setCookie(event, 'token', token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      expires: session.expiresAt,
      secure: import.meta.env.PROD as unknown as boolean,
    })
  }

  async logout(event: H3Event, sessionId: string) {
    await sessionRepo.deleteSession(sessionId)
    deleteCookie(event, 'token')
  }
}

export const authRepo = new AuthRepo()