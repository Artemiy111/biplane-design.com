import { z } from 'zod'

const createSchema = z.object({
  title: z.string(),
  uri: z.string(),
})

const updateSchema = z.object({
  id: z.number(),
  title: z.string(),
  uri: z.string(),
  order: z.number().min(1),
})

export const groupSchemas = {
  createSchema,
  updateSchema,
}
