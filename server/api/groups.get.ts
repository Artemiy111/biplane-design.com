import { HttpErrorCode, createHttpError } from '../exceptions'
import { GroupDbRepo, groupDbMapper } from '../infra/groupDb.repo'

import { getGroupsUseCase } from '~/server/di'

export default defineEventHandler(async () => {
  const groups = await getGroupsUseCase.execute()
  if (groups.ok)
    return groups.value
  else throw createHttpError(HttpErrorCode.InternalServerError)
})
