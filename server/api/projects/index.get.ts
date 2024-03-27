import { getProjectsUseCase } from '~/server/di'
import { HttpErrorCode, createHttpError } from '~/server/exceptions'

export default defineEventHandler(async () => {
  const res = await getProjectsUseCase.execute()
  if (!res.ok)
    throw createHttpError(HttpErrorCode.InternalServerError)
  return res.value
})
