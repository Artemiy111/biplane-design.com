import * as z from 'zod'

const maxYear = new Date().getUTCFullYear() + 10

export const projectCreateSchema = z.object({
  title: z.string().trim().min(3, 'Минимум 3 символа'),
  groupId: z.union([z.string(), z.number()]).transform(v => Number(v)),
  categoryId: z.union([z.string(), z.number()]).transform(v => Number(v)),
  urlFriendly: z.string().trim()
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
  yearStart: z.number()
    .min(2000, 'Год начала не может быть меньше 2000')
    .max(maxYear, `Год начала не может быть больше ${maxYear}`)
    .nullable(),
  yearEnd: z.number()
    .min(2000, 'Год завершения не может быть меньше 2000')
    .max(maxYear, `Год завершения не может быть больше ${maxYear}`)

    .nullable(),
  location: z.string().trim().min(3, 'Минимум 3 символа'),
})
  .refine((data) => {
    if (data.yearStart !== null && data.yearEnd !== null)
      return data.yearStart <= data.yearEnd
    return true
  }, {
    path: ['yearStart'],
    message: 'Год начала должен быть меньше или равен году завершения',
  })
export type ProjectCreateSchema = z.infer<typeof projectCreateSchema>
