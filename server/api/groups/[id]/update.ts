import { authRepo, groupRepo } from '~~/server/di'
import { groupSchemas } from '~~/src/shared/config/validation'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params!.id! as string)

  authRepo.assertAuthenticated(event)
  const body = await readValidatedBody(event, groupSchemas.updateSchema.parse)
  return groupRepo.update(id, body)
})
