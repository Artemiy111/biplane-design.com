import { useUser } from '~~/src/shared/model/queries'

export default defineNuxtRouteMiddleware(async () => {
  const { data: user, refetch } = useUser()
  if (!user.value) {
    await refetch()
    if (!user.value)
      return await navigateTo('/admin/auth')
  }
})
