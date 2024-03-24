import type { GetUser } from '../users/types'
import type { GetGroups } from './types'

/**
 * @throws [error]
 */
export async function createGroupUseCase(context: { getUser: GetUser, getGroups: GetGroups }) {
  if (!context.getUser())
    throw new Error('Auth error')

  return context.getGroups()
}
