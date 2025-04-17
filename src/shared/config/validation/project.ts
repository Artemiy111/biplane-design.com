import { z } from 'zod'

import { projectStatuses } from '~~/server/shared/constants'

import { getMinMaxStringSchema, requiredNumberSchema, validationErrors } from './base'

const MIN_YEAR = 2000
const MAX_YEAR = 2050

const createSchema = z.object({
  categoryId: requiredNumberSchema,
  title: getMinMaxStringSchema(5, 64),
  slug: getMinMaxStringSchema(5, 64).refine(s => s === encodeURIComponent(s), 'Невалидный slug'),
  status: z.enum(projectStatuses),
  yearStart: z.number()
    .min(MIN_YEAR, validationErrors.minYear(MIN_YEAR))
    .max(MAX_YEAR, validationErrors.maxYear(MAX_YEAR))
    .nullable().default(null),
  yearEnd: z.number()
    .min(MIN_YEAR, validationErrors.minYear(MIN_YEAR))
    .max(MAX_YEAR, validationErrors.maxYear(MAX_YEAR))
    .nullable().default(null),
  location: getMinMaxStringSchema(3, 64).nullable(),
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
