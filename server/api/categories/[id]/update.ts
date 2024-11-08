import { authRepo, categoryRepo } from '~~/server/di'
import { categorySchemas } from '~~/src/shared/config/validation'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params!.id! as string)
  authRepo.assertAuthenticated(event)
  const body = await readValidatedBody(event, categorySchemas.updateSchema.parse)

  return await categoryRepo.update(id, body)
})
