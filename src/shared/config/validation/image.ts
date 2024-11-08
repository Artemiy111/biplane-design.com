import { z } from 'zod'

import { imageFit } from '~~/server/db/schema'

const createSchema = z.object({
  projectId: z.coerce.number(),
  fit: z.enum(['object-fill', 'object-contain', 'object-cover', 'object-none']).default('object-cover'),
  file: z.instanceof(File),
})

const updateSchema = z.object({
  id: z.string(),
  alt: z.string(),
  order: z.number().min(1),
  fit: z.enum(imageFit),
})

export const imageSchemas = {
  getOneSchema: z.object({
    id: z.string(),
  }),
  createSchema,
  updateSchema,
  deleteSchema: z.object({
    id: z.string(),
  }),
}
