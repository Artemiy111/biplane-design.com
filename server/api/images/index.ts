import { z } from 'zod'
import { authRepo, imageRepo } from '~/server/di'
import { createHttpError, HttpErrorCode } from '~/server/exceptions'
import { toUri } from '~/utils/toUri'

export default defineEventHandler(async (event) => {
  switch (event.method) {
    case 'POST': {
      authRepo.assertAuthenticated(event)
      const FormData = z.object({
        projectId: z.instanceof(Buffer).transform(value => Number(value.toString('utf-8'))).refine(value => !Number.isNaN(value)),
        filename: z.instanceof(Buffer).transform(value => toUri(value.toString('utf-8'))),
        alt: z.instanceof(Buffer).transform(value => toUri(value.toString('utf-8'))),
        type: z.instanceof(Buffer).transform(value => value.toString('utf-8')),
        data: z.instanceof(Buffer),
      })

      const formData = await readMultipartFormData(event)
      if (!formData)
        throw createHttpError(HttpErrorCode.BadRequest)

      const data: Record<string, unknown> = {}
      formData.forEach(value => data[value.name!] = value.data)
      const body = FormData.safeParse(data)
      if (!body.success)
        throw createHttpError(HttpErrorCode.BadRequest, body.error)

      return await imageRepo.create(body.data)
    }
  }
})
