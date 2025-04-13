import { createTRPCNuxtClient, httpBatchLink } from 'trpc-nuxt/client'

import type { AppRouter } from '~~/server/api/trpc/[trpc]'

const trpc = ref<any | null>(null)

export const useApi = () => {
  if (!trpc.value) {
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

  return trpc.value as ReturnType<typeof createTRPCNuxtClient<AppRouter>>
}
