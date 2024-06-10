import { z } from 'zod'
import { authRepo, groupRepo } from '~/server/di'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params!.id! as string)

  switch (event.method) {
    case 'GET': {
      return await groupRepo.getOne(id)
    }

    case 'PUT': {
      const Body = z.object({
        id: z.number(),
        title: z.string(),
        uri: z.string(),
        order: z.number().min(1),
      })
      authRepo.assertAuthenticated(event)
      const body = await readValidatedBody(event, Body.parse)
      return groupRepo.update(id, body)
    }
    case 'DELETE': {
      return await groupRepo.delete(id)
    }
  }
})
