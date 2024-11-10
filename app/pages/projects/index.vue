<script setup lang="ts">
import { ProjectsPage } from '~~/src/pages/projects'
import { useGroups } from '~~/src/shared/model/queries'

useGroups()
</script>

<template>
  <ProjectsPage />
</template>
