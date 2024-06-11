import { z } from 'zod'
import { authRepo, imageRepo } from '~/server/di'

export default defineEventHandler(async (event) => {
  switch (event.method) {
    case 'POST': {
      authRepo.assertAuthenticated(event)
      const FormData = z.object({
        projectId: z.preprocess(x => Number(x), z.number()),
        file: z.instanceof(File),
      })

      const formData = Object.fromEntries((await readFormData(event)).entries())
      const data = FormData.parse(formData)
      return await imageRepo.create(data)
    }
  }
})
