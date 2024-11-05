import { z } from 'zod'

import { authRepo, categoryRepo } from '~~/server/di'

const createSchema = z.object({
  groupId: z.number(),
  title: z.string(),
  uri: z.string(),
  order: z.number(),
  layout: z.enum(['base', 'mini']),
})

export default defineEventHandler(async (event) => {
  authRepo.assertAuthenticated(event)
  const body = await readValidatedBody(event, createSchema.parse)

  return await categoryRepo.create(body)
})
