<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import type { GroupRec } from '~/server/db/schema'
import { type ProjectCreateSchema, projectCreateSchema } from '~/server/validators'
import { Form } from '~/components/ui/form'

const props = defineProps<{
  groups: GroupRec[]
}>()

const emit = defineEmits<{
  submit: [values: ProjectCreateSchema]
}>()

const groups = toRef(props, 'groups')

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
const selectedGroupId = ref<string | null>(groups.value?.[0].id.toString() || null)
const selectedGroup = computed<NonNullable<typeof groups.value>[number] | null>(
  () => groups.value?.find(g => g.id.toString() === selectedGroupId.value) || null,
)

const formRef = ref<InstanceType<typeof Form> | null>(null)
const title = computed(() => formRef.value?.values?.title as string || '')
const urlFriendly = computed(() => toUrlFriendly(title.value))

watch(title, () => {
  if (!formRef.value)
    return
  formRef.value.setFieldValue('urlFriendly', urlFriendly.value)
})

const isSheetOpen = ref(false)
function handleSheetOpen(isOpen: boolean) {
  if (formRef.value?.meta.dirty && !isOpen)
    return

  isSheetOpen.value = isOpen
}

const close = () => isSheetOpen.value = false
defineExpose({
  close,
})
</script>

<template>
  <Sheet :open="isSheetOpen" @update:open="isSheetOpen = $event">
    <SheetTrigger as-child>
      <Button @click="isSheetOpen = true">
        Создать проект
      </Button>
    </SheetTrigger>
    <SheetContent
      side="left" class="overflow-auto w-full max-w-3xl"
      @pointer-down-outside="$event.preventDefault(), handleSheetOpen(false)"
    >
      <SheetHeader>
        <SheetTitle>Создать проект</SheetTitle>
        <SheetDescription>
          Заполните поля
        </SheetDescription>
      </SheetHeader>
      <Form
        ref="formRef"
        v-slot="{ setFieldValue }"
        :initial-values="createProjectFormInitialValues"
        :validation-schema="createProjectFormValidationSchema"
        class="grid gap-4"
        @submit="emit('submit', $event as ProjectCreateSchema)"
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
            <FormLabel>Расположение *</FormLabel>
            <FormControl>
              <Input :model-value="componentField.modelValue" placeholder="Уфа" @change="handleChange" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <SheetFooter>
          <Button type="submit">
            Создать
          </Button>
        </SheetFooter>
      </Form>
    </SheetContent>
  </Sheet>
</template>
