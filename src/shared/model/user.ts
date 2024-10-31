import type { UserDto } from '~~/server/use-cases/types'
import type { ChangePasswordRequest, LoginRequest } from '../config/validation'

export const useUserModel = defineStore('user', () => {
  const user = ref<UserDto | null>(null)

  const load = async () => {
    user.value = await $fetch<UserDto>('/api/user')
    return user.value
  }

  const login = async (body: LoginRequest) => {
    await $fetch('/api/auth/login', { method: 'POST', body })
  }

  const register = async (body: LoginRequest) => {
    await $fetch('/api/auth/register', { method: 'POST', body })
  }

  const logout = async () => {
    await $fetch('/api/auth/logout')
    user.value = null
  }

  const changePassword = async (body: ChangePasswordRequest) => {
    await $fetch('/api/user/change-password', { method: 'POST', body })
  }

  return {
    user,
    load,
    login,
    register,
    logout,
    changePassword
  }
})

export const useUser = () => {
  const userModel = useUserModel()
  return computed(() => userModel.user)
}

export const useAuthenticatedUser = () => {
  const userModel = useUserModel()
  return computed(() => {
    if (!userModel.user) {
      throw createError('useAuthenticatedUser() can only be used in protected pages')
    }
    return userModel.user
  })
}
