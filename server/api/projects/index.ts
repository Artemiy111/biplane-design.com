import { z } from 'zod'
import { authRepo, projectRepo } from '~/server/di'

export default defineEventHandler(async (event) => {
  switch (event.method) {
    case 'GET': {
      const QuerySchema = z.object({
        uri: z.string().optional(),
      })
      const query = await getValidatedQuery(event, QuerySchema.parse)
      if (query.uri) {
        return await projectRepo.getOneByUri(query.uri)
      }

      return await projectRepo.getAll()
    }
    case 'POST': {
      const Body = z.object({
        categoryId: z.number(),
        title: z.string(),
        uri: z.string(),
        status: z.enum(['строится', 'в разработке', 'завершён']),
        yearStart: z.number().nullable(),
        yearEnd: z.number().nullable(),
        location: z.string(),
        isMinimal: z.boolean().optional(),
      })
      authRepo.assertAuthenticated(event)
      const body = await readValidatedBody(event, Body.parse)
      return await projectRepo.create(body)
    }
  }
})
