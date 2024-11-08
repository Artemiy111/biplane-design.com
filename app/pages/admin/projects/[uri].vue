<script setup lang="ts">
import { AdminProjectPage } from '~~/src/pages/admin-project'

definePageMeta({
  middleware: 'authenticated',
})

const uri = computed(() => useRoute().params.uri! as string)
</script>

<template>
  <AdminProjectPage :uri="uri" />
</template>
