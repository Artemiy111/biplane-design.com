<script setup lang="ts">
import { toast } from 'vue-sonner'
import { ArrowDown, ArrowUp } from 'lucide-vue-next'
import type { ImageDto, ProjectDto, UpdateImageDto } from '~/server/use-cases/types'
import Dropzone from '~/components/Dropzone.vue'
import type { ImageId } from '~/server/db/schema'

const route = useRoute()
const uri = route.params.uri as string
const { data: project, error: error, refresh: refreshImages }
= await useLazyFetch<ProjectDto>(`/api/projects/?uri=${uri}`)

definePageMeta({
  middleware: 'authenticated',
})

useSeoMeta({
  title: () => `Админ-панель | ${project.value?.title}`,
  ogTitle: () => `Админ-панель | ${project.value?.title}`,
  description: () => `Админ-панель | ${project.value?.title}`,
  ogDescription: () => `Админ-панель | ${project.value?.title}`,
})

watch(error, async () => {
  if (project.value === null) await navigateTo('/admin')
})

async function deleteImages(ids: ImageId[]) {
  if (!project.value) return

  await Promise.all(ids.map(async (id) => {
    try {
      await $fetch(`/api/images/${id}`, {
        method: 'DELETE',
      })
      toast.success(`Изображение удалено`)
    }
    catch (_e) {
      const e = _e as Error
      toast.error(e.message)
    }
  }))
  refreshImages()
}

async function updateImage(id: ImageId, dto: UpdateImageDto) {
  try {
    await $fetch(`/api/images/${id}`, {
      method: 'PUT',
      body: dto,
    })
    toast.success(`Изображение обновлено`)
  }
  catch (_e) {
    const e = _e as Error
    toast.error(e.message)
  }
  refreshImages()
}

async function uploadImages(images: File[]) {
  if (!project.value) return
  images.forEach(async (image) => {
    const formData = new FormData()
    formData.append('file', image, image.name)
    formData.append('projectId', project.value!.id.toString())

    try {
      await $fetch<ImageDto[]>(`/api/images`, {
        method: 'POST',
        body: formData,
      })
      toast.success(`Изображение загружено`)
      refreshImages()
    }
    catch (e) {
      toast.error(`Не удалось загрузить изображение`)
    }
  })
}
</script>

<template>
  <main
    v-if="project"
    class="container flex flex-col"
  >
    <section class="flex p-8">
      {{ project.title }}
      {{ project.uri }}
    </section>
    <section class="flex flex-col  gap-4 p-8">
      <span>Изображений: {{ project.images.length }}</span>
      <Dropzone
        class="h-[25dvh] w-full"
        :clear-on-upload="true"
        :show-images="true"
        :show-icon="true"
        :multiple="true"
        @upload="uploadImages"
      />
      <Table class="overflow-hidden">
        <TableHeader>
          <TableRow>
            <TableHead>№</TableHead>
            <TableHead>Изображение</TableHead>
            <TableHead>Название файла</TableHead>
            <TableHead>Опции</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody class="transition-all [&>.row-leave-active]:absolute">
          <TransitionGroup name="row">
            <TableRow
              v-for="(image, idx) in project.images"
              :key="image.id"
            >
              <TableCell>{{ image.order }}</TableCell>
              <TableCell>
                <img
                  format="avif,webp,png,jpg"
                  class="aspect-video w-[300px] object-contain"
                  :src="image.url"
                  :alt="image.alt"
                >
              </TableCell>
              <TableCell>
                {{ image.id }}
              </TableCell>
              <TableCell>
                <div class="flex w-full flex-col items-center gap-2">
                  <Button
                    v-if="idx !== 0"
                    variant="ghost"
                    @click="updateImage(image.id, { ...image, order: image.order - 1 })"
                  >
                    <ArrowUp />
                  </Button>
                  <Button
                    variant="outline"
                    @click="deleteImages([image.id])"
                  >
                    Удалить
                  </Button>
                  <Button
                    v-if="idx !== project.images.length - 1"
                    variant="ghost"
                    @click="updateImage(image.id, { ...image, order: image.order + 1 })"
                  >
                    <ArrowDown />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TransitionGroup>
        </TableBody>
      </Table>
    </section>
  </main>
</template>

<style scoped>
.row-move, /* apply transition to moving elements */
.row-enter-active,
.row-leave-active {
  transition: all 0.5s ease;
}

.row-enter-from,
.row-leave-to {
  opacity: 0;
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.row-leave-active {
  position: absolute;
}
</style>
