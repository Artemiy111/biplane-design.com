import type { H3Event } from 'h3'

export class AuthRepo {
  assertAuthenticated(event: H3Event) {
    if (!event.context.user || !event.context.session) throw createError({
      statusCode: 403,
    })
    return {
      session: event.context.session,
      user: event.context.user,
    }
  }
}
