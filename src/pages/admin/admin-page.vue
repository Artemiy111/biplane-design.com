<script setup lang="ts">
import { useBreakpoints, watchImmediate, watchOnce } from '@vueuse/core'
import { GripVertical, LoaderCircle, Pen, Trash2 } from 'lucide-vue-next'
import { vDraggable, type SortableEvent } from 'vue-draggable-plus'
import { toast } from 'vue-sonner'

import type { GroupId, ProjectId } from '~~/server/db/schema'
import type { CategoryDto, CreateProjectDto, GroupDto, ProjectDto, UpdateProjectDto } from '~~/server/use-cases/types'

import { useApi } from '~~/src/shared/api'
import { cn } from '~~/src/shared/lib/utils'
import { useGroups, useProjects } from '~~/src/shared/model/queries'
import { Button } from '~~/src/shared/ui/kit/button'
import { Popover, PopoverContent, PopoverTrigger } from '~~/src/shared/ui/kit/popover'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~~/src/shared/ui/kit/table'
import { screenBreakpoints } from '~~/tailwind.config'

import ProjectSheet from './ui/project-sheet.vue'

const title = 'Админ-панель'
const description = 'Менеджмент базы-данных'
useServerSeoMeta({ title, ogTitle: title, description, ogDescription: description })
useSeoMeta({ title, ogTitle: title, description, ogDescription: description })

const api = useApi()
const queryCache = useQueryCache()
const breakpoints = useBreakpoints(screenBreakpoints, { strategy: 'max-width' })
const md = breakpoints.isSmallerOrEqual('md')

const { data: cachedGroups } = useNuxtData<GroupDto[]>('groups')

const selectedCategory = ref<CategoryDto | null>(cachedGroups.value?.[0]?.categories[0] ?? null)

const { data: groups } = useGroups()
const categories = computed(() => groups.value?.flatMap(g => g.categories) ?? [])
const { data: projects } = useProjects()

watchOnce(groups, () => {
  if (!groups.value?.length) return
  selectedCategory.value = groups.value[0]?.categories[0] ?? null
})

function getCategoryById(id: number) {
  return categories.value.find(c => c.id === id)!
}

const selectedCategoryProjects = ref<ProjectDto[]>([])
watchImmediate(() => [selectedCategory.value, projects.value], () => {
  selectedCategoryProjects.value = projects.value?.filter((project) => {
    return project.categoryId === selectedCategory.value?.id
  }) ?? []
})

const projectSheetRef = ref<InstanceType<typeof ProjectSheet> | null>(null)

const projectsTableBody = ref<InstanceType<typeof TableBody> | null>(null)
// FIXME TODO чтотоот

const toastMessages = {
  create: {
    success: 'Проект создан',
    error: 'Не удалось создать проект',
  },
  update: {
    success: 'Проект изменён',
    error: 'Не удалось изменить проект',
  },
  updateOrder: {
    error: 'Не удалось переместить проект',
  },
  delete: {
    success: 'Проект удалён',
    error: 'Не удалось удалить проект',
  },
}

const { mutate: createProject } = useMutation({
  mutation: (dto: CreateProjectDto) => api.projects.createOne.mutate(dto),
  onSuccess: () => {
    projectSheetRef.value?.close()
    toast.success(toastMessages.create.success)
  },
  onError: () => {
    toast.error(toastMessages.create.error)
  },
  onSettled: () => {
    queryCache.invalidateQueries({ key: ['projects'] })
  },
})

const { mutate: updateProject } = useMutation({
  mutation: ([id, dto]: [ProjectId, UpdateProjectDto]) => api.projects.updateOne.mutate({ id, ...dto }),
  onSuccess: () => {
    projectSheetRef.value?.close()
    toast.success(toastMessages.update.success)
  },
  onError: (e) => {
    toast.error(toastMessages.update.error)
  },
  onSettled() {
    queryCache.invalidateQueries({ key: ['projects'] })
  },
})

const { mutate: updateProjectOrder } = useMutation({
  mutation: ([id, order]: [ProjectId, number]) => api.projects.updateOrder.mutate({ id, order }),
  onError: () => {
    toast.error(toastMessages.updateOrder.error)
  },
  onSettled() {
    queryCache.invalidateQueries({ key: ['projects'] })
  },
})

async function onUpdateProjectOrder(e: SortableEvent) {
  const id = Number(e.item.dataset.projectId!)
  const order = e.oldDraggableIndex! + 1
  const newOrder = e.newDraggableIndex! + 1

  const [project] = selectedCategoryProjects.value.splice(order - 1, 1)
  selectedCategoryProjects.value.splice(newOrder - 1, 0, project!)

  updateProjectOrder([id, newOrder])
}

const { mutate: deleteProject } = useMutation({
  mutation: (id: ProjectId) => api.projects.deleteOne.mutate({ id }),
  onSuccess: () => {
    projectSheetRef.value?.close()
    toast.success(toastMessages.delete.success)
  },
  onError: () => {
    toast.error(toastMessages.delete.error)
  },
  onSettled() {
    queryCache.invalidateQueries({ key: ['projects'] })
  },
})

function getGroupById(id: GroupId) {
  return groups.value?.find(g => g.id === id) ?? null
}

function openProjectSheet(project: ProjectDto) {
  projectSheetRef.value?.open({
    mode: 'update',
    initial: {
      id: project.id,
      slug: project.slug,
      title: project.title,
      groupId: getGroupById(getCategoryById(project.categoryId).groupId)!.id,
      location: project.location,
      status: project.status,
      yearStart: project.yearStart,
      yearEnd: project.yearEnd,
      categoryId: project.categoryId,
      order: project.order,
      isMinimal: project.isMinimal,
    },
  })
}
</script>

<template>
  <ClientOnly>
    <main
      v-if="!groups"
      class="container flex flex-grow flex-col items-center justify-center"
    >
      <LoaderCircle
        class="animate-spin"
        :size="60"
        :stroke-width="1.5"
      />
    </main>
    <main
      v-else
      class="container grid gap-8 grid-cols-[200px_minmax(500px,1400px)] lg:grid-cols-1 px-8 sm:px-4 mt-8"
    >
      <ul class="flex flex-col gap-4">
        <li
          v-for="group in groups"
          :key="group.id"
          class="w-full list-none"
        >
          <ul class="flex w-full flex-col lg:flex-row flex-wrap gap-2">
            <span class="w-full text-slate-800 rounded-sm font-semibold">{{
              group.title
            }}</span>
            <li
              v-for="category in group.categories"
              :key="category.id"
              :class="cn('cursor-pointer ml-2 lg:m-0 px-2 py-1 hover:bg-primary-foreground',
                         category.id === selectedCategory?.id && 'font-semibold bg-primary-foreground')"
              role="button"
              tabindex="0"
              @click="selectedCategory = category"
              @keypress.enter.space="selectedCategory = category"
            >
              <span>{{ category.title }}</span>
            </li>
          </ul>
        </li>
      </ul>
      <section
        v-if="groups?.length"
        class="flex flex-col gap-4 w-full"
      >
        <ProjectSheet
          v-if="groups.length"
          ref="projectSheetRef"
          :groups="groups"
          @create="createProject"
          @update="(id, dto) => updateProject([id, dto])"
        />

        <Button
          class="w-fit"
          :size="md ? 'sm' : 'default'"
          @click="projectSheetRef?.open({
            mode: 'create',
            initial: selectedCategory
              ? ({
                groupId: selectedCategory.groupId,
                categoryId: selectedCategory.id })
              : undefined })"
        >
          Создать проект
        </Button>

        <Table class="grid overflow-x-auto text-xs grid-cols-[80px_100px_200px_200px_180px_120px_140px_170px_170px]">
          <TableHeader class="grid grid-cols-subgrid col-span-9">
            <TableRow class="grid grid-cols-subgrid col-span-9">
              <TableHead>№</TableHead>
              <TableHead />
              <TableHead>Превью</TableHead>
              <TableHead>Название</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Начало</TableHead>
              <TableHead>Завершение</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Расположение</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody
            ref="projectsTableBody"
            v-draggable="[
              selectedCategoryProjects as any,
              {
                onUpdate: onUpdateProjectOrder,
                handle: `[data-draggable-handler='true']`,
              }]"
            class="grid grid-cols-subgrid col-span-9"
          >
            <TableRow
              v-for="project in selectedCategoryProjects"
              :key="project.id"
              class="items-center w-max grid grid-cols-subgrid col-span-9"
              :data-order="project.order"
              :data-project-id="project.id"
            >
              <TableCell
                class="flex gap-2 cursor-grab"
                :data-draggable-handler="true"
              >
                {{ project.order }}
                <GripVertical />
              </TableCell>
              <TableCell
                class="flex gap-4"
                @click.stop
              >
                <button
                  type="button"
                  @click="openProjectSheet(project)"
                >
                  <Pen />
                </button>
                <Popover>
                  <PopoverTrigger>
                    <button
                      class="text-red-500"
                      type="button"
                    >
                      <Trash2 />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent class="z-10 flex w-fit flex-col gap-4">
                    Вы действительно хотите удалить проект?
                    <Button
                      @click="deleteProject(project.id)"
                    >
                      Да
                    </Button>
                  </PopoverContent>
                </Popover>
              </TableCell>
              <TableCell>
                <NuxtLink :to="`/admin/projects/${project.slug}`">
                  <NuxtImg
                    v-if="project.images.length"
                    :alt="project.images[0]!.alt"
                    :class="cn('aspect-video w-full', project.images[0]!.fit)"
                    format="avif,webp,png,jpg"
                    :src="project.images[0]!.url"
                  />
                </NuxtLink>
              </TableCell>
              <TableCell>
                <NuxtLink :to="`/admin/projects/${project.slug}`">
                  {{ project.title }}
                </NuxtLink>
              </TableCell>
              <TableCell>{{ project.slug }}</TableCell>
              <TableCell>{{ project.yearStart }}</TableCell>
              <TableCell>{{ project.yearEnd }}</TableCell>
              <TableCell>{{ project.status }}</TableCell>
              <TableCell>{{ project.location }}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>
    </main>
  </ClientOnly>
</template>
