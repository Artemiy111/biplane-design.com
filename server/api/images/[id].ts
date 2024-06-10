import { z } from 'zod'
import { authRepo, imageRepo } from '~/server/di'

export default defineEventHandler(async (event) => {
  const id = event.context.params!.id

  switch (event.method) {
    case 'GET': {
      return await imageRepo.getOne(id)
    }
    case 'PUT': {
      const Body = z.object({
        alt: z.string(),
        order: z.number().min(1),
      })
      authRepo.assertAuthenticated(event)
      const body = await readValidatedBody(event, Body.parse)
      return await imageRepo.update(id, body)
    }
    case 'DELETE': {
      authRepo.assertAuthenticated(event)
      return await imageRepo.delete(id)
    }
  }
})
