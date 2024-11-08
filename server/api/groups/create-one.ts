import { authRepo, groupRepo } from '~~/server/di'
import { groupSchemas } from '~~/src/shared/config/validation/group'

export default defineEventHandler(async (event) => {
  authRepo.assertAuthenticated(event)
  const body = await readValidatedBody(event, groupSchemas.createSchema.parse)

  return await groupRepo.create(body)
})
