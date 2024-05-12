import { z } from 'zod'
import { HttpErrorCode, createHttpError } from '../../exceptions'
import { getGroupsUseCase, createGroupUseCase } from '~/server/di'

export default defineEventHandler(async (event) => {
  const dummyLogin = {
    email: 'art@art.art',
    password: 'artartart'
  }

  switch (event.method) {
    case 'GET': {
      const res = await getGroupsUseCase.execute()
      if (!res.ok) throw createHttpError(HttpErrorCode.InternalServerError, res.error)
      return res.value
    }
    case 'POST': {
      const Body = z.object({
        title: z.string(),
        uri: z.string(),
      })

      const body = await readValidatedBody(event, Body.parse)
      const res = await createGroupUseCase.execute(body, dummyLogin)
      if (!res.ok) throw createHttpError(HttpErrorCode.InternalServerError, res.error)
      return res.value
    }
  }
})
