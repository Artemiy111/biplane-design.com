<script setup lang="ts">
import type { ProjectRec, ThemeRec } from '~/server/db/schema'

const { data: themes, error: _error } = useFetch<ThemeRec[]>('/api/themes')

function uploadFile(event: Event, project: ProjectRec) {
  const formData = new FormData()
  const target = event.target as HTMLInputElement
  const images = [...target.files || []]

  const jsonProject = JSON.stringify({ id: project.id, urlFriendly: project.urlFriendly })
  formData.append('project', jsonProject)
  images.forEach(image => formData.append('files', image))

  $fetch('/api/images', {
    method: 'POST',
    body: formData,
  })
}
</script>

<template>
  <main class="container flex flex-col">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Группа</TableHead>
          <TableHead>Категория</TableHead>
          <TableHead>Проект</TableHead>
          <TableHead>Загрузить</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody v-if="themes">
        <template v-for="t in themes" :key="t.id">
          <template v-for="c in t.categories" :key="c.id">
            <TableRow v-for="p in c.projects" :key="p.id">
              <TableCell>{{ t.title }}</TableCell>
              <TableCell>{{ c.title }}</TableCell>
              <TableCell>{{ p.title }}</TableCell>
              <TableCell>
                <Input type="file" multiple accept=".avif, .webp, .jpg, .jpeg, .png" @input="uploadFile($event, p)" />
              </TableCell>
            </TableRow>
          </template>
        </template>
      </TableBody>
    </Table>
  </main>
</template>
