import { z } from 'zod'
import { verify } from '@node-rs/argon2'
import { authRepo } from '~/server/di'
import { lucia } from '~/utils/auth'

const loginScema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
})

export default defineEventHandler(async (event) => {
  const data = await readValidatedBody(event, loginScema.parse)

  const existingUser = await authRepo.getUserByUsername(data.username)
  if (!existingUser) throw createError({
    message: 'Incorrect username or password',
    statusCode: 400,
  })

  const isValidPassword = await verify(existingUser.passwordHash, data.password)
  if (!isValidPassword) throw createError({
    message: 'Incorrect username or password',
    statusCode: 400,
  })

  const session = await lucia.createSession(existingUser.id, {})
  const sessionCookie = lucia.createSessionCookie(session.id)
  setCookie(event, sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
})
