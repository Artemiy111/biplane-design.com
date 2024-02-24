import { list } from '@vercel/blob'

export default defineEventHandler(async (event) => {
  const urlFriendly = event.context.params!.urlFriendly as string
  console.log(event.context.params)

  return await list({
    mode: 'folded',
    prefix: `${urlFriendly}/`,
    token: useRuntimeConfig().public.blobReadWriteToken,
  })
})
