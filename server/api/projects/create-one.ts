import { authRepo, projectRepo } from '~~/server/di'
import { projectSchemas } from '~~/src/shared/config/validation'

export default defineEventHandler(async (event) => {
  authRepo.assertAuthenticated(event)
  const body = await readValidatedBody(event, projectSchemas.createSchema.parse)
  return await projectRepo.create(body)
})
