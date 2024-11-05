import { z } from 'zod'
import { authRepo, imageRepo } from '~~/server/di'

export default defineEventHandler(async (event) => {
  authRepo.assertAuthenticated(event)
  const FormData = z.object({
    projectId: z.preprocess(x => Number(x), z.number()),
    fit: z.enum(['object-fill', 'object-contain', 'object-cover', 'object-none']).default('object-cover'),
    file: z.instanceof(File),
  })
  const formData = Object.fromEntries((await readFormData(event)).entries())
  const data = FormData.parse(formData)
  return await imageRepo.create(data)
})