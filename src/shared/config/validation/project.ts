import { z } from 'zod'

import { projectStatus } from '~~/server/db/schema'

const createSchema = z.object({
  categoryId: z.number(),
  title: z.string(),
  uri: z.string(),
  status: z.enum(projectStatus),
  yearStart: z.number().nullable(),
  yearEnd: z.number().nullable(),
  location: z.string().min(3).nullable(),
  isMinimal: z.boolean().optional(),
})

export const projectSchemas = {
  createSchema,
}
