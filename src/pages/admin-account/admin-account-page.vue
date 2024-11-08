<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'

import { changePasswordSchema } from '~~/src/shared/config/validation/validation'
import { useAuthenticatedUser, useUserModel } from '~~/src/shared/model/user'
import { Button } from '~~/src/shared/ui/kit/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '~~/src/shared/ui/kit/dialog'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '~~/src/shared/ui/kit/form'
import { Input } from '~~/src/shared/ui/kit/input'

const title = 'Аккаунт администратора'
const description = 'Настройки аккаунта администратора'
useServerSeoMeta({ title, ogTitle: title, description, ogDescription: description })
useSeoMeta({ title, ogTitle: title, description, ogDescription: description })

const userModel = useUserModel()
const user = useAuthenticatedUser()

const isDialogOpen = ref(false)

const { meta, handleSubmit, defineField, resetForm } = useForm({
  validationSchema: toTypedSchema(changePasswordSchema),
})

const toastMessages = {
  success: 'Пароль изменён',
  error: 'Не удaлось сменить пароль',
}

const onSubmit = handleSubmit(async (values) => {
  try {
    await userModel.changePassword(values)
    toast.success(toastMessages.success)
    resetForm()
    isDialogOpen.value = false
  }
  catch (_e) {
    toast.error(toastMessages.error)
  }
})
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
          <form
            class="flex flex-col gap-4"
            @submit.prevent="onSubmit"
          >
            <FormField
              v-slot="{ componentField }"
              name="currentPassword"
            >
              <FormItem>
                <FormLabel>Текущий пароль</FormLabel>
                <FormControl>
                  <Input
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              v-slot="{ componentField }"
              name="newPassword"
            >
              <FormItem>
                <FormLabel>Новый пароль</FormLabel>
                <FormControl>
                  <Input
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              v-slot="{ componentField }"
              name="repeatNewPassword"
            >
              <FormItem>
                <FormLabel>Повторите пароль</FormLabel>
                <FormControl>
                  <Input
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <Button :disabled="!meta.valid">
              Сменить пароль
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  </main>
</template>
