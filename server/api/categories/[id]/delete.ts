import { authRepo, categoryRepo } from '~~/server/di'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params!.id! as string)
  authRepo.assertAuthenticated(event)

  return await categoryRepo.delete(id)
})