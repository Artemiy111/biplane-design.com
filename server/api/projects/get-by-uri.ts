import { z } from 'zod'
import { projectRepo } from '~~/server/di'

const getSchema = z.object({
  uri: z.string(),
})

export default defineEventHandler(async (event) => {
  const { uri } = await readValidatedBody(event, getSchema.parse)

  return projectRepo.getOneByUri(uri)
})