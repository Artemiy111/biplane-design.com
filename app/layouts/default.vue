<script setup lang="ts">
import { Footer } from '~~/src/widgets/footer'
import { Header } from '~~/src/widgets/header'
</script>

<template>
  <div class="grid min-h-dvh grid-rows-[auto_1fr_auto] text-base font-normal text-foreground">
    <Header />
    <NuxtPage />
    <Footer />
  </div>
</template>
