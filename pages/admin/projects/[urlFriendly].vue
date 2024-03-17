<script setup lang="ts">
import { toast } from 'vue-sonner'
import { ArrowDown, ArrowUp } from 'lucide-vue-next'
import type { Image, ImageUpdate } from '~/server/db/schema'
import Dropzone from '~/components/Dropzone.vue'

const route = useRoute()
const projectUrlFriendly = route.params.urlFriendly as string
const { data: project, error: _error, refresh: refreshImages } = await useFetch(`/api/projects/${projectUrlFriendly}`)

definePageMeta({
  middleware: 'auth',
})

useSeoMeta({
  title: () => `Админ-панель | ${project.value?.title}`,
  ogTitle: () => `Админ-панель | ${project.value?.title}`,
  description: () => `Админ-панель | ${project.value?.title}`,
  ogDescription: () => `Админ-панель | ${project.value?.title}`,
})

async function deleteImages(filenames: string[]) {
  if (!project.value)
    return
  try {
    await $fetch(`/api/projects/${projectUrlFriendly}/images`, {
      method: 'DELETE',
      body: {
        filenames,
      },
    })
    toast.success(`Изображений удалено: ${filenames.length}`)
  }
  catch (e) {
    toast.error(`Не удалось удалить изображений: ${filenames.length}`)
  }
  refreshImages()
}

async function updateImage(image: Image, updateData: ImageUpdate) {
  try {
    await $fetch(`/api/projects/${image.projectUrlFriendly}/images/${image.filename}`, {
      method: 'PUT',
      body: updateData,
    })
  }
  catch (e) {
    toast.error('Не удалось обновить изображение')
  }
  refreshImages()
}

async function uploadImages(images: File[]) {
  const formData = new FormData()
  images.forEach((image, idx) => formData.append(`image-${idx}`, image))

  try {
    const res = await $fetch(`/api/projects/${projectUrlFriendly}/images`, {
      method: 'POST',
      body: formData,
    })
    toast.success(`Фотографий загружено: ${res.length}`)
    refreshImages()
  }
  catch (e) {
    toast.error(`Не удалось загрузить фотографий: ${images.length}`)
  }
}
</script>

<template>
  <main v-if="project" class="container flex flex-col">
    <section class="flex p-8">
      {{ project.title }}
      {{ project.urlFriendly }}
    </section>
    <section class="flex flex-col gap-4 p-8">
      <span>Изображений: {{ project.images.length }}</span>
      <Dropzone :clear-on-upload="true" :show-images="true" :show-icon="true" class="h-[20dvh] w-[600px]" :multiple="true" @upload="uploadImages" />
      <Table class="overflow-hidden">
        <TableHeader>
          <TableRow>
            <TableHead>Порядок</TableHead>
            <TableHead>Картинка</TableHead>
            <TableHead>Название файла</TableHead>
            <TableHead>Опции</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody class="transition-all [&>.row-leave-active]:absolute">
          <TransitionGroup name="row">
            <TableRow v-for="(image, idx) in project.images" :key="image.filename">
              <TableCell>{{ image.order }}</TableCell>
              <TableCell>
                <NuxtImg
                  :src="`/images/projects/${project.urlFriendly}/${image.filename}`"
                  format=".avif, .webp, .png, .jpg"
                  class="aspect-video w-[300px] object-contain"
                  :alt="image.title ? image.title : image.filename"
                />
              </TableCell>
              <TableCell>
                <Input :model-value="image.filename" @change="updateImage(image as unknown as Image, { filename: $event.target.value })" />
              </TableCell>
              <TableCell>
                <div class="flex w-full flex-col items-center gap-2">
                  <Button v-if="idx !== 0" variant="ghost" @click="updateImage(image as unknown as Image, { order: image.order - 1 })">
                    <ArrowUp />
                  </Button>
                  <Button variant="outline" @click="deleteImages([image.filename])">
                    Удалить
                  </Button>
                  <Button v-if="idx !== project.images.length - 1" variant="ghost" @click="updateImage(image as unknown as Image, { order: image.order + 1 })">
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
