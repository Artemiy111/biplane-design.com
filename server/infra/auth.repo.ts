import type { H3Event } from 'h3'

export class AuthRepo {
  assertAuthed(event: H3Event) {
    if (!event.context.user) throw createError({
      statusCode: 403,
    })
    return event.context.user
  }
}
