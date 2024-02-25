<script setup lang="ts">
import { toast } from 'vue-sonner'

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
        project: {
          id: project.value.id,
          urlFriendly: project.value.urlFriendly,
        },
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
              <Button variant="outline" @click="deleteImages([image.filename])">
                Удалить
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </section>
  </main>
</template>
