import { z } from 'zod'
import { createProjectUseCase, getProjectsUseCase, getProjectByUriUseCase } from '~/server/di'
import { HttpErrorCode, createHttpError } from '~/server/exceptions'

export default defineEventHandler(async (event) => {
  const dummyLogin = {
    email: 'art@art.art',
    password: 'artartart',
  }

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
        status: z.string(),
        yearStart: z.number().nullable(),
        yearEnd: z.number().nullable(),
        location: z.string(),
      })
      const body = await readValidatedBody(event, Body.parse)
      const res = await createProjectUseCase.execute(body, dummyLogin)
      if (!res.ok) throw createHttpError(HttpErrorCode.InternalServerError, res.error)
      return res.value
    }
  }
})
