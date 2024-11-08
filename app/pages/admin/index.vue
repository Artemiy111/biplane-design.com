<script setup lang="ts">
import { AdminPage } from '~~/src/pages/admin'

definePageMeta({
  middleware: 'authenticated',
})
</script>

<template>
  <AdminPage />
</template>
