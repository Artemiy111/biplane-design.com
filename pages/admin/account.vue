<script setup lang="ts">
import * as  z from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { toast } from 'vue-sonner'
import { Form } from '~/components/ui/form'
import { Dialog } from '~/components/ui/dialog'

definePageMeta({
  middleware: 'auth',
})

useSeoMeta({
  title: 'Аккаунт администратора',
  ogTitle: 'Аккаунт администратора',
  description: 'Настройки аккаунта администратора',
  ogDescription: 'Настройки аккаунта администратора',
})

const user = useSupabaseUser()
const supabase = useSupabaseClient()

const changePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
  repeatPassword: z.string().min(6)
}).refine(data => data.newPassword === data.repeatPassword, {
  message: 'Пароли не совпадают',
  path: ['repeatPassword']
})

const initialValues: ChangePasswordSchema = {
  currentPassword: '',
  newPassword: '',
  repeatPassword: '',
}
type ChangePasswordSchema = z.infer<typeof changePasswordSchema>

const formRef = ref<InstanceType<typeof Form> | null>(null)
const isDialogOpen = ref(false)

const formValidationSchema = toTypedSchema(changePasswordSchema)

async function changePassword(values: ChangePasswordSchema) {
  if (!user.value)
    return
  const isCurrentPassword = await supabase.auth.signInWithPassword({
    email: user.value.email as string,
    password: values.currentPassword,
  })
  if (isCurrentPassword.error) {
    formRef.value?.setFieldError('currentPassword', 'Неверный пароль')
    return
  }
  const res = await supabase.auth.updateUser({ password: values.newPassword })
  if (res.error) { toast.error('Не удaлось сменить пароль', { description: res.error.message }) }
  else {
    toast.success('Пароль cменён')
    isDialogOpen.value = false
  }
}
</script>

<template>
  <main class="container flex flex-col gap-4 px-8 py-4 sm:px-4 sm:py-2">
    <h1 class="text-2xl font-bold">
      Аккаунт
    </h1>
    <div v-if="user" class="grid grid-cols-[max-content,1fr] gap-4">
      <span>Email</span>
      <span>{{ user.email }}</span>
      <Dialog :open="isDialogOpen" @update:open="isDialogOpen = $event">
        <DialogTrigger as-child>
          <Button variant="outline">
            Сменить пароль
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Сменить пароль</DialogTitle>
            <DialogDescription>Заполните поля</DialogDescription>
          </DialogHeader>
          <Form
            ref="formRef"
            :validation-schema="formValidationSchema"
            :initial-values="initialValues"
            class="flex flex-col gap-4"
            @submit="changePassword($event as ChangePasswordSchema)"
          >
            <FormField v-slot="{ field }" name="currentPassword">
              <FormItem>
                <FormLabel>Текущий пароль</FormLabel>
                <FormControl>
                  <Input :model-value="field.value" @change="field.onChange" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ field }" name="newPassword">
              <FormItem>
                <FormLabel>Новый пароль</FormLabel>
                <FormControl>
                  <Input :model-value="field.value" @change="field.onChange" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ field }" name="repeatPassword">
              <FormItem>
                <FormLabel>Повторите пароль</FormLabel>
                <FormControl>
                  <Input :model-value="field.value" @change="field.onChange" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <Button>Сменить пароль</Button>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  </main>
</template>
