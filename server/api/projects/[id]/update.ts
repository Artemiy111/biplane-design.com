import { z } from 'zod'

import { projectStatus } from '~~/server/db/schema'
import { authRepo, projectRepo } from '~~/server/di'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params!.id! as string)

  authRepo.assertAuthenticated(event)
  const body = await readValidatedBody(event, updateSchema.parse)
  return await projectRepo.update(id, body)
})
