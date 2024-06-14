import { z } from 'zod'
import { authRepo, projectRepo } from '~/server/di'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params!.id! as string)

  switch (event.method) {
    case 'GET': {
      return projectRepo.getOne(id)
    }

    case 'PUT': {
      const Body = z.object({
        categoryId: z.number(),
        title: z.string(),
        uri: z.string(),
        status: z.enum(['завершён', 'строится', 'в разработке']),
        yearStart: z.number().nullable(),
        yearEnd: z.number().nullable(),
        location: z.string().min(3).nullable(),
        order: z.number().min(1),
        isMinimal: z.boolean(),
      })
      authRepo.assertAuthenticated(event)
      const body = await readValidatedBody(event, Body.parse)
      return await projectRepo.update(id, body)
    }
    case 'DELETE': {
      authRepo.assertAuthenticated(event)
      return await projectRepo.delete(id)
    }
  }
})
