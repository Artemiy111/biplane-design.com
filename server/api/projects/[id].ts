import { z } from 'zod'
import { getProjectUseCase, updateProjectUseCase, deleteProjectUseCase, authRepo } from '~/server/di'
import { HttpErrorCode, createHttpError } from '~/server/exceptions'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params!.id! as string)

  switch (event.method) {
    case 'GET': {
      const res = await getProjectUseCase.execute(id)
      if (!res.ok) throw createHttpError(HttpErrorCode.InternalServerError, res.error)
      return res.value
    }

    case 'PUT': {
      const Body = z.object({
        categoryId: z.number(),
        id: z.number(),
        title: z.string(),
        uri: z.string(),
        status: z.string(),
        yearStart: z.number().nullable(),
        yearEnd: z.number().nullable(),
        location: z.string(),
        order: z.number().min(1),
      })
      authRepo.assertAuthenticated(event)
      const body = await readValidatedBody(event, Body.parse)
      const res = await updateProjectUseCase.execute(body)
      if (!res.ok) throw createHttpError(HttpErrorCode.InternalServerError, res.error)
      return res.value
    }
    case 'DELETE': {
      authRepo.assertAuthenticated(event)
      const res = await deleteProjectUseCase.execute(id)
      if (!res.ok) throw createHttpError(HttpErrorCode.InternalServerError, res.error)
      return res.value
    }
  }
})
