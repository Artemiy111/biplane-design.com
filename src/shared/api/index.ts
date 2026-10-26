import { createTRPCNuxtClient, httpBatchLink } from 'trpc-nuxt/client'

import type { AppRouter } from '~~/server/api/trpc/[trpc]'

export const useApi = () => createTRPCNuxtClient<AppRouter>({
  links: [
    httpBatchLink({
      // On the server there is no relative origin to rely on, so the client
      // calls the app back over HTTP at its own internal address.
      url: import.meta.server ? `${useRuntimeConfig().BASE_URL}/api/trpc` : '/api/trpc',
    }),
  ],
})
