import { useUser } from '~~/src/shared/model/queries'

export default defineNuxtRouteMiddleware(async () => {
  const { data: user } = useUser()
  if (!user.value) return await navigateTo('/admin/auth')
})
