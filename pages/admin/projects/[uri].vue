<script setup lang="ts">
import { toast } from 'vue-sonner'
import { GripVertical, Trash2 } from 'lucide-vue-next'
import { vDraggable, type SortableEvent } from 'vue-draggable-plus'
import type { GroupDto, ImageDto, ProjectDto, UpdateImageDto } from '~/server/use-cases/types'
import Dropzone from '~/components/Dropzone.vue'
import type { ImageFit, ImageId } from '~/server/db/schema'
import { cn } from '~/lib/utils'

const route = useRoute()
const uri = route.params.uri as string
const { data: cachedGroups } = useNuxtData<GroupDto[]>('groups')
const { data: project, refresh: refreshProject }
= await useLazyFetch<ProjectDto | null>(`/api/projects/?uri=${uri}`, {
  default() {
    const cached = cachedGroups.value?.flatMap(g => g.categories.flatMap(c => c.projects)).find(p => p.uri === uri) || null
    return cached
  },
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

async function refresh() {
  refreshProject()
  refreshNuxtData('groups')
}

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
    refresh()
  }
}

async function updateImage(id: ImageId, dto: UpdateImageDto) {
  if (!project.value) return
  const imageIdx = project.value.images.findIndex(img => img.id === id)
  const [image] = project.value.images.splice(imageIdx, 1)
  project.value.images.splice(dto.order - 1, 0, { ...image, ...dto })
  project.value.images.forEach((img, idx) => img.order = idx + 1)
  try {
    await $fetch(`/api/images/${id}`, {
      method: 'PUT',
      body: dto,
    })
  }
  catch (_e) {
    toast.error('Не удалось обновить изображение')
    refresh()
  }
}

async function updateImageOrder(e: SortableEvent) {
  if (!project.value) return
  const imageIdx = e.oldDraggableIndex!
  const newIdx = e.newDraggableIndex!
  const image = project.value.images[imageIdx]
  await updateImage(image.id, { ...image, order: newIdx + 1 })
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
      <Table class="overflow-x-auto grid grid-cols-[120px_max-content_max-content_1fr_max-content] md:grid-cols-[max-content_260px_200px_max-content_max-content]">
        <TableHeader class="grid grid-cols-subgrid col-span-5">
          <TableRow class="grid grid-cols-subgrid col-span-5">
            <TableHead>№</TableHead>
            <TableHead>Изображение</TableHead>
            <TableHead>Вид</TableHead>
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
          class="transition-all grid grid-cols-subgrid col-span-5 [&>.row-leave-active]:absolute "
        >
          <TransitionGroup
            name="row"
          >
            <TableRow
              v-for="(image) in project.images"
              :key="image.id"
              class="grid grid-cols-subgrid col-span-5 items-center"
            >
              <TableCell
                class="cursor-grab flex gap-4"
                :data-draggable-handler="true"
              >
                {{ image.order }} <GripVertical />
              </TableCell>
              <TableCell>
                <NuxtImg
                  format="avif,webp,png,jpg"
                  :class="cn('aspect-video w-[300px] object-contain border-primary border bg-white', image.fit)"
                  :src="image.url"
                  :alt="image.alt"
                />
              </TableCell>
              <TableCell>
                <Select
                  :model-value="image.fit"
                  class="w-fit"
                  @update:model-value="updateImage(image.id, { ...image, fit: $event as ImageFit })"
                >
                  <SelectTrigger
                    class="w-max"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem :value="'object-none'">
                      обычный
                    </SelectItem>
                    <SelectItem :value="'object-cover'">
                      увеличить
                    </SelectItem>
                    <SelectItem :value="'object-fill'">
                      растянуть
                    </SelectItem>
                    <SelectItem :value="'object-contain'">
                      внутри
                    </SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Input
                  :model-value="image.alt"
                  @change="updateImage(image.id, { ...image, alt: ($event.target as HTMLInputElement).value }) "
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
