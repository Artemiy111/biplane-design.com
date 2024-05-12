import type { UserDto } from '~/server/use-cases/types'

export const useUserStore = useState('user-store', () => {
  const user = ref<UserDto | null>(null)
  const login = () => { }
})