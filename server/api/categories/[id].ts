import { z } from 'zod'
import { getCategoryUseCase, updateCategoryUseCase, deleteCategoryUseCase } from '~/server/di'
import { HttpErrorCode, createHttpError } from '~/server/exceptions'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params!.id! as string)

  switch (event.method) {
    case 'GET': {
      const res = await getCategoryUseCase.execute(id)
      if (!res.ok) throw createHttpError(HttpErrorCode.InternalServerError)
      return res.value
    }

    case 'PUT': {
      const Body = z.object({
        groupId: z.number(),
        id: z.number(),
        title: z.string(),
        uri: z.string(),
        order: z.number().min(1),
      })
      const body = await readValidatedBody(event, Body.parse)
      const res = await updateCategoryUseCase.execute(body)
      if (!res.ok) throw createHttpError(HttpErrorCode.InternalServerError)
      return res.value
    }
    case 'DELETE': {
      const res = await deleteCategoryUseCase.execute(id)
      if (!res.ok) throw createHttpError(HttpErrorCode.InternalServerError)
      return res.value
    }
  }
})
