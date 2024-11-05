import { z } from 'zod'
import { imageFit } from '~~/server/db/schema'
import { authRepo, imageRepo } from '~~/server/di'

const updateSchema = z.object({
  alt: z.string(),
  order: z.number().min(1),
  fit: z.enum(imageFit),
})

export default defineEventHandler(async (event) => {
  authRepo.assertAuthenticated(event)

  const id = event.context.params!.id
  const body = await readValidatedBody(event, updateSchema.parse)
  console.log(id, body)
  return await imageRepo.update(id, body)
})