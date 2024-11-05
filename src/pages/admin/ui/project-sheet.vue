<script setup lang="ts">
import type { z } from 'zod'

import { toTypedSchema } from '@vee-validate/zod'

import type { CategoryId, GroupId, ProjectId } from '~~/server/db/schema'
import type { CreateProjectDto, GroupDto, UpdateProjectDto } from '~~/server/use-cases/types'

import { toUri } from '~~/src/shared/lib/utils/to-uri'
import { Button } from '~~/src/shared/ui/kit/button'
import { Checkbox } from '~~/src/shared/ui/kit/checkbox'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~~/src/shared/ui/kit/form'
import { Input } from '~~/src/shared/ui/kit/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '~~/src/shared/ui/kit/select'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '~~/src/shared/ui/kit/sheet'

import { schema } from './config'

const props = defineProps<{
  groups: GroupDto[]
}>()

const emit = defineEmits<{
  create: [dto: CreateProjectDto]
  update: [id: ProjectId, dto: UpdateProjectDto]
}>()
export type SheetMode = 'create' | 'update'
const mode = ref<SheetMode>('create')

const initialValues = ref<FormSchema>({
  title: '',
  uri: '',
  groupId: props.groups?.[0].id,
  categoryId: props.groups?.[0].categories[0].id,
  status: 'завершён',
  yearStart: null,
  yearEnd: null,
  location: null,
  id: -1,
  order: -1,
  isMinimal: false,
})

export type FormSchema = z.infer<typeof schema>

const validationSchema = toTypedSchema(schema)
const formRef = ref<InstanceType<typeof Form> | null>(null)
const selectedGroup = computed<NonNullable<typeof props.groups>[number] | null>(
  () => props.groups.find(g => g.id === formRef.value?.values.groupId as number) || null,
)

const title = computed(() => formRef.value?.values?.title as string || '')
const uri = computed(() => toUri(title.value))

watch(title, () => {
  if (!formRef.value)
    return
  formRef.value.setFieldValue('uri', uri.value)
})

const isOpen = ref(false)
function handleClose() {
  if (formRef.value?.meta.dirty && formRef.value.meta.touched && isOpen.value)
    return

  isOpen.value = false
}

async function open(data:
  { mode: 'create'
    initial?: {
      groupId: GroupId
      categoryId: CategoryId }
  }
  |
  { mode: 'update', initial: FormSchema }) {
  isOpen.value = true

  if (data.mode === 'update') {
    mode.value = 'update'
    await nextTick()
    formRef.value?.setValues(data.initial, false)
  }
  else {
    mode.value = 'create'
    await nextTick()
    formRef.value?.resetForm()
    if (data.initial) formRef.value?.setValues(data.initial, false)
  }
}

function close() {
  isOpen.value = false
}

function submit(values: FormSchema) {
  switch (mode.value) {
    case 'create': {
      const createDto: CreateProjectDto = values
      emit('create', createDto)
      break
    }
    case 'update': {
      const updateDto: UpdateProjectDto = values
      emit('update', values.id, updateDto)
      break
    }
  }
}

defineExpose({
  open,
  close,
})
</script>

<template>
  <Sheet
    :open="isOpen"
    @update:open="isOpen = $event"
  >
    <SheetContent
      class="w-full max-w-3xl overflow-auto"
      side="left"
      @pointer-down-outside="$event.preventDefault(), handleClose()"
    >
      <SheetHeader>
        <SheetTitle>{{ mode === 'create' ? 'Создать' : 'Изменить' }} проект</SheetTitle>
        <SheetDescription>
          Заполните поля
        </SheetDescription>
      </SheetHeader>
      <Form
        ref="formRef"
        v-slot="{ setFieldValue }"
        class="grid gap-4"
        :initial-values="initialValues"
        :validation-schema="validationSchema"
        @submit="submit($event as FormSchema)"
      >
        <FormField
          v-slot="{ field, handleChange, handleBlur }"
          name="title"
        >
          <FormItem>
            <FormLabel>Название проекта *</FormLabel>
            <FormControl>
              <Input
                :model-value="field.value"
                placeholder="Мой новый дом"
                @blur="handleBlur"
                @change="handleChange"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField
          v-slot="{ field, handleChange, handleBlur } "
          name="groupId"
        >
          <FormItem>
            <FormLabel>Группа *</FormLabel>
            <Select
              :model-value="String(field.value)"
              @update:model-value="(v) => {
                handleChange(props.groups.find(g => g.id === Number(v))!.id)
                setFieldValue('categoryId', selectedGroup?.categories[0].id)
                handleBlur()
              }"
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите группу" />
                </SelectTrigger>
              </FormControl>
              <SelectContent v-if="groups?.length">
                <SelectGroup>
                  <SelectItem
                    v-for="group in groups"
                    :key="group.id"
                    :value="group.id.toString()"
                  >
                    {{ group.title }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </FormItem>
        </FormField>
        <FormField
          v-slot="{ field, handleChange, handleBlur }"
          name="categoryId"
        >
          <FormItem>
            <FormLabel>Категория *</FormLabel>
            <Select
              :model-value="String(field.value)"
              @update:model-value="(v) => {
                handleChange(Number(v))
                handleBlur()
              }"
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
              </FormControl>
              <SelectContent v-if="selectedGroup?.categories.length">
                <SelectGroup>
                  <SelectItem
                    v-for="c in selectedGroup.categories"
                    :key="c.id"
                    :value="c.id.toString()"
                  >
                    {{ c.title }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </FormItem>
        </FormField>
        <FormField
          v-slot="{ componentField, handleChange, handleBlur }"
          name="uri"
        >
          <FormItem>
            <FormLabel>Uri *</FormLabel>
            <FormControl>
              <Input
                :model-value="componentField.modelValue"
                placeholder="my-new-house"
                @blur="handleBlur"
                @change="handleChange(toUri($event.target.value))"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField
          v-slot="{ field, handleChange, handleBlur }"
          name="status"
        >
          <FormItem>
            <FormLabel>Статус *</FormLabel>
            <Select
              :model-value="String(field.value)"
              @update:model-value="(v) => {
                handleChange(v)
                handleBlur()
              }"
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите статус" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem
                  value="завершён"
                >
                  завершён
                </SelectItem>
                <SelectItem
                  value="строится"
                >
                  строится
                </SelectItem>
                <SelectItem
                  value="в разработке"
                >
                  в разработке
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField
          v-slot="{ componentField, handleChange, handleBlur }"
          name="yearStart"
        >
          <FormItem>
            <FormLabel>Год начала</FormLabel>
            <FormControl>
              <Input
                :model-value="componentField.modelValue"
                placeholder=""
                type="number"
                @blur="handleBlur"
                @change="handleChange"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField
          v-slot="{ componentField, handleChange, handleBlur }"
          name="yearEnd"
        >
          <FormItem>
            <FormLabel>Год завершения</FormLabel>
            <FormControl>
              <Input
                :model-value="componentField.modelValue"
                placeholder=""
                type="number"
                @blur="handleBlur"
                @change="handleChange"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField
          v-slot="{ componentField, handleChange, handleBlur }"
          name="location"
        >
          <FormItem>
            <FormLabel>Расположение</FormLabel>
            <FormControl>
              <Input
                :model-value="componentField.modelValue"
                placeholder="Уфа"
                @blur="handleBlur"
                @change="handleChange($event.target.value.trim() || null)"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField
          v-slot="{ value, handleChange }"
          name="isMinimal"
        >
          <FormItem class="flex gap-4 items-center space-y-0">
            <FormLabel>Минималистичный</FormLabel>
            <FormControl class="m-0">
              <Checkbox
                :checked="value"
                @update:checked="handleChange"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <SheetFooter>
          <Button type="submit">
            {{ mode === 'create' ? 'Создать' : "Сохранить изменения" }}
          </Button>
        </SheetFooter>
      </Form>
    </SheetContent>
  </Sheet>
</template>
