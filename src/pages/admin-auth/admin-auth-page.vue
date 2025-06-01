<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'

import { authSchemas } from '~~/src/shared/config/validation'
import { useLoginMutation, useRegisterMutation } from '~~/src/shared/model/mutations'
import { HeadingTabs } from '~~/src/shared/ui/blocks/heading-tabs'
import { Button } from '~~/src/shared/ui/kit/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '~~/src/shared/ui/kit/form'
import { Input } from '~~/src/shared/ui/kit/input'

const title = 'Вход/Регистрация'
const description = 'Вход для администратора'
useSeoMeta({ title, ogTitle: title, description, ogDescription: description })

const tabs = [{ title: 'Вход', value: 'login' }, { title: 'Регистрация', value: 'register' }]
const tab = ref(tabs[0]!.value)

const { meta: loginMeta, handleSubmit: handleLoginSubmit, defineField, resetForm: resetLoginForm } = useForm({
  validationSchema: toTypedSchema(authSchemas.loginSchema),
  initialValues: { username: 'admin' },
})

const [loginUsername, loginUsernameAttrs] = defineField('username')
const [loginPassword, loginPasswordAttrs] = defineField('password')

const { login } = useLoginMutation()
const onLoginSubmit = handleLoginSubmit(async (values) => {
  await login(values)
  resetLoginForm()
  navigateTo('/admin')
})

const { meta: registerMeta, handleSubmit: handleRegisterSubmit, defineField: defineRegisterField, resetForm: resetRegisterForm } = useForm({
  validationSchema: toTypedSchema(authSchemas.registerSchema),
})

const [registerUsername, registerUsernameAttrs] = defineRegisterField('username')
const [registerPassword, registerPasswordAttrs] = defineRegisterField('password')
const [registerRepeatPassword, registerRepeatPasswordAttrs] = defineRegisterField('repeatPassword')

const { register } = useRegisterMutation()
const onRegisterSubmit = handleRegisterSubmit(async (values) => {
  await register(values)
  resetRegisterForm()
  navigateTo('/admin')
})
</script>

<template>
  <main class="container flex max-w-md flex-col gap-y-6">
    <HeadingTabs
      v-model:tab="tab"
      :tabs="tabs"
    />
    <form
      v-if="tab === 'login'"
      class="flex flex-col gap-4"
      @submit.prevent="onLoginSubmit"
    >
      <FormField name="username">
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
      <FormField name="password">
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

    <form
      v-else
      class="flex flex-col gap-4"
      @submit="onRegisterSubmit"
    >
      <FormField name="username">
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
      <FormField name="password">
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
      <FormField name="repeatPassword">
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
  </main>
</template>
