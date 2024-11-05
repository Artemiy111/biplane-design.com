import { z } from 'zod'

import { authRepo, groupRepo } from '~~/server/di'

const createSchema = z.object({
  title: z.string(),
  uri: z.string(),
})

export default defineEventHandler(async (event) => {
  authRepo.assertAuthenticated(event)
  const body = await readValidatedBody(event, createSchema.parse)

  return await groupRepo.create(body)
})
