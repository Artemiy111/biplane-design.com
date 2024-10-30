import { z } from 'zod'
import { authRepo, categoryRepo } from '~~/server/di'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params!.id! as string)

  switch (event.method) {
    case 'GET': {
      return await categoryRepo.getOne(id)
    }

    case 'PUT': {
      const Body = z.object({
        groupId: z.number(),
        id: z.number(),
        title: z.string(),
        uri: z.string(),
        order: z.number().min(1),
      })
      authRepo.assertAuthenticated(event)
      const body = await readValidatedBody(event, Body.parse)
      return await categoryRepo.update(id, body)
    }
    case 'DELETE': {
      authRepo.assertAuthenticated(event)
      return await categoryRepo.delete(id)
    }
  }
})
