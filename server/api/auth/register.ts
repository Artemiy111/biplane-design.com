import { Argon2id } from 'oslo/password'

import { userRepo } from '~~/server/di'
import { registerSchema } from '~~/src/shared/config/validation'
import { lucia } from '~~/src/shared/lib/utils/auth'

export default defineEventHandler(async (event) => {
  throw createError({ statusCode: 500, message: 'Нельзя зарегистрировать нового администратора' })
  const data = await readValidatedBody(event, registerSchema.parse)

  const passwordHash = await new Argon2id().hash(data.password)
  const createdUser = await userRepo.create({
    username: data.username,
    passwordHash,
  })

  const session = await lucia.createSession(createdUser.id, {})
  const sessionCookie = lucia.createSessionCookie(session.id)
  setCookie(event, sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
})
