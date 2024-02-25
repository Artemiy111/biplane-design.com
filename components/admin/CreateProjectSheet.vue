<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { type GroupRec, projectInsertSchema } from '~/server/db/schema'

// import { type ProjectCreateSchema, projectCreateSchema } from '~/server/validators'
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
  groupId: props.groups?.[0].id.toString() as unknown as number,
  categoryId: props.groups?.[0].categories[0].id.toString() as unknown as number,
  status: '',
  yearStart: null,
  yearEnd: null,
  location: '',
})

const formSchema = projectInsertSchema.merge(z.object({
  groupId: z.union([z.string(), z.number()]).transform(v => Number(v)),
}))

export type FormSchema = z.infer<typeof formSchema>

const validationSchema = toTypedSchema(formSchema)
const selectedGroupId = ref<string | null>(props.groups[0].id.toString() || null)
const selectedGroup = computed<NonNullable<typeof props.groups>[number] | null>(
  () => props.groups.find(g => g.id.toString() === selectedGroupId.value) || null,
)

const formRef = ref<InstanceType<typeof Form> | null>(null)
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

async function open(initial?: FormSchema) {
  isOpen.value = true
  mode.value = 'update'
  if (initial) {
    await nextTick()
    console.log(initial)
    initial.groupId = initial.groupId.toString()
    initial.categoryId = initial.categoryId.toString()
    formRef.value?.setValues(initial, false)
    console.log(formRef.value)
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
        v-slot="{ setFieldValue }"
        :initial-values="initialValues"
        :validation-schema="validationSchema"
        class="grid gap-4"
        @submit="emit('submit', $event as FormSchema, prev)"
      >
        <FormField v-slot="{ componentField, handleChange }" name="title">
          <FormItem>
            <FormLabel>Название проекта *</FormLabel>
            <FormControl>
              <Input :model-value="componentField.modelValue" placeholder="Мой новый дом" @change="handleChange" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField } " name="groupId">
          <FormItem>
            <FormLabel>Группа *</FormLabel>
            <Select
              v-bind="componentField" @update:model-value="(v) => {
                selectedGroupId = v
                setFieldValue('categoryId', selectedGroup?.categories[0]?.id.toString(), false)
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
        <FormField v-slot="{ componentField }" name="categoryId">
          <FormItem>
            <FormLabel>Категория *</FormLabel>
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
        <SheetFooter>
          <Button type="submit">
            {{ mode === 'create' ? 'Создать' : "Сохранить изменения" }}
          </Button>
        </SheetFooter>
      </Form>
    </SheetContent>
  </Sheet>
</template>
