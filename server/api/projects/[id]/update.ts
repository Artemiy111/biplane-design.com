import { z } from 'zod'

import { projectStatus } from '~~/server/db/schema'
import { authRepo, projectRepo } from '~~/server/di'

const updateSchema = z.object({
  categoryId: z.number(),
  title: z.string(),
  uri: z.string(),
  status: z.enum(projectStatus),
  yearStart: z.number().nullable(),
  yearEnd: z.number().nullable(),
  location: z.string().min(3).nullable(),
  order: z.number().min(1),
  isMinimal: z.boolean(),
})

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params!.id! as string)

  authRepo.assertAuthenticated(event)
  const body = await readValidatedBody(event, updateSchema.parse)
  return await projectRepo.update(id, body)
})
