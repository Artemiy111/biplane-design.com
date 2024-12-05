<script setup lang="ts">
import { useGroups, useUser } from '~~/src/shared/model/queries'
import { Footer } from '~~/src/widgets/footer'
import { Header } from '~~/src/widgets/header'

// useGroups()
// useUser()
</script>

<template>
  <div class="grid min-h-dvh grid-rows-[auto,1fr,auto] text-base font-normal text-foreground">
    <!-- <div class="flex size-full min-h-dvh flex-col"> -->
    <Header />
    <NuxtPage />
    <!-- </div> -->
    <Footer />
  </div>
</template>
