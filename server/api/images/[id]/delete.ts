import { authRepo, imageRepo } from '~~/server/di'

export default defineEventHandler(async (event) => {
  authRepo.assertAuthenticated(event)

  const id = event.context.params!.id
  return await imageRepo.delete(id)
})
