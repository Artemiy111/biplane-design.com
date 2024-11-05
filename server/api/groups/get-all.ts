import { groupRepo } from '~~/server/di'

export default defineEventHandler(async (event) => {
  return await groupRepo.getAll()
})
