<script setup lang="ts">
import * as z from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { toast } from 'vue-sonner'
import { Form } from '~/components/ui/form'
import { Dialog } from '~/components/ui/dialog'

definePageMeta({
  middleware: 'authenticated',
})
useServerSeoMeta({
  title: 'Аккаунт администратора',
  ogTitle: 'Аккаунт администратора',
  description: 'Настройки аккаунта администратора',
  ogDescription: 'Настройки аккаунта администратора',
})
useSeoMeta({
  title: 'Аккаунт администратора',
  ogTitle: 'Аккаунт администратора',
  description: 'Настройки аккаунта администратора',
  ogDescription: 'Настройки аккаунта администратора',
})

const user = useAuthenticatedUser()

const changePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
  repeatNewPassword: z.string().min(6),
}).refine(data => data.newPassword === data.repeatNewPassword, {
  message: 'Пароли не совпадают',
  path: ['repeatNewPassword'],
})

const initialValues: ChangePasswordSchema = {
  currentPassword: '',
  newPassword: '',
  repeatNewPassword: '',
}
type ChangePasswordSchema = z.infer<typeof changePasswordSchema>

const formRef = ref<InstanceType<typeof Form> | null>(null)
const isDialogOpen = ref(false)

const formValidationSchema = toTypedSchema(changePasswordSchema)

async function changePassword(data: ChangePasswordSchema) {
  try {
    await $fetch('/api/user/change-password', {
      method: 'post',
      body: {
        newPassword: data.newPassword,
      } })
    toast.success('Пароль изменён')
    isDialogOpen.value = false
  }
  catch (_e) {
    toast.error('Не удaлось сменить пароль')
  }
}
</script>

<template>
  <main class="container flex flex-col gap-4 px-8 py-8 sm:px-4 sm:py-4">
    <h1 class="text-xl lg:text-lg md:text-base font-semibold">
      Аккаунт
    </h1>
    <div
      v-if="user"
      class="grid grid-cols-[max-content,1fr] gap-4"
    >
      <span>Имя администратора</span>
      <span>{{ user.username }}</span>
      <Dialog
        :open="isDialogOpen"
        @update:open="isDialogOpen = $event"
      >
        <DialogTrigger :as-child="true">
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
            class="flex flex-col gap-4"
            :initial-values="initialValues"
            :validation-schema="formValidationSchema"
            @submit="changePassword($event as ChangePasswordSchema)"
          >
            <FormField
              v-slot="{ field }"
              name="currentPassword"
            >
              <FormItem>
                <FormLabel>Текущий пароль</FormLabel>
                <FormControl>
                  <Input
                    :model-value="field.value"
                    @change="field.onChange"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              v-slot="{ field }"
              name="newPassword"
            >
              <FormItem>
                <FormLabel>Новый пароль</FormLabel>
                <FormControl>
                  <Input
                    :model-value="field.value"
                    @change="field.onChange"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              v-slot="{ field }"
              name="repeatNewPassword"
            >
              <FormItem>
                <FormLabel>Повторите пароль</FormLabel>
                <FormControl>
                  <Input
                    :model-value="field.value"
                    @change="field.onChange"
                  />
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
