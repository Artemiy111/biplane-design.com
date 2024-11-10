<script setup lang="ts">
import { AdminProjectPage } from '~~/src/pages/admin-project'

definePageMeta({
  middleware: 'authenticated',
})

const slug = computed(() => useRoute('admin-projects-slug').params.slug)
</script>

<template>
  <AdminProjectPage :slug="slug" />
</template>
