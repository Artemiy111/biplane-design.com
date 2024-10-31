<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { toast } from 'vue-sonner'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '~~/src/shared/ui/kit/form' 
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~~/src/shared/ui/kit/tabs'
import { loginSchema, registerSchema } from '~~/src/shared/config/validation'
import { useForm } from 'vee-validate'
import { Button } from '~~/src/shared/ui/kit/button'
import {Input} from '~~/src/shared/ui/kit/input'
import { useUserModel } from '~~/src/shared/model/user'


const title = 'Вход/Регистрация'
const description = 'Вход для администратора'
useServerSeoMeta({ title, ogTitle: title, description, ogDescription: description })
useSeoMeta({ title, ogTitle: title, description, ogDescription: description })

const userModel = useUserModel()

const { meta: loginMeta,handleSubmit: handleLoginSubmit, defineField, resetForm: resetLoginForm} = useForm({
  validationSchema: toTypedSchema(loginSchema)
})

const [loginUsername, loginUsernameAttrs] = defineField('username')
const [loginPassword, loginPasswordAttrs] = defineField('password')

const toastMessages = {
  login: {
    success: 'Вход выполнен',
    error: 'Не удалось войти в аккаунт',
  },
  register: {
    success: 'Аккаунт успешно создан',
    error: 'Не удалось создать аккаунт',
  }
}

const onLoginSubmit = handleLoginSubmit(async (values) => {
  try {
    await userModel.login(values)
    resetLoginForm()
    toast.success(toastMessages.login.success)
    await navigateTo('/admin')
  }
  catch (_e) {
    toast.error(toastMessages.login.error)
  }
})

const {meta: registerMeta, handleSubmit: handleRegisterSubmit, defineField: defineRegisterField, resetForm: resetRegisterForm} = useForm({
  validationSchema: toTypedSchema(registerSchema),
})

const onRegisterSubmit = handleRegisterSubmit(async (values) => {
  try {
    await userModel.register(values)
    // await $fetch('/api/auth/register', { method: 'post', body: values })
    resetRegisterForm()
    toast.success(toastMessages.register.success)
    // await refreshNuxtData('user')
    await navigateTo('/admin')
  }
  catch (_e) {
    toast.error(toastMessages.register.error)
  }
})

const [registerUsername, registerUsernameAttrs] = defineRegisterField('username')
const [registerPassword, registerPasswordAttrs] = defineRegisterField('password')
const [registerRepeatPassword, registerRepeatPasswordAttrs] = defineRegisterField('repeatPassword')
</script>

<template>
  <main class="container flex flex-col items-center justify-center px-8 py-4 sm:px-4">
    <Tabs
      class="w-full max-w-[600px]"
      default-value="register"
    >
      <TabsList class="grid w-full grid-cols-2">
        <TabsTrigger value="register">
          Регистрация
        </TabsTrigger>
        <TabsTrigger value="login">
          Вход
        </TabsTrigger>
      </TabsList>
      <TabsContent value="register">
        <form
          class="flex flex-col gap-4"
          @submit="onRegisterSubmit"
        >
          <FormField
            name="username"
          >
            <FormItem>
              <FormLabel>Имя администратора</FormLabel>
              <FormControl>
                <Input
                  v-model="registerUsername"
                  v-bind="registerUsernameAttrs"
                  placeholder="admin"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField
            name="password"
          >
            <FormItem>
              <FormLabel>Пароль</FormLabel>
              <FormControl>
                <Input
                  v-model="registerPassword"
                  v-bind="registerPasswordAttrs"
                  type="password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField
            name="repeatPassword"
          >
            <FormItem>
              <FormLabel>Повторите пароль</FormLabel>
              <FormControl>
                <Input
                  v-model="registerRepeatPassword"
                  v-bind="registerRepeatPasswordAttrs"
                  type="password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <Button
            class="w-max"
            :disabled="!registerMeta.valid"
          >
            Зарегистрироваться
          </Button>
        </form>
      </TabsContent>

      <TabsContent value="login">
        <form
        class="flex flex-col gap-4"
        @submit.prevent="onLoginSubmit"
        >
          <FormField
            name="username"
          >
            <FormItem>
              <FormLabel>Имя администратора</FormLabel>
              <FormControl  >
                <Input
                  v-model="loginUsername"
                  v-bind="loginUsernameAttrs"
                  placeholder="admin"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField
            name="password"
          >
            <FormItem>
              <FormLabel>Пароль</FormLabel>
              <FormControl>
                <Input
                  v-model="loginPassword"
                  v-bind="loginPasswordAttrs"
                  type="password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <Button type="submit" class="w-max" :disabled="!loginMeta.valid">
            Войти
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  </main>
</template>
