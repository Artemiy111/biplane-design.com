<script setup lang="ts">
import { toast } from 'vue-sonner'
import Dropzone from '~/components/Dropzone.vue'
import CreateProjectSheet from '~/components/admin/CreateProjectSheet.vue'
import type { FormSchema, Mode } from '~/components/admin/CreateProjectSheet.vue'
import type { GroupRec, ProjectRec } from '~/server/db/schema'

const { size, md } = useScreenSize()
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

const projectSheetRef = ref<InstanceType<typeof CreateProjectSheet> | null>(null)
async function onSubmit(values: FormSchema, prev: FormSchema | null) {
  if (!prev) {
    try {
      await $fetch('/api/projects', {
        method: 'POST',
        body: values,
      })
      projectSheetRef.value?.close()
      toast.success('Проект создан')
    }
    catch (e) {
      if (e instanceof Error)
        toast.error(e.message)
      else toast.error(String(e))
    }
    refreshProjects()
    return
  }

  try {
    await $fetch(`/api/projects/${prev.urlFriendly}`, {
      method: 'PUT',
      body: values,
    })
    projectSheetRef.value?.close()
    toast.success('Проект изменён')
  }
  catch (e) {
    if (e instanceof Error)
      toast.error(e.message)
    else toast.error(String(e))
  }

  refreshProjects()
}

function openChangeProject(project: ProjectRec) {
  projectSheetRef.value?.open({
    id: project.id,
    urlFriendly: project.urlFriendly,
    title: project.title,
    groupId: groups.value?.find(g => g.categories.find(c => c.id === project.categoryId))!.id as unknown as number,
    location: project.location,
    status: project.status,
    yearStart: project.yearStart,
    yearEnd: project.yearEnd,
    categoryId: project.categoryId,
    order: project.order,
    preview: null,
  })
}

async function uploadFiles(files: File[], project: { id: number, urlFriendly: string }) {
  const formData = new FormData()
  const images = files

  const jsonProject = JSON.stringify(project)
  formData.append('project', jsonProject)
  images.forEach((image, idx) => formData.append(`image-${idx}`, image))

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
    <CreateProjectSheet
      v-if="groups" ref="projectSheetRef"
      :groups="(groups as unknown as GroupRec[])"
      @submit="onSubmit"
    />

    <section class="px-8 py-4 sm:px-4 sm:py-2">
      <Button :size="md ? 'sm' : 'default'" :variant="md ? 'secondary' : 'default'" @click="projectSheetRef?.open()">
        Создать проект
      </Button>
    </section>

    <Table class="">
      <TableHeader>
        <TableRow>
          <TableHead>Превью</TableHead>
          <TableHead>Проект</TableHead>
          <TableHead>URL Friendly</TableHead>
          <TableHead>Группа</TableHead>
          <TableHead>Категория</TableHead>
          <TableHead>Год начала</TableHead>
          <TableHead>Год завершения</TableHead>
          <TableHead>Статус</TableHead>
          <TableHead>Расположение</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="p in projects" :key="p.id">
          <TableCell>
            <NuxtImg
              v-if="p.images.length" format="avif,webp,png,jpg"
              :src="`/images/projects/${p.urlFriendly}/${p.images[0].filename}`"
              :alt="p.images[0].title || 'image'"
              class="aspect-video h-[120px] w-fit object-cover"
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
          <TableCell>{{ p.yearStart }}</TableCell>
          <TableCell>{{ p.yearEnd }}</TableCell>
          <TableCell>{{ p.status }}</TableCell>
          <TableCell>{{ p.location }}</TableCell>
          <TableCell>
            <Button variant="outline" @click="openChangeProject(p as unknown as ProjectRec)">
              Изменить
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </main>
</template>
