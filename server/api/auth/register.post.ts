import { z } from 'zod'
import { Argon2id } from 'oslo/password'
import { userRepo } from '~/server/di'
import { lucia } from '~/utils/auth'

const registerScema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),

})

export default defineEventHandler(async (event) => {
  const data = await readValidatedBody(event, registerScema.parse)

  const passwordHash = await new Argon2id().hash(data.password)
  const createdUser = await userRepo.create({
    username: data.username,
    passwordHash,
  })

  const session = await lucia.createSession(createdUser.id, {})
  const sessionCookie = lucia.createSessionCookie(session.id)
  setCookie(event, sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
})
