<script setup lang="ts">
import { toast } from 'vue-sonner'
import { EllipsisVertical } from 'lucide-vue-next'
import ProjectSheet from '~/components/admin/ProjectSheet.vue'
import type { FormSchema } from '~/components/admin/ProjectSheet.vue'
import type { CategoryDto, GroupDto, ProjectDto } from '~/server/use-cases/types'

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
const { data: _groups, error: fetchError, refresh } = await useLazyFetch<GroupDto[]>('/api/groups')

const groups = computed(() => _groups.value || [])
const groupsMap = computed(() => new Map(groups.value.map(g => [g.id, g])))
const categories = computed(() => groups.value.flatMap(g => g.categories) || [])
const categoriesMap = computed(() => new Map(categories.value.map(c => [c.id, c])))
const projects = computed(() => categories.value.flatMap(c => c.projects) || [])

type SelectedGroupAndCategoryState = {
  group: null
  category: null
} | {
  group: GroupDto
  category: null
} | {
  group: GroupDto
  category: CategoryDto
}

function getCategoryById(id: number) {
  return categoriesMap.value.get(id)!
}

function getGroupById(id: number) {
  return groupsMap.value.get(id)!
}

function useSelected() {
  const selected = ref<SelectedGroupAndCategoryState>({ group: null, category: null })

  const setSelected = (newSelected: SelectedGroupAndCategoryState) => { selected.value = newSelected }

  return {
    selected: readonly(selected),
    setSelected,
  }
}

const { selected, setSelected } = useSelected()
watch(groups, () => {
  if (!groups.value.length) return
  setSelected({ group: groups.value[0], category: null })
}, { once: true })

const selectedCategoryOrGroupProjects = computed(() =>
  projects.value.filter((project) => {
    if (selected.value.category)
      return project.categoryId === selected.value.category.id

    const category = getCategoryById(project.categoryId)
    const group = getGroupById(category.groupId)

    return group.id === selected.value.group?.id
  }),
)

function selectCategory(group: GroupDto, category: CategoryDto | null) {
  setSelected({ group, category })
}

watch(fetchError, () => {
  if (!fetchError.value)
    return
  toast.error(fetchError.value.message)
})

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
    catch (_e) {
      const e = _e as Error
      toast.error(e.message)
    }
    refresh()
    return
  }

  try {
    await $fetch(`/api/projects/${prev.id}`, {
      method: 'PUT',
      body: values,
    })
    projectSheetRef.value?.close()
    toast.success('Проект изменён')
  }
  catch (_e) {
    const e = _e as Error
    toast.error(e.message)
  }

  refresh()
}

async function deleteProject(id: number) {
  try {
    await $fetch(`/api/projects/${id}`, {
      method: 'DELETE',
    })
    projectSheetRef.value?.close()
    toast.success('Проект удалён')
  }
  catch (_e) {
    const e = _e as Error
    toast.error(e.message)
  }
  refresh()
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
    images: [],
  })
}
</script>

<template>
  <main class="container grid grid-cols-[300px,1fr]">
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
            class="cursor-pointer ml-2 px-2 py-1 hover:bg-primary-foreground"
            :class="
              selected.group?.id === group.id && !selected.category
                ? 'font-bold bg-primary-foreground'
                : ''
            "
            @click="selectCategory(group, null)"
          >
            Все
          </li>
          <li
            v-for="category in group.categories"
            :key="category.id"
            class="cursor-pointer ml-2 px-2 py-1 hover:bg-primary-foreground"
            :class="category.id === selected.category?.id ? 'font-bold bg-primary-foreground' : ''"
            @click="selectCategory(group, category)"
          >
            <span>{{ category.title }}</span>
          </li>
        </ul>
      </li>
    </aside>

    <section v-if="groups?.length">
      <ProjectSheet
        v-if="groups.length"
        ref="projectSheetRef"
        :groups="groups"
        @submit="onSubmit"
      />

      <section class="px-8 py-4 sm:px-4 sm:py-2">
        <Button
          :size="md ? 'sm' : 'default'"
          :variant="md ? 'secondary' : 'default'"
          @click="projectSheetRef?.open()"
        >
          Создать проект
        </Button>
      </section>

      <Table class="">
        <TableHeader>
          <TableRow>
            <TableHead>Превью</TableHead>
            <TableHead>Проект</TableHead>
            <TableHead>Uri</TableHead>
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
          <TableRow
            v-for="project in selectedCategoryOrGroupProjects"
            :key="project.id"
            class="cursor-pointer"
            @click="navigateTo(`/admin/projects/${project.uri}`)"
          >
            <TableCell>
              <NuxtImg
                v-if="project.images.length"
                format="avif,webp,png,jpg"
                :src="project.images[0].url"
                :alt="project.images[0].alt"
                class="aspect-video max-h-[100px] w-fit object-cover"
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
            <TableCell @click.stop>
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
          </TableRow>
        </TableBody>
      </Table>
    </section>
  </main>
</template>
