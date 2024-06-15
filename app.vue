<script setup lang="ts">
import type { GroupDto } from './server/use-cases/types'
import TheHeader from '~/components/TheHeader.vue'
import TheFooter from '~/components/TheFooter.vue'
import { Toaster } from '~/components/ui/sonner'

await useLazyFetch<GroupDto[]>('/api/groups', {
  key: 'groups',
})
</script>

<template>
  <Toaster :rich-colors="true" />
  <div class="text-base font-normal md:text-sm">
    <div class="flex h-full min-h-[100dvh] w-full flex-col">
      <TheHeader />
      <NuxtPage />
    </div>
    <TheFooter />
  </div>
</template>
