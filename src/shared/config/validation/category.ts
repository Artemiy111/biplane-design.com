import { z } from 'zod'

import { categoryLayouts } from '~~/server/shared/constants'

import { getMinMaxStringSchema } from './base'

const updateSchema = z.object({
  id: z.number(),
  groupId: z.number(),
  title: getMinMaxStringSchema(3, 255),
  slug: getMinMaxStringSchema(3, 255),
  order: z.number().min(1),
  layout: z.enum(categoryLayouts),
})

const createSchema = updateSchema.omit({ id: true })

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
