import { Argon2id } from 'oslo/password'

import { userRepo } from '~~/server/di'
import { loginSchema } from '~~/src/shared/config/validation'
import { lucia } from '~~/src/shared/lib/utils/auth'

export default defineEventHandler(async (event) => {
  const data = await readValidatedBody(event, loginSchema.parse)

  const existingUser = await userRepo.getByUsername(data.username)
  if (!existingUser) throw createError({
    message: 'Incorrect username or password',
    statusCode: 400,
  })

  const isValidPassword = await new Argon2id().verify(existingUser.passwordHash, data.password)
  if (!isValidPassword) throw createError({
    message: 'Incorrect username or password',
    statusCode: 400,
  })

  const session = await lucia.createSession(existingUser.id, {})
  const sessionCookie = lucia.createSessionCookie(session.id)
  setCookie(event, sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
})
