<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { Select, SelectContent, SelectItem } from '../ui/select'
import { Checkbox } from '../ui/checkbox'
import type { CreateProjectDto, GroupDto, UpdateProjectDto } from '~/server/use-cases/types'
import { Form } from '~/components/ui/form'
import type { CategoryId, GroupId, ProjectId } from '~/server/db/schema'

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
  location: '',
  id: -1,
  order: -1,
  isMinimal: false,
})

const MIN_YEAR = 2000
const MAX_YEAR = 2050

const formSchema = z.object({
  categoryId: z.union([z.string(), z.number()]).transform(v => Number(v)),
  id: z.number(),
  title: z.string().trim().min(3, 'Минимум 3 символа'),
  uri: z
    .string()
    .trim()
    .min(3, 'Минимум 3 символа')
    .refine((s) => {
      const url = `https://g.com/${s}`
      try {
        z.string().url().parse(url)
        return true
      }
      catch (e) {
        return false
      }
    }, 'Не валидный Uri'),
  status: z.enum(['строится', 'завершён', 'в разработке']),
  yearStart: z
    .number()
    .min(MIN_YEAR, `Год начала не может быть меньше ${MIN_YEAR}`)
    .max(MAX_YEAR, `Год начала не может быть больше ${MAX_YEAR}`)
    .nullable(),
  yearEnd: z
    .number()
    .min(MIN_YEAR, `Год завершения не может быть меньше ${MIN_YEAR}`)
    .max(MAX_YEAR, `Год завершения не может быть больше ${MAX_YEAR}`)
    .nullable(),
  location: z.string().trim().min(3, 'Минимум 3 символа'),
  groupId: z.union([z.string(), z.number()]).transform(v => Number(v)),
  order: z.number(),
  isMinimal: z.boolean().optional().default(false),
})

export type FormSchema = z.infer<typeof formSchema>

const validationSchema = toTypedSchema(formSchema)
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
      side="left"
      class="w-full max-w-3xl overflow-auto"
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
        :initial-values="initialValues"
        :validation-schema="validationSchema"
        class="grid gap-4"
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
                @change="handleChange"
                @blur="handleBlur"
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
                @change="handleChange(toUri($event.target.value))"
                @blur="handleBlur"
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
                type="number"
                placeholder=""
                @change="handleChange"
                @blur="handleBlur"
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
                type="number"
                placeholder=""
                @change="handleChange"
                @blur="handleBlur"
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
            <FormLabel>Расположение *</FormLabel>
            <FormControl>
              <Input
                :model-value="componentField.modelValue"
                placeholder="Уфа"
                @change="handleChange"
                @blur="handleBlur"
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
