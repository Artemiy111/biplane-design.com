<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { toast } from 'vue-sonner'
import { type ProjectCreateSchema, projectCreateSchema } from '~/server/validators'
import { Sheet } from '~/components/ui/sheet'
import type { Form } from '~/components/ui/form'
import CreateProjectSheet from '~/components/admin/CreateProjectSheet.vue'
import type { GroupRec } from '~/server/db/schema'

const { data: groups, error: groupsError } = await useFetch('/api/groups')
const { data: projects, error: projectsError, refresh: refreshProjects } = await useFetch('/api/projects')

watch(groupsError, () => {
  if (!projectsError.value)
    return
  toast.error(projectsError.value.message)
})

watch(projectsError, () => {
  if (!projectsError.value)
    return
  toast.error(projectsError.value.message)
})

const createProjectSheetRef = ref<InstanceType<typeof CreateProjectSheet> | null>(null)
async function onSubmit(values: ProjectCreateSchema) {
  try {
    await $fetch('/api/projects', {
      method: 'POST',
      body: values,
    })
    createProjectSheetRef.value?.close()
    toast.success('Проект создан')
  }
  catch (e) {
    if (e instanceof Error)
      toast.error(e.message)
    else toast.error(String(e))
  }
  refreshProjects()
}

async function uploadFile(event: Event, project: { id: number, urlFriendly: string }) {
  const formData = new FormData()
  const target = event.target as HTMLInputElement
  const images = [...target.files || []]

  const jsonProject = JSON.stringify(project)
  formData.append('project', jsonProject)
  images.forEach(image => formData.append('files', image))

  try {
    const _res = await $fetch(`/api/projects/${project.urlFriendly}/images`, {
      method: 'POST',
      body: formData,
    })
    toast.success(`Фотографий загружено: ${images.length}`)
    refreshProjects()
  }
  catch (e) {
    if (e instanceof Error)
      toast.error(e.message)
    else toast.error(String(e))
  }
}
</script>

<template>
  <main class="container flex flex-col">
    <section class="p-8">
      <CreateProjectSheet
        v-if="groups" ref="createProjectSheetRef"
        :groups="(groups as unknown as GroupRec[])"
        @submit="onSubmit"
      />
    </section>

    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Превью</TableHead>
          <TableHead>Проект</TableHead>
          <TableHead>URL Friendly</TableHead>
          <TableHead>Группа</TableHead>
          <TableHead>Категория</TableHead>
          <TableHead>Загрузить фото</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="p in projects" :key="p.id">
          <TableCell class="min-w-max">
            <NuxtImg
              v-if="p.images.length" format="avif,webp,png,jpg"
              :src="`/images/projects/${p.urlFriendly}/${p.images[0].filename}`"
              :alt="p.images[0].title || 'image'"
              class="aspect-video max-h-[100px] min-w-max w-max object-cover"
            />
          </TableCell>
          <TableCell>
            <NuxtLink :to="`/admin/projects/${p.urlFriendly}`">
              {{ p.title }}
            </NuxtLink>
          </TableCell>
          <TableCell>{{ p.urlFriendly }}</TableCell>
          <TableCell>{{ p.category.group.title }}</TableCell>
          <TableCell>{{ p.category.title }}</TableCell>
          <TableCell class="w-min">
            <Input
              class="w-min"

              type="file" multiple accept=".avif, .webp, .jpg, .jpeg, .png"
              @input="uploadFile($event, { id: p.id, urlFriendly: p.urlFriendly })"
            />
          </TableCell>
          <TableCell>
            <Button>Изменить</Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </main>
</template>
