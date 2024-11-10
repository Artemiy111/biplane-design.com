import { z } from 'zod'

import { projectStatus } from '~~/server/db/schema'

const createSchema = z.object({
  categoryId: z.number(),
  title: z.string(),
  slug: z.string(),
  status: z.enum(projectStatus),
  yearStart: z.number().nullish(),
  yearEnd: z.number().nullish(),
  location: z.string().min(3).nullish(),
  isMinimal: z.boolean().optional().default(false),
  isVisible: z.boolean().optional().default(true),
})

const updateSchema = createSchema.extend({
  id: z.number(),
  order: z.number().min(1),
})

const updateOrderSchema = z.object({
  id: z.number(),
  order: z.number().min(1),
})

export const projectSchemas = {
  getOneSchema: z.object({
    id: z.number(),
  }),
  getOneBySlugSchema: z.object({
    slug: z.string(),
  }),
  createSchema,
  updateSchema,
  updateOrderSchema,
  deleteSchema: z.object({
    id: z.number(),
  }),
}
