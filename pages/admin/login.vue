<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { toast } from 'vue-sonner'
import { Form } from '~/components/ui/form'

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

useSeoMeta({
  title: 'Вход/Регистрация',
  ogTitle: 'Вход/Регистрация',
  description: 'Вход для администратора',
  ogDescription: 'Вход для администратора',
})

watch(user, () => {
  if (user.value)
    router.push('/admin')
}, { immediate: false })

const signUpFormRef = ref<InstanceType<typeof Form> | null>(null)
const singInFormRef = ref<InstanceType<typeof Form> | null>(null)

const signFormSchema = z.object({
  email: z.string().email('Не действительный email'),
  password: z.string().min(6, 'Пароль должен содержать не менее 6 символов'),
})
const signFormValidationSchema = toTypedSchema(signFormSchema)
type SignFormSchema = z.infer<typeof signFormSchema>

async function singUp(values: SignFormSchema) {
  const res = await supabase.auth.signUp({ email: values.email, password: values.password })
  if (!res.error) {
    toast.success('Аккаунт успешно создан')
    singInFormRef.value?.resetForm()
  }
  else { toast.error('Не удалось создать аккаунт') }
}

async function singIn(values: SignFormSchema) {
  const res = await supabase.auth.signInWithPassword({ email: values.email, password: values.password })
  if (!res.error)
    toast.success('Вход выполнен')
  else toast.error('Не удалось войти в аккаунт')
}
</script>

<template>
  <main class="container flex flex-col items-center justify-center px-8 py-4 sm:px-4">
    <Tabs default-value="sign-up" class="w-full max-w-[600px]">
      <TabsList class="grid w-full grid-cols-2">
        <TabsTrigger value="sign-up">
          Регистрация
        </TabsTrigger>
        <TabsTrigger value="sign-in">
          Вход
        </TabsTrigger>
      </TabsList>
      <TabsContent value="sign-up">
        <Form
          ref="signUpFormRef" class="flex flex-col gap-4"
          :validation-schema="signFormValidationSchema"
          @submit="singUp($event as SignFormSchema)"
        >
          <FormField v-slot="{ field, handleChange }" name="email">
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input :model-value="field.value" placeholder="biplane-design@mail.ru" @change="handleChange" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ field }" name="password">
            <FormItem>
              <FormLabel>Пароль</FormLabel>
              <FormControl>
                <Input :model-value="field.value" type="password" @change="field.onChange" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <Button class="w-max">
            Зарегистрироваться
          </Button>
        </Form>
      </TabsContent>
      <TabsContent value="sign-in">
        <Form
          ref="singInFormRef" class="flex flex-col gap-4"
          :validation-schema="signFormValidationSchema"
          @submit="singIn($event as SignFormSchema)"
        >
          <FormField v-slot="{ field }" name="email">
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input :model-value="field.value" placeholder="biplane-design@mail.ru" @change="field.onChange" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ field }" name="password">
            <FormItem>
              <FormLabel>Пароль</FormLabel>
              <FormControl>
                <Input :model-value="field.value" type="password" @change="field.onChange" />
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
