import { initTRPC, TRPCError } from '@trpc/server'
import { use, type H3Event } from 'h3'
import { verifyRequestOrigin } from 'lucia'

import { lucia } from '~~/src/shared/lib/utils/auth'

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
    if (!originHeader || !hostHeader || !verifyRequestOrigin(originHeader, [hostHeader]))
      throw new TRPCError({ code: 'FORBIDDEN' })
  }

  const sessionId = getCookie(event, lucia.sessionCookieName) ?? null
  if (!sessionId) return {
    event,
    session: null,
    user: null,
  }

  const { session, user } = await lucia.validateSession(sessionId)
  if (session && session.fresh) appendResponseHeader(event, 'Set-Cookie', lucia.createSessionCookie(session.id).serialize())

  if (!session) appendResponseHeader(event, 'Set-Cookie', lucia.createBlankSessionCookie().serialize())

  return {
    event,
    session,
    user,
  }
}
