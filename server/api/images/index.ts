import { z } from 'zod'
import { createImageUseCase } from '~/server/di'
import { HttpErrorCode, createHttpError } from '~/server/exceptions'

export default defineEventHandler(async (event) => {
  switch (event.method) {
    case 'POST': {
      const FormData = z.object({
        projectId: z.number(),
        filename: z.string(),
        alt: z.string(),
        data: z.instanceof(Buffer),
      })
      const formData = await readMultipartFormData(event)
      if (!formData)
        throw createHttpError(HttpErrorCode.BadRequest)
      const body = FormData.safeParse(formData)
      if (!body.success)
        throw createHttpError(HttpErrorCode.BadRequest)
      const res = await createImageUseCase.execute(body.data)
      if (!res.ok) throw createHttpError(HttpErrorCode.InternalServerError, res.error)
      return res.value
    }
  }
})
