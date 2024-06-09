import { z } from 'zod'
import { HttpErrorCode, createHttpError } from '../../exceptions'
import { authRepo, createCategoryUseCase } from '~/server/di'

export default defineEventHandler(async (event) => {
  const Body = z.object({
    groupId: z.number(),
    title: z.string(),
    uri: z.string(),
    order: z.number(),
  })
  authRepo.assertAuthenticated(event)
  const body = await readValidatedBody(event, Body.parse)
  const res = await createCategoryUseCase.execute(body)
  if (!res.ok) throw createHttpError(HttpErrorCode.InternalServerError, res.error)
  return res.value
})
