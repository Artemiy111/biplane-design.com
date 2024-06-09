import { z } from 'zod'
import { HttpErrorCode, createHttpError } from '../../exceptions'
import { getGroupsUseCase, createGroupUseCase, authRepo } from '~/server/di'

export default defineEventHandler(async (event) => {
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
      authRepo.assertAuthenticated(event)
      const body = await readValidatedBody(event, Body.parse)
      const res = await createGroupUseCase.execute(body)
      if (!res.ok) throw createHttpError(HttpErrorCode.InternalServerError, res.error)
      return res.value
    }
  }
})
