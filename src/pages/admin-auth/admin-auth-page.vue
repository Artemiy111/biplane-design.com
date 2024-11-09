<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'

import type { LoginDto, RegisterDto } from '~~/src/shared/config/validation/auth'

import { useApi } from '~~/src/shared/api'
import { authSchemas } from '~~/src/shared/config/validation'
import { Button } from '~~/src/shared/ui/kit/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '~~/src/shared/ui/kit/form'
import { Input } from '~~/src/shared/ui/kit/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~~/src/shared/ui/kit/tabs'

const title = 'Вход/Регистрация'
const description = 'Вход для администратора'
useServerSeoMeta({ title, ogTitle: title, description, ogDescription: description })
useSeoMeta({ title, ogTitle: title, description, ogDescription: description })

const api = useApi()

const toastMessages = {
  login: {
    success: 'Вход выполнен',
    error: 'Не удалось войти в аккаунт',
  },
  register: {
    success: 'Аккаунт успешно создан',
    error: 'Не удалось создать аккаунт',
  },
}

const { meta: loginMeta, handleSubmit: handleLoginSubmit, defineField, resetForm: resetLoginForm } = useForm({
  validationSchema: toTypedSchema(authSchemas.loginSchema),
  initialValues: { username: 'admin' },
})

const [loginUsername, loginUsernameAttrs] = defineField('username')
const [loginPassword, loginPasswordAttrs] = defineField('password')

const onLoginSubmit = handleLoginSubmit(async (values) => {
  login(values)
})

const { mutate: login } = useMutation({
  mutation: (dto: LoginDto) => api.auth.login.mutate(dto),
  onSuccess: () => {
    resetLoginForm()
    toast.success(toastMessages.login.success)
    navigateTo('/admin')
  },
  onError: () => {
    toast.error(toastMessages.login.error)
  },
  onSettled: () => {
    useQueryCache().invalidateQueries({ key: ['user'] })
  },
})

const { meta: registerMeta, handleSubmit: handleRegisterSubmit, defineField: defineRegisterField, resetForm: resetRegisterForm } = useForm({
  validationSchema: toTypedSchema(authSchemas.registerSchema),
})

const [registerUsername, registerUsernameAttrs] = defineRegisterField('username')
const [registerPassword, registerPasswordAttrs] = defineRegisterField('password')
const [registerRepeatPassword, registerRepeatPasswordAttrs] = defineRegisterField('repeatPassword')

const onRegisterSubmit = handleRegisterSubmit(async (values) => {
  register(values)
})

const { mutate: register } = useMutation({
  mutation: (dto: RegisterDto) => api.auth.register.mutate(dto),
  onSuccess: () => {
    resetRegisterForm()
    toast.success(toastMessages.register.success)
    navigateTo('/admin')
  },
  onError: () => {
    toast.error(toastMessages.register.error)
  },
  onSettled: () => {
    useQueryCache().invalidateQueries({ key: ['user'] })
  },
})
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
              <FormControl>
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
          <Button
            class="w-max"
            :disabled="!loginMeta.valid"
            type="submit"
          >
            Войти
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  </main>
</template>
