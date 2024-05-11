import { z } from 'zod'
import { getImageUseCase, updateImageUseCase, deleteImageUseCase } from '~/server/di'
import { HttpErrorCode, createHttpError } from '~/server/exceptions'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params!.id! as string)

  switch (event.method) {
    case 'GET': {
      const res = await getImageUseCase.execute(id)
      if (!res.ok) throw createHttpError(HttpErrorCode.InternalServerError)
      return res.value
    }
    case 'PUT': {
      const Body = z.object({
        id: z.number(),
        projectId: z.number(),
        filename: z.string(),
        alt: z.string(),
        order: z.number().min(1),
      })
      const body = await readValidatedBody(event, Body.parse)
      const res = await updateImageUseCase.execute(body)
      if (!res.ok) throw createHttpError(HttpErrorCode.InternalServerError)
      return res.value
    }
    case 'DELETE': {
      const res = await deleteImageUseCase.execute(id)
      if (!res.ok) throw createHttpError(HttpErrorCode.InternalServerError)
      return res.value
    }
  }
})
