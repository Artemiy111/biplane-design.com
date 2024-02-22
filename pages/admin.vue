<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import type { ProjectCreate } from '~/server/db/schema'

const { data: groups } = await useFetch('/api/themes')
const { data: projects, error: _error } = await useFetch('/api/projects')

const formShema = z.object({
  title: z.string().min(3),
  groupId: z.string(),
  categoryId: z.string(),
  urlFriendly: z.string().min(3),
  yearStart: z.number().nullable(),
  yearEnd: z.number().nullable(),
  location: z.string().min(3),
})
const formInitialValues: Partial<FormSchema> = {
  title: '',
  urlFriendly: '',
  groupId: groups.value?.[0].id.toString(),
  categoryId: groups.value?.[0].categories[0].id.toString(),
  yearStart: null,
  yearEnd: null,
  location: '',
}

const validationSchema = toTypedSchema(formShema)
type FormSchema = z.infer<typeof formShema>

function onSubmit(values: FormSchema) {
  console.log(values)
}

const selectedGroup = ref(groups.value?.[0] || null)

function uploadFile(event: Event, project: { id: number, urlFriendly: string }) {
  const formData = new FormData()
  const target = event.target as HTMLInputElement
  const images = [...target.files || []]

  const jsonProject = JSON.stringify({ id: project.id, urlFriendly: project.urlFriendly })
  formData.append('project', jsonProject)
  images.forEach(image => formData.append('files', image))

  $fetch('/api/images', {
    method: 'POST',
    body: formData,
  })
}
</script>

<template>
  <main class="container flex flex-col">
    <section class="p-8">
      <Dialog>
        <DialogTrigger as-child>
          <Button>Создать проект</Button>
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
            v-slot="{ values }"
            :initial-values="formInitialValues"
            :validation-schema="validationSchema"
            class="grid gap-4"
            @submit="onSubmit($event as FormSchema)"
          >
            {{ values }}
            <FormField v-slot="{ componentField, handleChange }" name="title">
              <FormItem>
                <FormLabel>Название проекта</FormLabel>
                <FormControl>
                  <Input :movel-value="componentField.modelValue" placeholder="Мой новый дом" @change="handleChange" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="groupId">
              <FormItem>
                <FormLabel>Группа</FormLabel>
                <Select v-bind="componentField">
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите группу" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup v-if="groups?.length">
                      <SelectItem v-for="theme in groups" :key="theme.id" :value="theme.id.toString()">
                        {{ theme.title }}
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
                  <SelectContent>
                    <SelectGroup v-if="selectedGroup?.categories.length">
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
            <FormField v-slot="{ componentField }" name="yearStart">
              <FormItem>
                <FormLabel>Год начала</FormLabel>
                <FormControl>
                  <Input v-model="componentField.modelValue" type="number" placeholder="" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField, handleChange }" name="yearEnd">
              <FormItem>
                <FormLabel>Год конца</FormLabel>
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
          <TableHead>Группа</TableHead>
          <TableHead>Категория</TableHead>
          <TableHead>Проект</TableHead>
          <TableHead>Загрузить</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="p in projects" :key="p.id">
          <TableCell>{{ p.category.theme.title }}</TableCell>
          <TableCell>{{ p.category.title }}</TableCell>
          <TableCell>{{ p.title }}</TableCell>
          <TableCell>
            <Input
              type="file" multiple accept=".avif, .webp, .jpg, .jpeg, .png"
              @input="uploadFile($event, { id: p.id, urlFriendly: p.urlFriendly })"
            />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </main>
</template>
