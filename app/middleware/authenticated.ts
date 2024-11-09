import { useUser } from '~~/src/shared/model/user'

export default defineNuxtRouteMiddleware(async () => {
  const user = useUser()
  if (!user.value) return await navigateTo('/admin/auth')
})
