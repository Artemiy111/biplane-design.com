import { httpBatchLink } from '@trpc/client'
import { createTRPCNuxtClient } from 'trpc-nuxt/client'

import type { AppRouter } from '~~/server/api/trpc/[trpc]'

export const useApi = () => {
  const client = createTRPCNuxtClient<AppRouter>({
    links: [
      httpBatchLink({
        url: `${import.meta.server ? useRuntimeConfig().BASE_URL : ''}/api/trpc`,
        headers: useRequestHeaders(),
      }),
    ],
  })
  return client
}
