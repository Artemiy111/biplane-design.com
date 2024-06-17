export default defineNuxtRouteMiddleware(async () => {
  const user = useUser()
  console.log('auth', user.value)
  if (!user.value) return await navigateTo('/admin/auth')
})
