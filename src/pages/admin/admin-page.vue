<script setup lang="ts">
import { useBreakpoints, watchImmediate, watchOnce } from '@vueuse/core'
import { GripVertical, LoaderCircle, Pen, Trash2 } from 'lucide-vue-next'
import { vDraggable, type SortableEvent } from 'vue-draggable-plus'

import type { GroupId } from '~~/server/db/schema'
import type { CategoryDto, GroupDto, ProjectDto } from '~~/server/types'

import { breakpoints } from '~~/src/shared/config/breakpoints'
import { cn } from '~~/src/shared/lib/utils'
import {
  useCreateProjectMutation,
  useDeleteProjectMutation,
  useUpdateProjectMutation,
  useUpdateProjectOrderMutation,
} from '~~/src/shared/model/mutations'
import { useGroupsQuery } from '~~/src/shared/model/queries'
import { Button } from '~~/src/shared/ui/kit/button'
import { Popover, PopoverContent, PopoverTrigger } from '~~/src/shared/ui/kit/popover'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~~/src/shared/ui/kit/table'

import ProjectSheet from './ui/project-sheet.vue'

const title = 'Админ-панель'
const description = 'Менеджмент базы-данных'
useSeoMeta({ title, ogTitle: title, description, ogDescription: description })

const bps = useBreakpoints(breakpoints, { strategy: 'max-width' })
const md = bps.isSmallerOrEqual('md')

const { data: cachedGroups } = useNuxtData<GroupDto[]>('groups')

const selectedCategory = ref<CategoryDto | null>(cachedGroups.value?.[0]?.categories[0] ?? null)

const { groups, categories, projects } = useGroupsQuery()

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

const projectSheet = useTemplateRef('projectSheet')
// const projectsTableBody = useTemplateRef('projectsTableBody')

const { createProject } = useCreateProjectMutation()
const { updateProject } = useUpdateProjectMutation()
const { updateProjectOrder } = useUpdateProjectOrderMutation()
const { deleteProject } = useDeleteProjectMutation()

async function onUpdateProjectOrder(e: SortableEvent) {
  const id = Number(e.item.dataset.projectId!)
  const order = e.oldDraggableIndex! + 1
  const newOrder = e.newDraggableIndex! + 1

  const [project] = selectedCategoryProjects.value.splice(order - 1, 1)
  selectedCategoryProjects.value.splice(newOrder - 1, 0, project!)

  await updateProjectOrder([id, newOrder])
}

function getGroupById(id: GroupId) {
  return groups.value?.find(g => g.id === id) ?? null
}

function openProjectSheet(project: ProjectDto) {
  projectSheet.value?.open({
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
      isVisible: project.isVisible,
    },
  })
}
</script>

<template>
  <ClientOnly>
    <main
      v-if="!groups"
      class="container flex grow flex-col items-center justify-center"
    >
      <LoaderCircle
        class="animate-spin"
        :size="60"
        :stroke-width="1.5"
      />
    </main>
    <main
      v-else
      class="container mt-8 grid grid-cols-[200px_minmax(500px,1400px)] gap-8 px-8 max-lg:grid-cols-1 max-sm:px-4"
    >
      <ul class="flex flex-col gap-4">
        <li
          v-for="group in groups"
          :key="group.id"
          class="w-full list-none"
        >
          <ul class="flex w-full flex-col flex-wrap gap-2 max-lg:flex-row">
            <span class="w-full rounded-sm font-semibold text-slate-800">{{
              group.title
            }}</span>
            <li
              v-for="category in group.categories"
              :key="category.id"
            >
              <button
                :class="cn('ml-2 cursor-pointer px-2 py-1 hover:bg-primary-foreground max-lg:m-0',
                           category.id === selectedCategory?.id && 'bg-primary-foreground font-semibold')"
                type="button"
                @click="selectedCategory = category"
              >
                <span>{{ category.title }}</span>
              </button>
            </li>
          </ul>
        </li>
      </ul>
      <section
        v-if="groups?.length"
        class="flex w-full flex-col gap-4"
      >
        <ProjectSheet
          v-if="groups.length"
          ref="projectSheet"
          :groups="groups"
          @create="dto => createProject(dto).then(() => projectSheet?.close())"
          @update="(id, dto) => updateProject([id, dto]).then(() => projectSheet?.close())"
        />
        <Button
          class="w-fit"
          :size="md ? 'sm' : 'default'"
          @click="projectSheet?.open({
            mode: 'create',
            initial: selectedCategory
              ? ({
                groupId: selectedCategory.groupId,
                categoryId: selectedCategory.id,
              })
              : ({ groupId: groups![0]!.id, categoryId: groups![0]!.categories[0]!.id }),
          })"
        >
          Создать проект
        </Button>

        <Table class="grid grid-cols-[80px_100px_200px_200px_180px_120px_140px_170px_170px] overflow-x-auto text-xs">
          <TableHeader class="col-span-9 grid grid-cols-subgrid">
            <TableRow class="col-span-9 grid grid-cols-subgrid">
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
            v-draggable="[
              selectedCategoryProjects as any,
              {
                onUpdate: onUpdateProjectOrder,
                handle: `[data-draggable-handler='true']`,
              }]"
            class="col-span-9 grid grid-cols-subgrid"
          >
            <TableRow
              v-for="project in selectedCategoryProjects"
              :key="project.id"
              class="col-span-9 grid w-max grid-cols-subgrid items-center"
              :data-order="project.order"
              :data-project-id="project.id"
            >
              <TableCell
                class="flex cursor-grab gap-2"
                data-draggable-handler="true"
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
                    <Button @click="() => deleteProject(project.id).then(() => projectSheet?.close())">
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
