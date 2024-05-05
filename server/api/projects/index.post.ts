import { HttpErrorCode, createHttpError } from '~/server/exceptions'
import { createProjectUseCase } from '~/server/di'
import * as z from 'zod'

defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, projectCreateSchema.safeParse)
  if (!body.success)
    return createHttpError(HttpErrorCode.BadRequest)
  const project = body.data
  const res = await createProjectUseCase.execute(project)
  if (!res.ok)
    throw createHttpError(HttpErrorCode.InternalServerError)
  return res.value
})


const MIN_YEAR = 2000
const MAX_YEAR = 2050

export const projectCreateSchema = z.object({
  title: z.string().trim().min(3, 'Минимум 3 символа'),
  categoryId: z.union([z.string(), z.number()]).transform(v => Number(v)),
  uri: z
    .string()
    .trim()
    .min(3, 'Минимум 3 символа')
    .refine((s) => {
      const url = `https://g.com/${s}`
      try {
        z.string().url().parse(url)
        return true
      }
      catch (e) {
        return false
      }
    }, 'Не валидный URL'),
  status: z.string().trim().min(3, 'Минимум 3 символа'),
  yearStart: z
    .number()
    .min(MIN_YEAR, `Год начала не может быть меньше ${MIN_YEAR}`)
    .max(MAX_YEAR, `Год начала не может быть больше ${MAX_YEAR}`)
    .nullable(),
  yearEnd: z
    .number()
    .min(MIN_YEAR, `Год завершения не может быть меньше ${MIN_YEAR}`)
    .max(MAX_YEAR, `Год завершения не может быть больше ${MAX_YEAR}`)

    .nullable(),
  location: z.string().trim().min(3, 'Минимум 3 символа'),
})