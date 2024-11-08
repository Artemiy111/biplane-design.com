<script setup lang="ts">
import { ProjectPage } from '~~/src/pages/project'

const uri = computed(() => useRoute().params.uri! as string)
</script>

<template>
  <ProjectPage :uri="uri" />
</template>
