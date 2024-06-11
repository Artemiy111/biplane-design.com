<script setup lang="ts">
import { toast } from 'vue-sonner'
import { EllipsisVertical, LoaderCircle } from 'lucide-vue-next'
import { vDraggable, type SortableEvent } from 'vue-draggable-plus'
import ProjectSheet from '~/components/admin/ProjectSheet.vue'
import type { CategoryDto, CreateProjectDto, GroupDto, ProjectDto, UpdateProjectDto } from '~/server/use-cases/types'
import type { ProjectId } from '~/server/db/schema'

definePageMeta({
  middleware: 'authenticated',
})

useSeoMeta({
  title: 'Админ-панель',
  ogTitle: 'Админ-панель',
  description: 'Менеджмент базы-данных',
  ogDescription: 'Менеджмент базы-данных',
})

const { md } = useScreenSize()
const { data: groups, error: fetchError, refresh } = await useLazyFetch<GroupDto[]>('/api/groups', {
  default: () => [] as GroupDto[],
})

const groupsMap = computed(() => new Map(groups.value.map(g => [g.id, g])))
const categories = computed(() => groups.value.flatMap(g => g.categories) || [])
const categoriesMap = computed(() => new Map(categories.value.map(c => [c.id, c])))
const projects = computed(() => categories.value.flatMap(c => c.projects))

function getCategoryById(id: number) {
  return categoriesMap.value.get(id)!
}

function getGroupById(id: number) {
  return groupsMap.value.get(id)!
}

const selectedCategory = ref<CategoryDto | null>(null)

watch(groups, () => {
  if (!groups.value.length) return
  selectedCategory.value = groups.value[0]?.categories[0] || null
}, { once: true })

const selectedCategoryProjects = ref<ProjectDto[]>([])
watchEffect(() => {
  selectedCategoryProjects.value = projects.value.filter((project) => {
    return project.categoryId === selectedCategory.value?.id
  })
})
watch(fetchError, () => {
  if (!fetchError.value)
    return
  toast.error(fetchError.value.message)
})

const projectSheetRef = ref<InstanceType<typeof ProjectSheet> | null>(null)

async function createProject(dto: CreateProjectDto) {
  try {
    await $fetch('/api/projects', {
      method: 'POST',
      body: dto,
    })
    projectSheetRef.value?.close()
    toast.success('Проект создан')
    refresh()
  }
  catch (_e) {
    const e = _e as Error
    toast.error(e.message)
  }
}

async function updateProject(id: ProjectId, dto: UpdateProjectDto) {
  try {
    await $fetch(`/api/projects/${id}`, {
      method: 'PUT',
      body: dto,
    })
    projectSheetRef.value?.close()
    toast.success('Проект изменён')
    refresh()
  }
  catch (_e) {
    const e = _e as Error
    toast.error(e.message)
  }
}

async function updateProjectOrder(e: SortableEvent) {
  const id = Number(e.item.dataset.projectId!)
  const order = e.oldDraggableIndex! + 1
  const newOrder = e.newDraggableIndex! + 1

  const [project] = selectedCategoryProjects.value.splice(order - 1, 1)
  selectedCategoryProjects.value.splice(newOrder - 1, 0, project)

  try {
    await $fetch(`/api/projects/${id}/update-order`, {
      method: 'PATCH',
      body: {
        order: newOrder,
      },
    })
    await refresh()
  }
  catch (_e) {
    toast.error('Ну удалось переместить проект')
  }
}

async function deleteProject(id: number) {
  try {
    await $fetch(`/api/projects/${id}`, {
      method: 'DELETE',
    })
    projectSheetRef.value?.close()
    toast.success('Проект удалён')
    refresh()
  }
  catch (_e) {
    const e = _e as Error
    toast.error(e.message)
  }
}

function openProjectSheet(project: ProjectDto) {
  projectSheetRef.value?.open({
    id: project.id,
    uri: project.uri,
    title: project.title,
    groupId: getGroupById(getCategoryById(project.categoryId).groupId).id,
    location: project.location,
    status: project.status,
    yearStart: project.yearStart,
    yearEnd: project.yearEnd,
    categoryId: project.categoryId,
    order: project.order,
    isMinimal: project.isMinimal,
  })
}
</script>

<template>
  <main
    v-if="!groups"
    class="container flex flex-grow flex-col items-center justify-center"
  >
    <LoaderCircle
      :size="60"
      :stroke-width="1.5"
      class="animate-spin"
    />
  </main>
  <main
    v-else
    class="container grid grid-cols-[300px,1fr] "
  >
    <aside class="flex flex-col gap-4 p-4">
      <li
        v-for="group in groups"
        :key="group.id"
        class="w-full list-none"
      >
        <ul class="flex w-full flex-col gap-2">
          <span class="w-full text-slate-800 rounded-sm px-2 py-1 font-bold">{{
            group.title
          }}</span>
          <li
            v-for="category in group.categories"
            :key="category.id"
            class="cursor-pointer ml-2 px-2 py-1 hover:bg-primary-foreground"
            :class="category.id === selectedCategory?.id ? 'font-bold bg-primary-foreground' : ''"
            @click="selectedCategory = category"
          >
            <span>{{ category.title }}</span>
          </li>
        </ul>
      </li>
    </aside>

    <section
      v-if="groups?.length"
      class="flex flex-col grow-1 w-full"
    >
      <ProjectSheet
        v-if="groups.length"
        ref="projectSheetRef"
        :groups="groups"
        @create="createProject"
        @update="updateProject"
      />

      <section class="px-8 py-4 sm:px-4 sm:py-2">
        <Button
          :size="md ? 'sm' : 'default'"
          :variant="md ? 'secondary' : 'default'"
          class="w-fit"
          @click="projectSheetRef?.open()"
        >
          Создать проект
        </Button>
      </section>

      <!-- <ScrollArea class="w-full h-dvh"> -->
      <Table class="grid grid-cols-1 text-xs w-full">
        <TableHeader class="w-full">
          <TableRow class="grid w-max grid-cols-[40px_100px_200px_200px_200px_200px_180px_120px_140px_180px_180px]">
            <TableHead>№</TableHead>
            <TableHead />
            <TableHead>Превью</TableHead>
            <TableHead>Название</TableHead>
            <TableHead>Uri</TableHead>
            <TableHead>Группа</TableHead>
            <TableHead>Категория</TableHead>
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
              onUpdate: updateProjectOrder,
            }]"
          class="w-full"
        >
          <TableRow
            v-for="project in selectedCategoryProjects"
            :key="project.id"
            :data-project-id="project.id"
            :data-order="project.order"
            class="cursor-pointer w-max grid grid-cols-[40px_100px_200px_200px_200px_200px_180px_120px_140px_180px_180px]"
            @click="navigateTo(`/admin/projects/${project.uri}`)"
          >
            <TableCell>{{ project.order }}</TableCell>
            <TableCell
              @click.stop
            >
              <Popover>
                <PopoverTrigger as-child>
                  <Button
                    variant="ghost"
                  >
                    <EllipsisVertical />
                  </Button>
                </PopoverTrigger>
                <PopoverContent class="z-10 flex w-fit flex-col gap-4">
                  <Button
                    variant="outline"
                    @click="openProjectSheet(project)"
                  >
                    Изменить
                  </Button>
                  <Button
                    variant="destructiveOutline"
                    @click="deleteProject(project.id)"
                  >
                    Удалить
                  </Button>
                </PopoverContent>
              </Popover>
            </TableCell>
            <TableCell>
              <NuxtImg
                v-if="project.images.length"
                format="avif,webp,png,jpg"
                :src="project.images[0].url"
                :alt="project.images[0].alt"
                class="aspect-video w-full object-cover"
              />
            </TableCell>
            <TableCell>
              <NuxtLink :to="`/admin/projects/${project.uri}`" />
              {{ project.title }}
            </TableCell>
            <TableCell>{{ project.uri }}</TableCell>
            <TableCell>{{ getGroupById(getCategoryById(project.categoryId).groupId).title }}</TableCell>
            <TableCell>{{ getCategoryById(project.categoryId).title }}</TableCell>
            <TableCell>{{ project.yearStart }}</TableCell>
            <TableCell>{{ project.yearEnd }}</TableCell>
            <TableCell>{{ project.status }}</TableCell>
            <TableCell>{{ project.location }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <!-- </ScrollArea> -->
    </section>
  </main>
</template>
