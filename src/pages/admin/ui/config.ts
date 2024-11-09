import { z } from 'zod'

import { projectStatus } from '~~/server/db/schema'

const MIN_YEAR = 2000
const MAX_YEAR = 2050

export const schema = z.object({
  categoryId: z.coerce.number(),
  id: z.number(),
  title: z.string().trim().min(3, 'Минимум 3 символа'),
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
      catch (_e) {
        return false
      }
    }, 'Не валидный Uri'),
  status: z.enum(projectStatus),
  yearStart: z
    .number()
    .min(MIN_YEAR, `Год начала не может быть меньше ${MIN_YEAR}`)
    .max(MAX_YEAR, `Год начала не может быть больше ${MAX_YEAR}`)
    .nullish(),
  yearEnd: z
    .number()
    .min(MIN_YEAR, `Год завершения не может быть меньше ${MIN_YEAR}`)
    .max(MAX_YEAR, `Год завершения не может быть больше ${MAX_YEAR}`)
    .nullish(),
  location: z.string().trim().min(3, 'Минимум 3 символа').nullish(),
  groupId: z.coerce.number(),
  order: z.number(),
  isMinimal: z.boolean(),
  isVisible: z.boolean(),
})
