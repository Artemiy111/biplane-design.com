<script setup lang="ts">
import { GripVertical, Trash2 } from 'lucide-vue-next'
import { vDraggable, type SortableEvent } from 'vue-draggable-plus'
import { toast } from 'vue-sonner'

import type { ImageFit, ImageId } from '~~/server/db/schema'
import type { UpdateImageDto } from '~~/server/use-cases/types'

import { cn } from '~~/src/shared/lib/utils'
import { useProjectModel } from '~~/src/shared/model/project'
import Dropzone from '~~/src/shared/ui/blocks/dropzone/dropzone.vue'
import { Input } from '~~/src/shared/ui/kit/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~~/src/shared/ui/kit/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~~/src/shared/ui/kit/table'

const props = defineProps<{
  uri: string
}>()

const projectModel = useProjectModel()
const project = computed(() => projectModel.project)

await useAsyncData(`project-${props.uri}`, () => projectModel.load(props.uri), { watch: [toRef(() => props.uri)] })

const title = computed(() => `Админ-панель | ${project.value?.title}`)
const description = computed(() => `Админ-панель | ${project.value?.title}`)
useServerSeoMeta({ title, ogTitle: title, description, ogDescription: description })
useSeoMeta({ title, ogTitle: title, description, ogDescription: description })

async function deleteImage(id: ImageId) {
  try {
    await projectModel.deleteImage(id)
  }
  catch (_e) {
    toast.error(`Не удалось удалить изображение`)
  }
}

async function updateImage(id: ImageId, dto: UpdateImageDto) {
  try {
    await projectModel.updateImage(id, dto)
  }
  catch (_e) {
    toast.error('Не удалось обновить изображение')
  }
}

async function updateImageOrder(e: SortableEvent) {
  if (!project.value) return
  const imageIdx = e.oldDraggableIndex!
  const newIdx = e.newDraggableIndex!
  const image = project.value.images[imageIdx]!
  await updateImage(image.id, { ...image, order: newIdx + 1 })
}

async function uploadImages(images: File[]) {
  projectModel.uploadImages(images)
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
        :multiple="true"
        :show-icon="true"
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
                  :alt="image.alt"
                  :class="cn('aspect-video w-[300px] object-contain border-primary border bg-white', image.fit)"
                  format="avif,webp,png,jpg"
                  :src="image.url"
                />
              </TableCell>
              <TableCell>
                <Select
                  class="w-fit"
                  :model-value="image.fit"
                  @update:model-value="updateImage(image.id, { ...image, fit: $event as ImageFit })"
                >
                  <SelectTrigger
                    class="w-max"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="object-none">
                      обычный
                    </SelectItem>
                    <SelectItem value="object-cover">
                      увеличить
                    </SelectItem>
                    <SelectItem value="object-fill">
                      растянуть
                    </SelectItem>
                    <SelectItem value="object-contain">
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
                  type="button"
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
