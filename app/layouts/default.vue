<script setup lang="ts">
import { useGroups, useUser } from '~~/src/shared/model/queries'
import { Footer } from '~~/src/widgets/footer'
import { Header } from '~~/src/widgets/header'

// useGroups()
// useUser()
</script>

<template>
  <div class="text-base font-normal md:text-sm">
    <div class="flex h-full min-h-[100dvh] w-full flex-col">
      <Header />
      <NuxtPage />
    </div>
    <Footer />
  </div>
</template>
