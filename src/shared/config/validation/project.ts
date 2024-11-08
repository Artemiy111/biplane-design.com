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
  isMinimal: z.boolean().optional().default(false),
  visible: z.boolean().optional().default(true),
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
  getOneByUriSchema: z.object({
    uri: z.string(),
  }),
  createSchema,
  updateSchema,
  updateOrderSchema,
}
