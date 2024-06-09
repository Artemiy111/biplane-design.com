<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { toast } from 'vue-sonner'
import { Form } from '~/components/ui/form'

useSeoMeta({
  title: 'Вход/Регистрация',
  ogTitle: 'Вход/Регистрация',
  description: 'Вход для администратора',
  ogDescription: 'Вход для администратора',
})

const loginFormRef = ref<InstanceType<typeof Form> | null>(null)
const registerFormRef = ref<InstanceType<typeof Form> | null>(null)

const loginFormSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6, 'Пароль должен содержать не менее 6 символов'),
})
type LoginForm = z.infer<typeof loginFormSchema>
const loginValidationSchema = toTypedSchema(loginFormSchema)

const registerFormSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6, 'Пароль должен содержать не менее 6 символов'),
  repeatPassword: z.string().min(6),
}).refine(data => data.repeatPassword === data.password, {
  message: 'Пароли не совпадают',
  path: ['repeatPassword'],
})
type RegisterForm = z.infer<typeof registerFormSchema>
const registerValidationSchema = toTypedSchema(registerFormSchema)

async function register(data: RegisterForm) {
  try {
    await $fetch('/api/auth/register', { method: 'post', body: data })
    loginFormRef.value?.resetForm()
    toast.success('Аккаунт успешно создан')
    await navigateTo('/admin')
  }
  catch (_e) {
    toast.error('Не удалось создать аккаунт')
  }
}

async function login(data: LoginForm) {
  try {
    await $fetch('/api/auth/login', { method: 'post', body: data })
    loginFormRef.value?.resetForm()
    toast.success('Вход выполнен')
    await navigateTo('/admin')
  }
  catch (_e) {
    toast.error('Не удалось войти в аккаунт')
  }
}
</script>

<template>
  <main class="container flex flex-col items-center justify-center px-8 py-4 sm:px-4">
    <Tabs
      default-value="register"
      class="w-full max-w-[600px]"
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
        <Form
          ref="registerFormRef"
          class="flex flex-col gap-4"
          :validation-schema="registerValidationSchema"
          @submit="register($event as RegisterForm)"
        >
          <FormField
            v-slot="{ field, handleChange }"
            name="username"
          >
            <FormItem>
              <FormLabel>Имя администратора</FormLabel>
              <FormControl>
                <Input
                  :model-value="field.value"
                  placeholder="admin"
                  @change="handleChange"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField
            v-slot="{ field }"
            name="password"
          >
            <FormItem>
              <FormLabel>Пароль</FormLabel>
              <FormControl>
                <Input
                  :model-value="field.value"
                  type="password"
                  @change="field.onChange"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField
            v-slot="{ field }"
            name="repeatPassword"
          >
            <FormItem>
              <FormLabel>Повторите пароль</FormLabel>
              <FormControl>
                <Input
                  :model-value="field.value"
                  type="password"
                  @change="field.onChange"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <Button
            class="w-max"
          >
            Зарегистрироваться
          </Button>
        </Form>
      </TabsContent>
      <TabsContent value="login">
        <Form
          ref="loginFormRef"
          class="flex flex-col gap-4"
          :validation-schema="loginValidationSchema"
          @submit="login($event as LoginForm)"
        >
          <FormField
            v-slot="{ field }"
            name="username"
          >
            <FormItem>
              <FormLabel>Имя администратора</FormLabel>
              <FormControl>
                <Input
                  :model-value="field.value"
                  placeholder="admin"
                  @change="field.onChange"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField
            v-slot="{ field }"
            name="password"
          >
            <FormItem>
              <FormLabel>Пароль</FormLabel>
              <FormControl>
                <Input
                  :model-value="field.value"
                  type="password"
                  @change="field.onChange"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <Button class="w-max">
            Войти
          </Button>
        </Form>
      </TabsContent>
    </Tabs>
  </main>
</template>
