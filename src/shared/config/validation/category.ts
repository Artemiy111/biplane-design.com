import { z } from 'zod'

const createSchema = z.object({
  groupId: z.number(),
  title: z.string(),
  uri: z.string(),
  order: z.number(),
  layout: z.enum(['base', 'mini']),
})

const updateSchema = z.object({
  groupId: z.number(),
  id: z.number(),
  title: z.string(),
  uri: z.string(),
  order: z.number().min(1),
  layout: z.enum(['base', 'mini']),
})

export const categorySchemas = {
  getOneSchema: z.object({
    id: z.number(),
  }),
  createSchema,
  updateSchema,
  deleteSchema: z.object({
    id: z.number(),
  }),
}
