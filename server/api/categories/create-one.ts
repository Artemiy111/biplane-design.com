import { authRepo, categoryRepo } from '~~/server/di'
import { categorySchemas } from '~~/src/shared/config/validation'

export default defineEventHandler(async (event) => {
  authRepo.assertAuthenticated(event)
  const body = await readValidatedBody(event, categorySchemas.createSchema.parse)

  return await categoryRepo.create(body)
})
