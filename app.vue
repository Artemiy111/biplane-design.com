<script setup lang="ts">
import TheHeader from '~/components/TheHeader.vue'
import TheFooter from '~/components/TheFooter.vue'
import { Toaster } from '~/components/ui/sonner'
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
