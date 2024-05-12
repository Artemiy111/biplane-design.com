import { z } from 'zod'
import { HttpErrorCode, createHttpError } from '../../exceptions'
import { createCategoryUseCase } from '~/server/di'

export default defineEventHandler(async (event) => {
  const dummyLogin = {
    email: 'art@art.art',
    password: 'artartart',
  }

  switch (event.method) {
    case 'POST': {
      const Body = z.object({
        groupId: z.number(),
        title: z.string(),
        uri: z.string(),
        order: z.number(),
      })
      const body = await readValidatedBody(event, Body.parse)
      const res = await createCategoryUseCase.execute(body, dummyLogin)
      if (!res.ok) throw createHttpError(HttpErrorCode.InternalServerError, res.error)
      return res.value
    }
  }
})
