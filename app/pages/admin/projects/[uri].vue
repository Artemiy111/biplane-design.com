<script setup lang="ts">
import { AdminProjectPage } from '~~/src/pages/admin-project'

definePageMeta({
  middleware: 'authenticated',
})
</script>

<template>
  <AdminProjectPage />
</template>
