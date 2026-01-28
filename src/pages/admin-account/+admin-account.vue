<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'

import { authSchemas } from '~~/src/shared/config/validation/'
import { useChangePasswordMutation } from '~~/src/shared/model/mutations'
import { useAuthenticatedUser } from '~~/src/shared/model/user'
import { Button } from '~~/src/shared/ui/kit/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '~~/src/shared/ui/kit/dialog'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '~~/src/shared/ui/kit/form'
import { Input } from '~~/src/shared/ui/kit/input'

const title = 'Аккаунт администратора'
const description = 'Настройки аккаунта администратора'
useSeoMeta({ title, ogTitle: title, description, ogDescription: description })

const user = useAuthenticatedUser()

const isDialogOpen = ref(false)

const { meta, handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(authSchemas.changePasswordSchema),
})

const { changePassword } = useChangePasswordMutation()
const onSubmit = handleSubmit(async (values) => {
  await changePassword(values)
  resetForm()
  isDialogOpen.value = false
})
</script>

<template>
  <main class="container mt-8 flex flex-col gap-4">
    <h1 class="text-heading">
      Аккаунт
    </h1>
    <div
      v-if="user"
      class="grid grid-cols-[max-content_1fr] gap-4"
    >
      <span>Имя администратора</span>
      <span>{{ user.username }}</span>
      <Dialog v-model:open="isDialogOpen">
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
                  <Input v-bind="componentField" />
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
                  <Input v-bind="componentField" />
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
                  <Input v-bind="componentField" />
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
