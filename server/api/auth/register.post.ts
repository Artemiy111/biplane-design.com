import { z } from 'zod'
import { hash } from '@node-rs/argon2'
import { authRepo } from '~/server/di'
import { lucia } from '~/utils/auth'

const registerScema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),

})

export default defineEventHandler(async (event) => {
  const data = await readValidatedBody(event, registerScema.parse)

  const passwordHash = await hash(data.password)
  const createdUser = await authRepo.createUser({
    username: data.username,
    passwordHash,
  })

  const session = await lucia.createSession(createdUser.id, {})
  const sessionCookie = lucia.createSessionCookie(session.id)
  setCookie(event, sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
})
