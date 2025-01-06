import { z } from 'zod'

import { imageFits } from '~~/server/shared/constants'

const createSchema = z.object({
  projectId: z.coerce.number(),
  fit: z.enum(imageFits).default('object-cover'),
  file: z.instanceof(File),
})

const updateSchema = z.object({
  id: z.string(),
  alt: z.string(),
  order: z.number().min(1),
  fit: z.enum(imageFits),
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
