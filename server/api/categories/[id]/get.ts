import { categoryRepo } from '~~/server/di'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params!.id! as string)

  return await categoryRepo.getOne(id)
})