import { z } from 'zod'
import { authRepo, userRepo } from '~~/server/di'

const changePasswordSchema = z.object({
  newPassword: z.string().min(6),
})

export default defineEventHandler(async (event) => {
  const { user } = authRepo.assertAuthenticated(event)
  const data = await readValidatedBody(event, changePasswordSchema.parse)
  await userRepo.changePassword(user.id, data.newPassword)
})
