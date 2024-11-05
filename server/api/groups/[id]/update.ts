import { z } from 'zod'

import { authRepo, groupRepo } from '~~/server/di'

const updateSchema = z.object({
  id: z.number(),
  title: z.string(),
  uri: z.string(),
  order: z.number().min(1),
})

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params!.id! as string)

  authRepo.assertAuthenticated(event)
  const body = await readValidatedBody(event, updateSchema.parse)
  return groupRepo.update(id, body)
})
