import type { H3Event } from 'h3'

import { initTRPC, TRPCError } from '@trpc/server'

import { sessionRepo } from '../repositories'

const t = initTRPC.context<typeof createContext>().create()

export const publicProcedure = t.procedure

export const router = t.router
export const middleware = t.middleware

export const authedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user || !ctx.session) throw new TRPCError({ code: 'UNAUTHORIZED' })

  return next({
    ctx: {
      session: ctx.session,
      user: ctx.user,
    },
  })
})

export async function createContext(event: H3Event) {
  if (event.method !== 'GET') {
    const originHeader = getHeader(event, 'Origin') ?? null
    const hostHeader = getHeader(event, 'Host') ?? null
    if (!originHeader || !hostHeader)
      throw new TRPCError({ code: 'FORBIDDEN' })
  }

  const token = getCookie(event, 'token') ?? null
  if (!token) return {
    event,
    session: null,
    user: null,
  }

  const { session, user } = await sessionRepo.validateSessionToken(token)

  if (session)
    setCookie(event, 'token', token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      expires: session.expiresAt,
      secure: import.meta.env.PROD as unknown as boolean,
    })

  if (!session) deleteCookie(event, 'token')

  return {
    event,
    session,
    user,
  }
}
