import { z } from 'zod'
import { authRepo, groupRepo } from '~~/server/di'

export default defineEventHandler(async (event) => {
  switch (event.method) {
    case 'GET': {
      return await groupRepo.getAll()
    }
    case 'POST': {
      const Body = z.object({
        title: z.string(),
        uri: z.string(),
      })
      authRepo.assertAuthenticated(event)
      const body = await readValidatedBody(event, Body.parse)
      return await groupRepo.create(body)
    }
  }
})
