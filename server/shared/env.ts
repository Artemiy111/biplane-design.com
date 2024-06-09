import { z } from 'zod'

const EnvSchema = z.object({
  DATABASE_URL: z.string().min(3),
  AWS_ACCESS_KEY_ID: z.string().min(3),
  AWS_SECRET_ACCESS_KEY: z.string().min(3),
  ENDPOINT_URL: z.string().min(3),
  REGION: z.string().min(3),
  BUCKET_NAME: z.string().min(3),
})

export const env = EnvSchema.parse(process.env)
