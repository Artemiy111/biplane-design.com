import { useUserQuery } from '~~/src/shared/model/queries'

export default defineNuxtRouteMiddleware(async () => {
  const { data: user, refetch } = useUserQuery()
  if (!user.value) {
    await refetch()
    if (!user.value)
      return await navigateTo('/admin/auth')
  }
})
