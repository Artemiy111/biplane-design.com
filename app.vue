<script setup lang="ts">
import TheHeader from '~/components/TheHeader.vue'
import TheFooter from '~/components/TheFooter.vue'
import { Toaster } from '~/components/ui/sonner'
</script>

<template>
  <Toaster :rich-colors="true" />
  <div class="font-normal text-base md:text-sm">
    <div class="min-h-[100dvh] flex flex-col w-full h-full ">
      <TheHeader />
      <NuxtPage />
    </div>
    <TheFooter />
  </div>
</template>
