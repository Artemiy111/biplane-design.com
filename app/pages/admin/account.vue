<script setup lang="ts">
import { AdminAccountPage } from '~~/src/pages/admin-account'

definePageMeta({
  middleware: 'authenticated',
})
</script>

<template>
  <AdminAccountPage />
</template>
