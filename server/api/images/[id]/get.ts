import { imageRepo } from '~~/server/di'

export default defineEventHandler(async (event) => {
  const id = event.context.params!.id
  return await imageRepo.getOne(id)
})