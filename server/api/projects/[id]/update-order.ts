import { z } from 'zod'

import { authRepo, projectRepo } from '~~/server/di'

const updateOrderSchema = z.object({
  order: z.number().min(0),
})

export default defineEventHandler(async (event) => {
  authRepo.assertAuthenticated(event)
  const id = Number(event.context.params!.id! as string)
  const data = await readValidatedBody(event, updateOrderSchema.parse)

  await projectRepo.updateOrder(id, data.order)
})
