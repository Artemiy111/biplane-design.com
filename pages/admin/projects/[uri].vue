<script setup lang="ts">
import { toast } from 'vue-sonner'
import { GripVertical, Trash2 } from 'lucide-vue-next'
import { vDraggable, type SortableEvent } from 'vue-draggable-plus'
import type { ImageDto, ProjectDto, UpdateImageDto } from '~/server/use-cases/types'
import Dropzone from '~/components/Dropzone.vue'
import type { ImageId } from '~/server/db/schema'

const route = useRoute()
const uri = route.params.uri as string
const { data: project, refresh }
= await useLazyFetch<ProjectDto>(`/api/projects/?uri=${uri}`, {
  onResponseError: () => toast.error('Не удалось загрузить информацию о проекте'),
})

definePageMeta({
  middleware: 'authenticated',
})

useSeoMeta({
  title: () => `Админ-панель | ${project.value?.title}`,
  ogTitle: () => `Админ-панель | ${project.value?.title}`,
  description: () => `Админ-панель | ${project.value?.title}`,
  ogDescription: () => `Админ-панель | ${project.value?.title}`,
})

async function deleteImage(id: ImageId) {
  if (!project.value) return
  project.value.images = project.value.images.filter(img => img.id !== id)
  try {
    await $fetch(`/api/images/${id}`, {
      method: 'DELETE',
    })
  }
  catch (_e) {
    toast.error(`Не удалось удалить изображение`)
  }
  refresh()
}

async function updateImage(id: ImageId, dto: UpdateImageDto) {
  try {
    await $fetch(`/api/images/${id}`, {
      method: 'PUT',
      body: dto,
    })
  }
  catch (_e) {
    toast.error('Не удалось обновить изображение')
  }
  refresh()
}

async function updateImageOrder(e: SortableEvent) {
  if (!project.value) return
  const index = e.oldDraggableIndex!
  const newIndex = e.newDraggableIndex!
  const [image] = project.value.images.splice(index, 1)
  project.value.images.splice(newIndex, 0, image)
  image.order = newIndex + 1
  try {
    await $fetch(`/api/images/${image.id}`, {
      method: 'PUT', body: image,
    })
  }
  catch (_e) {
    toast.error('Не удалось переместить изображение')
  }
  refresh()
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
      toast.info(`Изображение загружено`)
    }
    catch (e) {
      toast.error(`Не удалось загрузить изображение`)
    }
    refresh()
  })
}
</script>

<template>
  <main
    v-if="project"
    class="container flex flex-col"
  >
    <h1 class="font-bold px-8 sm:px-4 mt-4 md:mt-4 text-3xl 2xl:text-2xl lg:text-xl md:text-lg sm:text-base">
      {{ project.title }}
    </h1>
    <div class="grid  grid-cols-[1fr_1fr] md:grid-cols-1 px-8 py-8 md:py-4 sm:px-4 gap-x-16 gap-y-8">
      <section class="grid md:overflow-x-auto w-full grid-cols-[repeat(2,max-content)] gap-x-16 md:gap-x-8 gap-y-2">
        <span>Id</span>
        <span>{{ project.id }}</span>
        <span>Uri</span>
        <span>{{ project.uri }}</span>
        <span>Расположение</span>
        <span>{{ project.location }}</span>
        <span>Год начала</span>
        <span>{{ project.yearStart }}</span>
        <span>Год завершения</span>
        <span>{{ project.yearEnd }}</span>
        <span>Мини</span>
        <span>{{ project.isMinimal ? "да" : 'нет' }}</span>
        <span>№ в категории</span>
        <span>{{ project.order }}</span>
        <span>Изображений</span>
        <span>{{ project.images.length }}</span>
      </section>
      <Dropzone
        class="h-full min-h-[25vh] "
        :clear-on-upload="true"
        :show-icon="true"
        :multiple="true"
        @upload="uploadImages"
      />
    </div>

    <section class="flex flex-col sm:px-4 gap-4 px-8 md:py-4">
      <Table class="overflow-x-auto grid grid-cols-[120px_max-content_1fr_max-content] md:grid-cols-[max-content_260px_200px_max-content]">
        <TableHeader class="grid grid-cols-subgrid col-span-4">
          <TableRow class="grid grid-cols-subgrid col-span-4">
            <TableHead>№</TableHead>
            <TableHead>Изображение</TableHead>
            <TableHead>Описание</TableHead>
            <TableHead>Опции</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody
          v-draggable="[
            project.images as any, {
              onUpdate: updateImageOrder,
              handle: `[data-draggable-handler='true']`,
            }]"
          class="transition-all grid grid-cols-subgrid col-span-4 [&>.row-leave-active]:absolute "
        >
          <TransitionGroup
            name="row"
          >
            <TableRow
              v-for="(image) in project.images"
              :key="image.id"
              class="grid grid-cols-subgrid col-span-4 items-center"
            >
              <TableCell
                class="cursor-grab flex gap-4"
                :data-draggable-handler="true"
              >
                {{ image.order }} <GripVertical />
              </TableCell>
              <TableCell>
                <img
                  format="avif,webp,png,jpg"
                  class="aspect-video w-[300px] object-contain"
                  :src="image.url"
                  :alt="image.alt"
                >
              </TableCell>
              <TableCell>
                <Input
                  :model-value="image.alt"
                  @change="(e: Event) => updateImage(image.id, { ...image, alt: (e.target as HTMLInputElement).value }) "
                />
              </TableCell>
              <TableCell class="text-center">
                <button
                  @click="deleteImage(image.id)"
                >
                  <Trash2 class="text-red-500" />
                </button>
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
