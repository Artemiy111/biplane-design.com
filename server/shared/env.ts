import { z } from 'zod'

const EnvSchema = z.object({
  DATABASE_URL: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  ENDPOINT_URL: z.string(),
  REGION: z.string(),
})

export const env = EnvSchema.parse(process.env)
