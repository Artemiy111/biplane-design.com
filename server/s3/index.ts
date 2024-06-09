import { S3Client } from '@aws-sdk/client-s3'
import { env } from '../shared/env'

export const s3 = new S3Client({
  forcePathStyle: true,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
  endpoint: env.ENDPOINT_URL,
  region: env.REGION,
})
