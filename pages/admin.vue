<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import type * as z from 'zod'
import { toast } from 'vue-sonner'
import type { ProjectCreate } from '~/server/db/schema'
import { type ProjectCreateSchema, projectCreateSchema } from '~/server/validators'

const { data: groups } = await useFetch('/api/themes')
const { data: projects, error: _error, refresh: refreshProjects } = await useFetch('/api/projects')

const createProjectFormInitialValues: Partial<ProjectCreateSchema> = {
  title: '',
  urlFriendly: '',
  groupId: groups.value?.[0].id.toString() as unknown as number,
  categoryId: groups.value?.[0].categories[0].id.toString() as unknown as number,
  status: '',
  yearStart: null,
  yearEnd: null,
  location: '',
}

const createProjectFormValidationSchema = toTypedSchema(projectCreateSchema)

const dialogOpen = ref(false)

async function onSubmit(values: ProjectCreateSchema) {
  try {
    await $fetch('/api/projects', {
      method: 'POST',
      body: values,
    })
    dialogOpen.value = false
    toast.success('Проект создан')
  }
  catch (e) {
    if (e instanceof Error)
      toast.error(e.message)
    else toast.error(String(e))
  }
  refreshProjects()
}

const selectedGroupId = ref<string | null>(groups.value?.[0].id.toString() || null)
const selectedGroup = computed<NonNullable<typeof groups.value>[number] | null>(
  () => groups.value?.find(g => g.id.toString() === selectedGroupId.value) || null,
)

function uploadFile(event: Event, project: { id: number, urlFriendly: string }) {
  const formData = new FormData()
  const target = event.target as HTMLInputElement
  const images = [...target.files || []]

  const jsonProject = JSON.stringify({ id: project.id, urlFriendly: project.urlFriendly })
  formData.append('project', jsonProject)
  images.forEach(image => formData.append('files', image))

  try {
    $fetch('/api/images', {
      method: 'POST',
      body: formData,
    })
    toast.success('Фотографии загружены')
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
  <main class="container flex flex-col">
    <section class="p-8">
      <Dialog :open="dialogOpen">
        <DialogTrigger as-child>
          <Button @click="dialogOpen = true">
            Создать проект
          </Button>
        </DialogTrigger>
        <DialogContent class="max-h-[90dvh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Создать проект</DialogTitle>
            <DialogDescription>
              Заполните поля
            </DialogDescription>
          </DialogHeader>
          <Form
            id="create-project-form"
            v-slot="{ values, errors, setFieldValue }"
            :initial-values="createProjectFormInitialValues"
            :validation-schema="createProjectFormValidationSchema"
            class="grid gap-4"
            @submit="onSubmit($event as ProjectCreateSchema)"
          >
            {{ values }}
            {{ errors }}
            <FormField v-slot="{ componentField, handleChange }" name="title">
              <FormItem>
                <FormLabel>Название проекта</FormLabel>
                <FormControl>
                  <Input :model-value="componentField.modelValue" placeholder="Мой новый дом" @change="handleChange" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField } " name="groupId">
              <FormItem>
                <FormLabel>Группа</FormLabel>
                <Select
                  v-bind="componentField" @update:model-value="(v) => {
                    selectedGroupId = v
                    setFieldValue('categoryId', selectedGroup?.categories[0]?.id.toString(), false)
                  }"
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите группу" />  <!-- !FIXME -->
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent v-if="groups?.length">
                    <SelectGroup>
                      <SelectItem v-for="group in groups" :key="group.id" :value="group.id.toString()">
                        {{ group.title }}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="categoryId">
              <FormItem>
                <FormLabel>Категория</FormLabel>
                <Select v-bind="componentField">
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent v-if="selectedGroup?.categories.length">
                    <SelectGroup>
                      <SelectItem v-for="c in selectedGroup.categories" :key="c.id" :value="c.id.toString()">
                        {{ c.title }}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField, handleChange }" name="urlFriendly">
              <FormItem>
                <FormLabel>Человекопонятная ссылка</FormLabel>
                <FormControl>
                  <Input :model-value="componentField.modelValue" placeholder="my-new-house" @change="handleChange" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField, handleChange }" name="status">
              <FormItem>
                <FormLabel>Статус</FormLabel>
                <FormControl>
                  <Input :model-value="componentField.modelValue" placeholder="Завершён" @change="handleChange" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField, handleChange }" name="yearStart">
              <FormItem>
                <FormLabel>Год начала</FormLabel>
                <FormControl>
                  <Input :model-value="componentField.modelValue" type="number" placeholder="" @change="handleChange" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField, handleChange }" name="yearEnd">
              <FormItem>
                <FormLabel>Год завершения</FormLabel>
                <FormControl>
                  <Input :model-value="componentField.modelValue" type="number" placeholder="" @change="handleChange" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField, handleChange }" name="location">
              <FormItem>
                <FormLabel>Расположение</FormLabel>
                <FormControl>
                  <Input :model-value="componentField.modelValue" placeholder="Уфа" @change="handleChange" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <DialogFooter>
              <Button type="submit" for="create-project-form">
                Создать
              </Button>
            </DialogFooter>
          </Form>
        </DialogContent>
      </Dialog>
    </section>

    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Превью</TableHead>
          <TableHead>Проект</TableHead>
          <TableHead>Группа</TableHead>
          <TableHead>Категория</TableHead>
          <TableHead>Загрузить фото</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="p in projects" :key="p.id">
          <TableCell>
            <NuxtImg v-if="p.images.length" format="avif,webp,png,jpg" :src="`/images/projects/${p.urlFriendly}/${p.images[0].filename}`" :alt="p.images[0].title || 'image'" class="aspect-video h-[100px] object-cover" />
          </TableCell>
          <TableCell>{{ p.title }}</TableCell>
          <TableCell>{{ p.category.theme.title }}</TableCell>
          <TableCell>{{ p.category.title }}</TableCell>
          <TableCell>
            <Input
              class="w-max"
              type="file" multiple accept=".avif, .webp, .jpg, .jpeg, .png"
              @input="uploadFile($event, { id: p.id, urlFriendly: p.urlFriendly })"
            />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </main>
</template>
