<script setup lang="ts">
import { toast } from 'vue-sonner'
import { EllipsisVertical } from 'lucide-vue-next'
import { FlexRender, getCoreRowModel, useVueTable } from '@tanstack/vue-table'
import ProjectSheet from '~/components/admin/ProjectSheet.vue'
import type { FormSchema, Mode } from '~/components/admin/ProjectSheet.vue'
import type { CategoryRec, GroupRec, ProjectRec } from '~/server/db/schema'

definePageMeta({
  middleware: 'auth',
})

useSeoMeta({
  title: 'Админ-панель',
  ogTitle: 'Админ-панель',
  description: 'Менеджмент базы-данных',
  ogDescription: 'Менеджмент базы-данных',
})

const { md } = useScreenSize()
const { data: groups, error: groupsError } = await useFetch('/api/groups')
const { data: projects, error: projectsError, refresh: refreshProjects } = await useFetch('/api/projects')

const selectedCategoryId = ref<number | null>(groups.value?.[0]?.categories[0].id || null)

function selectCategory(categoryId: number) {
  selectedCategoryId.value = categoryId
}

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

const hoverCardIsOpen = ref(false)
const projectSheetRef = ref<InstanceType<typeof ProjectSheet> | null>(null)
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
    images: [],
  })
}

async function uploadImages(images: File[], project: { id: number, urlFriendly: string }) {
  const formData = new FormData()
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
  <main class="container grid grid-cols-[300px,1fr]">
    <aside class="flex flex-col gap-4 p-4">
      <ul class="flex flex-col gap-2">
        <h3 class="text-xl font-bold">
          Группы
        </h3>
      </ul>
      <li v-for="group in groups" :key="group.id" class="w-full list-none">
        <ul class="flex w-full flex-col gap-2">
          <span class="w-full rounded-sm border-2 border-primary px-2 py-1 font-bold">{{ group.title }}</span>
          <li
            v-for="category in group.categories" :key="category.id" class="cursor-pointer px-2 py-1 hover:bg-primary-foreground"
            :class="category.id === selectedCategoryId ? 'font-bold bg-primary-foreground' : ''"
            @click="selectCategory(category.id)"
          >
            <span>{{ category.title }}</span>
          </li>
        </ul>
      </li>
    </aside>

    <section v-if="groups?.length">
      <ProjectSheet
        v-if="groups.length" ref="projectSheetRef"
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
            <TableHead>
              Превью
            </TableHead>
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
          <TableRow v-for="p in projects" :key="p.id" class="cursor-pointer" @click="navigateTo(`/admin/projects/${p.urlFriendly}`)">
            <TableCell>
              <NuxtImg
                v-if="p.images.length"
                format="avif,webp,png,jpg"
                :src="`/images/projects/${p.urlFriendly}/${p.images[0].filename}`"
                :alt="p.images[0].title || 'изображение'"
                class="aspect-video max-h-[100px] w-fit object-cover"
              />
            </TableCell>
            <TableCell>
              <NuxtLink :to="`/admin/projects/${p.urlFriendly}`" />
              {{ p.title }}
            </TableCell>
            <TableCell>{{ p.urlFriendly }}</TableCell>
            <TableCell>{{ p.category.group.title }}</TableCell>
            <TableCell>{{ p.category.title }}</TableCell>
            <TableCell>{{ p.yearStart }}</TableCell>
            <TableCell>{{ p.yearEnd }}</TableCell>
            <TableCell>{{ p.status }}</TableCell>
            <TableCell>{{ p.location }}</TableCell>
            <TableCell @click.stop>
              <HoverCard :open-delay="0" :open="hoverCardIsOpen" @update:open="hoverCardIsOpen = $event">
                <HoverCardTrigger as-child>
                  <Button variant="ghost" @click="hoverCardIsOpen = true">
                    <EllipsisVertical />
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent class="z-10 flex w-fit flex-col gap-4">
                  <Button variant="outline" @click="openChangeProject(p as unknown as ProjectRec)">
                    Изменить
                  </Button>
                  <Button variant="destructiveOutline">
                    Удалить
                  </Button>
                </HoverCardContent>
              </HoverCard>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </section>
  </main>
</template>
