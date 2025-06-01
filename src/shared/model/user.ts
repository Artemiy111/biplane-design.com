import { useApi } from '../api'
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

export const useCookieAllowed = () => {
  const allowedString = useCookie<boolean | string | null>('cookie-allowed')
  const allowCookie = async () => {
    try {
      await useApi().user.allowCookie.mutate()
    } catch (_) {
      allowedString.value = 'true'
    }
  }

  const cookieAllowed = computed(() => allowedString.value === 'true' || allowedString.value === true)
  return { cookieAllowed, allowCookie }
}