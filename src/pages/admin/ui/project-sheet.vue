<script setup lang="ts">
import type { z } from 'zod'

import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'

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

type FormSchema = z.infer<typeof schema>

const { values, meta, setFieldValue, setValues, resetForm, handleSubmit } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: {
    groupId: props.groups[0]?.id,
    categoryId: props.groups[0]?.categories[0]?.id,
  },
})

const selectedGroup = computed<NonNullable<typeof props.groups>[number] | null>(
  () => props.groups.find(g => g.id === values.groupId as number) || null,
)

const title = computed(() => values.title as string || '')
const uri = computed(() => toUri(title.value))

watch(title, () => {
  setFieldValue('uri', uri.value)
})

const isOpen = ref(false)
function handleClose() {
  if (meta.value.dirty && meta.value.touched && isOpen.value) return

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
    setValues(data.initial, false)
  }
  else {
    mode.value = 'create'
    await nextTick()
    resetForm()
    if (data.initial) setValues(data.initial, false)
  }
}

function close() {
  isOpen.value = false
}

const onSubmit = handleSubmit((values) => {
  if (mode.value === 'create') {
    const createDto: CreateProjectDto = values
    emit('create', createDto)
  }
  else {
    const updateDto: UpdateProjectDto = values
    emit('update', values.id, updateDto)
  }
})

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
      <form
        class="grid gap-4"
        @submit="onSubmit()"
      >
        <FormField
          v-slot="{ componentField }"
          name="title"
        >
          <FormItem>
            <FormLabel>Название проекта *</FormLabel>
            <FormControl>
              <Input
                placeholder="Мой новый дом"
                v-bind="componentField"
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
                setFieldValue('categoryId', selectedGroup?.categories[0]?.id)
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
          v-slot="{ componentField }"
          name="status"
        >
          <FormItem>
            <FormLabel>Статус *</FormLabel>
            <Select v-bind="componentField">
              ⌦ >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите статус" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="завершён">
                  завершён
                </SelectItem>
                <SelectItem value="строится">
                  строится
                </SelectItem>
                <SelectItem value="в разработке">
                  в разработке
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField
          v-slot="{ componentField }"
          name="yearStart"
        >
          <FormItem>
            <FormLabel>Год начала</FormLabel>
            <FormControl>
              <Input
                v-bind="componentField"
                placeholder=""
                type="number"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField
          v-slot="{ componentField }"
          name="yearEnd"
        >
          <FormItem>
            <FormLabel>Год завершения</FormLabel>
            <FormControl>
              <Input
                type="number"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField
          v-slot="{ componentField }"
          name="location"
        >
          <FormItem>
            <FormLabel>Расположение</FormLabel>
            <FormControl>
              <Input
                v-bind="componentField"
                placeholder="Уфа"
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
      </form>
    </SheetContent>
  </Sheet>
</template>
