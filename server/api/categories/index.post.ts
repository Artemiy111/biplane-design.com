import { z } from 'zod'
import { authRepo, categoryRepo } from '~/server/di'

export default defineEventHandler(async (event) => {
  const Body = z.object({
    groupId: z.number(),
    title: z.string(),
    uri: z.string(),
    order: z.number(),
  })
  authRepo.assertAuthenticated(event)
  const body = await readValidatedBody(event, Body.parse)
  return await categoryRepo.create(body)
})
