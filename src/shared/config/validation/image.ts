import { z } from 'zod'

import { imageFit } from '~~/server/db/schema'

const updateSchema = z.object({
  alt: z.string(),
  order: z.number().min(1),
  fit: z.enum(imageFit),
})

export const imageSchemas = {
  updateSchema,
}
