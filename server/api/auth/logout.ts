import { authRepo } from '~~/server/di'
import { lucia } from '~~/src/shared/lib/utils/auth'

export default eventHandler(async (event) => {
  const { session } = authRepo.assertAuthenticated(event)
  await lucia.invalidateSession(session.id)
  const sessionCookie = lucia.createBlankSessionCookie()
  setCookie(event, sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
})
