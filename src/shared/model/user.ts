import { useUserQuery } from './queries'

export const useAuthenticatedUser = () => {
  const { data: user } = useUserQuery()
  return computed(() => {
    if (!user.value) {
      throw createError('useAuthenticatedUser() can only be used in protected pages')
    }
    return user.value
  })
}
