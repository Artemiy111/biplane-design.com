import { z } from 'zod'

import { projectRepo } from '~~/server/di'

export default defineEventHandler(async (event) => {
  const querySchema = z.object({
    uri: z.string().optional(),
  })
  const query = await getValidatedQuery(event, querySchema.parse)
  if (query.uri) return await projectRepo.getOneByUri(query.uri)

  return await projectRepo.getAll()
})
