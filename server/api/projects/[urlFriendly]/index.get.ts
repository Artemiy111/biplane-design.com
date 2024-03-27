import { getProjectByUriUseCase } from '~/server/di'
import { HttpErrorCode, createHttpError } from '~/server/exceptions'

export default defineEventHandler(async (event) => {
  const uri = event.context.params!.urlFriendly as string
  const res = await getProjectByUriUseCase.execute(uri)
  if (!res.ok)
    throw createHttpError(HttpErrorCode.InternalServerError)
  return res.value
})
