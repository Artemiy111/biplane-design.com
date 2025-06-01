<script setup lang="ts">
import { GripVertical, Trash2 } from 'lucide-vue-next'
import { vDraggable, type SortableEvent } from 'vue-draggable-plus'

import type { ImageFit } from '~~/server/db/schema'

import { cn } from '~~/src/shared/lib/utils'
import { useDeleteImageMutation, useUpdateImageMutation } from '~~/src/shared/model/mutations'
import { useProjectQuery } from '~~/src/shared/model/queries'
import { Dropzone } from '~~/src/shared/ui/blocks/dropzone'
import PageHeading from '~~/src/shared/ui/blocks/page-heading/page-heading.vue'
import { Input } from '~~/src/shared/ui/kit/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~~/src/shared/ui/kit/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~~/src/shared/ui/kit/table'

const props = defineProps<{
  slug: string
}>()

const { project } = useProjectQuery(toRef(() => props.slug))

const title = computed(() => `Админ-панель | ${project.value?.title}`)
const description = computed(() => `Админ-панель | ${project.value?.title}`)
useSeoMeta({ title, ogTitle: title, description, ogDescription: description })

const { deleteImage } = useDeleteImageMutation()
const { updateImage } = useUpdateImageMutation()

async function onUpdateImageOrder(e: SortableEvent) {
  if (!project.value) return
  const imageIdx = e.oldDraggableIndex!
  const newIdx = e.newDraggableIndex!
  const image = project.value.images[imageIdx]!
  await updateImage({ ...image, order: newIdx + 1 })
}

// FIXME: доделвть

async function uploadImages(_images: File[]) {
  // projectModel.uploadImages(images)
}
</script>

<template>
  <main
    v-if="project"
    class="container flex flex-col"
  >
    <PageHeading>{{ project.title }}</PageHeading>
    <div class="grid grid-cols-[max-content_1fr] gap-x-16 gap-y-8 mb-12 max-md:grid-cols-1">
      <section
        class="grid w-full grid-cols-[repeat(2,max-content)] gap-x-4 gap-y-4 max-md:gap-x-8 max-md:overflow-x-auto"
      >
        <span class="font-semibold">Id</span>
        <span>{{ project.id }}</span>
        <span class="font-semibold">Slug</span>
        <span>{{ project.slug }}</span>
        <span class="font-semibold">Расположение</span>
        <span>{{ project.location }}</span>
        <span class="font-semibold">Год начала</span>
        <span>{{ project.yearStart }}</span>
        <span class="font-semibold">Год завершения</span>
        <span>{{ project.yearEnd }}</span>
        <span class="font-semibold">Мини</span>
        <span>{{ project.isMinimal ? "да" : 'нет' }}</span>
        <span class="font-semibold">№ в категории</span>
        <span>{{ project.order }}</span>
        <span class="font-semibold">Изображений</span>
        <span>{{ project.images.length }}</span>
      </section>
      <Dropzone
        class="h-full min-h-[25vh] "
        clear-on-upload
        multiple
        show-icon
        @upload="uploadImages"
      />
    </div>

    <section class="flex flex-col gap-4">
      <Table
        class="grid overflow-x grid-cols-[120px_max-content_max-content_1fr_max-content] overflow-x-auto max-md:grid-cols-[max-content_260px_200px_max-content_max-content]"
      >
        <TableHeader class="col-span-5 grid grid-cols-subgrid">
          <TableRow class="col-span-5 grid grid-cols-subgrid">
            <TableHead>№</TableHead>
            <TableHead>Изображение</TableHead>
            <TableHead>Вид</TableHead>
            <TableHead>Описание</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody
          v-draggable="[
            project.images as any, {
              onUpdate: onUpdateImageOrder,
              handle: `[data-draggable-handler='true']`,
            }]"
          class="col-span-5 grid grid-cols-subgrid transition-all [&>.row-leave-active]:absolute "
        >
          <TransitionGroup name="row">
            <TableRow
              v-for="(image) in project.images"
              :key="image.id"
              class="col-span-5 grid grid-cols-subgrid items-center"
            >
              <TableCell
                class="flex cursor-grab gap-4"
                data-draggable-handler
              >
                {{ image.order }}
                <GripVertical />
              </TableCell>
              <TableCell>
                <NuxtImg
                  :alt="image.alt"
                  :class="cn('aspect-video w-[300px] border border-primary bg-white object-contain', image.fit)"
                  format="avif,webp,png,jpg"
                  :src="image.url"
                />
              </TableCell>
              <TableCell>
                <Select
                  class="w-fit"
                  :model-value="image.fit"
                  @update:model-value="updateImage({ ...image, fit: $event as ImageFit })"
                >
                  <SelectTrigger class="w-max">
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
                  @change="updateImage({ ...image, alt: ($event.target as HTMLInputElement).value })"
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
.row-move,
.row-enter-active,
.row-leave-active {
  transition: all 0.5s ease;
}

.row-enter-from,
.row-leave-to {
  opacity: 0;
}

.row-leave-active {
  position: absolute;
}
</style>
