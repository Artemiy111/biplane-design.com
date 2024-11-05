import { z } from 'zod'
import { authRepo, categoryRepo } from '~~/server/di'

const updateSchema = z.object({
  groupId: z.number(),
  id: z.number(),
  title: z.string(),
  uri: z.string(),
  order: z.number().min(1),
  layout: z.enum(['base', 'mini']),
})

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params!.id! as string)
  authRepo.assertAuthenticated(event)
  const body = await readValidatedBody(event, updateSchema.parse)

  return await categoryRepo.update(id, body)
})