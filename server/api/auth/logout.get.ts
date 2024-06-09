import { lucia } from '~/utils/auth'

export default eventHandler(async (event) => {
  if (!event.context.session) {
    throw createError({
      statusCode: 403,
    })
  }
  await lucia.invalidateSession(event.context.session.id)
  const sessionCookie = lucia.createBlankSessionCookie()
  setCookie(event, sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
})
