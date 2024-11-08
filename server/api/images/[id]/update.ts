import { authRepo, imageRepo } from '~~/server/di'
import { imageSchemas } from '~~/src/shared/config/validation'

export default defineEventHandler(async (event) => {
  authRepo.assertAuthenticated(event)

  const id = event.context.params!.id
  const body = await readValidatedBody(event, imageSchemas.updateSchema.parse)
  console.log(id, body)
  return await imageRepo.update(id, body)
})
