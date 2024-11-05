import type { UserDto } from '~~/server/use-cases/types'

import type { ChangePasswordDto, LoginDto, RegisterDto } from '../config/validation'

import { api } from '../api'

export const useUserModel = defineStore('user', () => {
  const user = ref<UserDto | null>(null)

  const load = async () => {
    user.value = await $fetch<UserDto>('/api/user')
    return user.value
  }

  const login = async (dto: LoginDto) => {
    await api.auth.login(dto)
  }

  const register = async (dto: RegisterDto) => {
    await api.auth.register(dto)
  }

  const logout = async () => {
    await api.auth.logout()
    user.value = null
  }

  const changePassword = async (dto: ChangePasswordDto) => {
    await api.user.changePassword(dto)
  }

  return {
    user,
    load,
    login,
    register,
    logout,
    changePassword,
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
