import type { UserDto } from '~~/server/use-cases/types'
import type { ChangePasswordDto, LoginDto, RegisterDto } from '~~/src/shared/config/validation/auth'

import { useApi } from '~~/src/shared/api'

export const useUserModel = defineStore('user', () => {
  const api = useApi()
  const user = ref<UserDto | null>(null)

  const load = async () => {
    user.value = await api.user.whoami.query()
    return user.value
  }

  const login = async (dto: LoginDto) => {
    await api.auth.login.mutate(dto)
  }

  const register = async (dto: RegisterDto) => {
    await api.auth.register.mutate(dto)
  }

  const logout = async () => {
    await api.auth.logout.query()
    user.value = null
  }

  const changePassword = async (dto: ChangePasswordDto) => {
    await api.user.changePassword.mutate(dto)
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
