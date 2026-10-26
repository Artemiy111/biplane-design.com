import { z } from 'zod'

import { requiredStringSchema, validationErrors } from '../../src/shared/config/validation/base'

const envSchema = z.object({
  BASE_URL: z.url(validationErrors.invalidUrl),
  DATABASE_URL: z.url(validationErrors.invalidUrl),
  DATABASE_AUTH_TOKEN: requiredStringSchema.min(3),
  AWS_ACCESS_KEY_ID: requiredStringSchema.min(3),
  AWS_SECRET_ACCESS_KEY: requiredStringSchema.min(3),
  ENDPOINT_URL: z.url(validationErrors.invalidUrl),
  REGION: requiredStringSchema.min(3),
  BUCKET_NAME: requiredStringSchema.min(3),
})

export const env = envSchema.parse(process.env)
