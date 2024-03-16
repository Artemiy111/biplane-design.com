<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { type GroupRec, type Image, projectInsertSchema } from '~/server/db/schema'
import Dropzone from '~/components/Dropzone.vue'
import { Form } from '~/components/ui/form'

const props = defineProps<{
  groups: GroupRec[]
}>()

const emit = defineEmits<{
  submit: [values: FormSchema, prev: FormSchema | null ]
}>()
export type Mode = 'create' | 'update'
const mode = ref<Mode>('create')

const initialValues = ref<FormSchema>({
  title: '',
  urlFriendly: '',
  groupId: props.groups?.[0].id,
  categoryId: props.groups?.[0].categories[0].id,
  status: '',
  yearStart: null,
  yearEnd: null,
  location: '',
  previewId: null,
  images: [],
})

const formSchema = projectInsertSchema.merge(z.object({
  groupId: z.union([z.string(), z.number()]).transform(v => Number(v)),
  images: z.array(z.string()),
}))

export type FormSchema = z.infer<typeof formSchema>

const validationSchema = toTypedSchema(formSchema)
const formRef = ref<InstanceType<typeof Form> | null>(null)
const selectedGroup = computed<NonNullable<typeof props.groups>[number] | null>(
  () => props.groups.find(g => g.id === formRef.value?.values.groupId as number) || null,
)

const title = computed(() => formRef.value?.values?.title as string || '')
const urlFriendly = computed(() => toUrlFriendly(title.value))

watch(title, () => {
  if (!formRef.value)
    return
  formRef.value.setFieldValue('urlFriendly', urlFriendly.value)
})

const isOpen = ref(false)
function handleCloseOnDirty(open: boolean) {
  if (formRef.value?.meta.dirty && !isOpen)
    return

  isOpen.value = open
}

const prev = ref<FormSchema | null>(null)

// type InitialValues = FormSchema & {images: Ima}

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
  <Sheet :open="isOpen" @update:open="isOpen = $event">
    <SheetContent
      :side="mode === 'create' ? 'left' : 'right'"
      class="w-full max-w-3xl overflow-auto"
      @pointer-down-outside="$event.preventDefault(), handleCloseOnDirty(false)"
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
        <FormField v-slot="{ field, handleChange }" name="title">
          <FormItem>
            <FormLabel>Название проекта *</FormLabel>
            <FormControl>
              <Input :model-value="field.value" placeholder="Мой новый дом" @change="handleChange" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ field } " name="groupId">
          <FormItem>
            <FormLabel>Группа *</FormLabel>
            <Select
              :model-value="String(field.value)" @update:model-value="(v) => {
                setFieldValue('groupId', props.groups.find(g => g.id === Number(v))!.id, false)
                setFieldValue('categoryId', selectedGroup?.categories[0].id, false)
              }"
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите группу" />
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
        <FormField v-slot="{ field }" name="categoryId">
          <FormItem>
            <FormLabel>Категория *</FormLabel>
            <Select
              :model-value="String(field.value)" @update:model-value="(v) => {
                setFieldValue('categoryId', Number(v))
              }"
            >
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
            <FormLabel>Человекопонятная ссылка *</FormLabel>
            <FormControl>
              <Input
                :model-value="componentField.modelValue" placeholder="my-new-house"
                @change="($event.target.value = toUrlFriendly($event.target.value)), handleChange($event, true)"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField, handleChange }" name="status">
          <FormItem>
            <FormLabel>Статус *</FormLabel>
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
            <FormLabel>Расположение *</FormLabel>
            <FormControl>
              <Input :model-value="componentField.modelValue" placeholder="Уфа" @change="handleChange" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-if="values.images.length" v-slot="{ field }" name="previewId">
          <FormItem>
            <FormLabel>Превью</FormLabel>
            <FormControl>
              <Select :model-value="String(field.value)" @update:model-value="(v) => setFieldValue(field.name, Number(v))">
                <SelectTrigger>
                  <SelectValue placeholder="Выберите превью" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="image in (values.images as Image[])" :key="image.filename" :value="image.id.toString()">
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
