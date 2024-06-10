import { z } from 'zod'
import { createProjectUseCase, getProjectsUseCase, getProjectByUriUseCase, authRepo } from '~/server/di'
import { HttpErrorCode, createHttpError } from '~/server/exceptions'

export default defineEventHandler(async (event) => {
  switch (event.method) {
    case 'GET': {
      const QuerySchema = z.object({
        uri: z.string().optional(),
      })
      const query = await getValidatedQuery(event, QuerySchema.parse)
      if (query.uri) {
        const res = await getProjectByUriUseCase.execute(query.uri)
        if (!res.ok) throw createHttpError(HttpErrorCode.InternalServerError, res.error)
        return res.value
      }

      const res = await getProjectsUseCase.execute()
      if (!res.ok) throw createHttpError(HttpErrorCode.InternalServerError, res.error)
      return res.value
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
      const res = await createProjectUseCase.execute(body)
      if (!res.ok) throw createHttpError(HttpErrorCode.InternalServerError, res.error)
      return res.value
    }
  }
})
