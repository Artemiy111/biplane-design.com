<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import type { GroupDto, ImageDto } from '~/server/use-cases/types'
import { Form } from '~/components/ui/form'

const props = defineProps<{
  groups: GroupDto[]
}>()

const emit = defineEmits<{
  submit: [values: FormSchema, prev: FormSchema | null ]
}>()
export type Mode = 'create' | 'update'
const mode = ref<Mode>('create')

const initialValues = ref<FormSchema>({
  title: '',
  uri: '',
  groupId: props.groups?.[0].id,
  categoryId: props.groups?.[0].categories[0].id,
  status: '',
  yearStart: null,
  yearEnd: null,
  location: '',
  images: [],
})

const MIN_YEAR = 2000
const MAX_YEAR = 2050

const formSchema = z.object({
  id: z.number().optional(),
  title: z.string().trim().min(3, 'Минимум 3 символа'),
  categoryId: z.union([z.string(), z.number()]).transform(v => Number(v)),
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
    }, 'Не валидный URL'),
  status: z.string().trim().min(3, 'Минимум 3 символа'),
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
  images: z.array(z.string()),
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

const prev = ref<FormSchema | null>(null)

async function open(initial?: FormSchema) {
  isOpen.value = true
  mode.value = 'update'

  if (initial) {
    await nextTick()
    formRef.value?.setValues(initial, false)
  }
  else {
    await nextTick()
    formRef.value?.resetForm()
    mode.value = 'create'
  }
  prev.value = initial || null
}

function close() {
  isOpen.value = false
  prev.value = null
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
      :side="mode === 'create' ? 'left' : 'right'"
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
        v-slot="{ setFieldValue, values }"
        :initial-values="initialValues"
        :validation-schema="validationSchema"
        class="grid gap-4"
        @submit="emit('submit', $event as FormSchema, prev)"
      >
        {{ values }}
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
            <FormLabel>Человекопонятная ссылка *</FormLabel>
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
          v-slot="{ componentField, handleChange, handleBlur }"
          name="status"
        >
          <FormItem>
            <FormLabel>Статус *</FormLabel>
            <FormControl>
              <Input
                :model-value="componentField.modelValue"
                placeholder="Завершён"
                @change="handleChange"
                @blur="handleBlur"
              />
            </FormControl>
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
          v-if="values.images.length"
          v-slot="{ field, handleChange, handleBlur }"
          name="previewId"
        >
          <FormItem>
            <FormLabel>Превью</FormLabel>
            <FormControl>
              <Select
                :model-value="String(field.value)"
                @update:model-value="(v) => {
                  handleChange(Number(v))
                  handleBlur()
                }"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите превью" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="image in (values.images as ImageDto[])"
                    :key="image.filename"
                    :value="image.id.toString()"
                  >
                    {{ image.filename }}
                  </SelectItem>
                </SelectContent>
              </Select>
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
