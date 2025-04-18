<script setup lang="ts">
import { useGroupsQuery, useUserQuery } from '~~/src/shared/model/queries'
import { Footer } from '~~/src/widgets/footer'
import { Header } from '~~/src/widgets/header'

// useGroups()
// useUser()
</script>

<template>
  <div class="grid min-h-dvh grid-rows-[auto_1fr_auto] text-base font-normal text-foreground">
    <!-- <div class="flex size-full min-h-dvh flex-col"> -->
    <Header />
    <NuxtPage />
    <!-- </div> -->
    <Footer />
  </div>
</template>
