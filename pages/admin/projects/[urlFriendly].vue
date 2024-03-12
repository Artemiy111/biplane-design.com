<script setup lang="ts">
import { toast } from 'vue-sonner'
import { ArrowDown, ArrowUp } from 'lucide-vue-next'
import type { Image, ImageUpdate } from '~/server/db/schema'

const route = useRoute()
const projectUrlFriendly = route.params.urlFriendly as string
const { data: project, error: _error, refresh: refreshImages } = await useFetch(`/api/projects/${projectUrlFriendly}`)

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
    toast.success(`Изображений успешно удалено: ${filenames.length}`)
  }
  catch (e) {
    toast.error(`Не удалось удалить изображений: ${filenames.length}`)
  }
  refreshImages()
}

async function updateImage(image: Image, updateData: ImageUpdate) {
  console.log(image, updateData)
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
</script>

<template>
  <main v-if="project" class="container flex flex-col">
    <section class="flex p-8">
      {{ project.title }}
      {{ project.urlFriendly }}
    </section>
    <section class="flex flex-col gap-4 p-8">
      <span>Изображений: {{ project.images.length }}</span>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Картинка</TableHead>
            <TableHead>Название файла</TableHead>
            <TableHead>Опции</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="image in project.images" :key="image.filename">
            <TableCell>
              <NuxtImg
                :src="`/images/projects/${project.urlFriendly}/${image.filename}`"
                format=".avif, .webp, .png, .jpg"
                class="aspect-square h-[300px] w-full object-contain"
              />
            </TableCell>
            <TableCell> {{ image.filename }}</TableCell>
            <TableCell>
              <div class="flex w-full flex-col items-center gap-2">
                <Button variant="ghost" @click="updateImage(image as unknown as Image, { order: image.order + 1 })">
                  <ArrowUp />
                </Button>
                <Button variant="outline" @click="deleteImages([image.filename])">
                  Удалить
                </Button>
                <Button variant="ghost" @click="updateImage(image as unknown as Image, { order: image.order - 1 })">
                  <ArrowDown />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </section>
  </main>
</template>
