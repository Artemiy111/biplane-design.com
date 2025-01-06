import { z } from 'zod'

import { requiredStringSchema } from '../../src/shared/config/validation/base'

const envSchema = z.object({
  BASE_URL: requiredStringSchema.min(3).url(),
  DATABASE_URL: requiredStringSchema.min(3).url(),
  DATABASE_AUTH_TOKEN: requiredStringSchema.min(3),
  AWS_ACCESS_KEY_ID: requiredStringSchema.min(3),
  AWS_SECRET_ACCESS_KEY: requiredStringSchema.min(3),
  ENDPOINT_URL: requiredStringSchema.min(3),
  REGION: requiredStringSchema.min(3),
  BUCKET_NAME: requiredStringSchema.min(3),
})

export const env = envSchema.parse(process.env)
