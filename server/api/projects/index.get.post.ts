import { z } from 'zod'
import { createProjectUseCase, getProjectsUseCase } from '~/server/di'
import { HttpErrorCode, createHttpError } from '~/server/exceptions'


export default defineEventHandler(async (event) => {
  switch (event.method) {
    case 'GET': {
      const res = await getProjectsUseCase.execute()
      if (!res.ok) throw createHttpError(HttpErrorCode.InternalServerError)
      return res.value
    }
    case 'POST': {
      const Body = z.object({
        categoryId: z.number(),
        title: z.string(),
        uri: z.string(),
        location: z.string(),
        yearStart: z.number().nullable(),
        yearEnd: z.number().nullable(),
        status: z.string(),
      })
      const body = await readValidatedBody(event, Body.parse)
      const res = await createProjectUseCase.execute(body)
      if (!res.ok) throw createHttpError(HttpErrorCode.InternalServerError)
      return res.value
    }
  }
})