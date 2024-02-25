import { list } from '@vercel/blob'

export default defineEventHandler(async () => {
  return await list({
    token: useRuntimeConfig().public.blobReadWriteToken,
  })
})
