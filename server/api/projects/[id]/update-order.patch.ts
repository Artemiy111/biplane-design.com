import { z } from 'zod'
import { projectRepo } from '~/server/di'

const changeOrderSchema = z.object({
  order: z.number().min(0),
})

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params!.id! as string)
  const data = await readValidatedBody(event, changeOrderSchema.parse)

  await projectRepo.updateOrder(id, data.order)
})
