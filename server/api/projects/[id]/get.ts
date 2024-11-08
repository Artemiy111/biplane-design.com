import { projectRepo } from '~~/server/di'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params!.id! as string)
  return await projectRepo.getOne(id)
})
