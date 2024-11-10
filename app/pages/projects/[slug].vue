<script setup lang="ts">
import { ProjectPage } from '~~/src/pages/project'

const slug = computed(() => useRoute('projects-slug').params.slug)
</script>

<template>
  <ProjectPage :slug="slug" />
</template>
