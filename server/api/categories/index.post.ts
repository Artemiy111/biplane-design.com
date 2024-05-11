import { z } from 'zod'
import { HttpErrorCode, createHttpError } from '../../exceptions'
import { createCategoryUseCase } from '~/server/di'


export default defineEventHandler(async (event) => {
  switch (event.method) {
    case 'POST': {
      const Body = z.object({
        groupId: z.number(),
        title: z.string(),
        uri: z.string(),
        order: z.number(),
      })
      const body = await readValidatedBody(event, Body.parse)
      const res = await createCategoryUseCase.execute(body)
      if (!res.ok) throw createHttpError(HttpErrorCode.InternalServerError)
      return res.value
    }
  }
})