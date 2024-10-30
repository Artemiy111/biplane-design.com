export const useUserModel = defineStore('user', () => {
  const { data: user, status } = useFetch('/api/user', {
    onResponse: (data) => {
      console.log(data)
    },
    key: 'user',
  })

  return {
    user,
    status,
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
