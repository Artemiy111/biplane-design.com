import { z } from 'zod'
import { getProjectUseCase, updateProjectUseCase, deleteProjectUseCase } from '~/server/di'
import { HttpErrorCode, createHttpError } from '~/server/exceptions'


export default defineEventHandler(async (event) => {
  const id = Number(event.context.params!.id! as string)

  switch (event.method) {
    case 'GET': {
      const res = await getProjectUseCase.execute(id)
      if (!res.ok) throw createHttpError(HttpErrorCode.InternalServerError)
      return res.value
    }

    case "PUT": {
      const Body = z.object({
        id: z.number(),
        categoryId: z.number(),
        title: z.string(),
        uri: z.string(),
        location: z.string(),
        yearStart: z.number().nullable(),
        yearEnd: z.number().nullable(),
        status: z.string(),
        order: z.number().min(1)
      })
      const body = await readValidatedBody(event, Body.parse)
      const res = await updateProjectUseCase.execute(body)
      if (!res.ok) throw createHttpError(HttpErrorCode.InternalServerError)
      return res.value
    }
    case 'DELETE': {
      const res = await deleteProjectUseCase.execute(id)
      if (!res.ok) throw createHttpError(HttpErrorCode.InternalServerError)
      return res.value
    }
  }
})

