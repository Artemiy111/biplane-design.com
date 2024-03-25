import type { CreateGroup, CreateGroupDto, GetUser } from './types'

/**
 * @throws [error]
 */
export async function createGroupUseCase(
  group: CreateGroupDto,
  context: {
    getUser: GetUser
    createGroup: CreateGroup
  },
) {
  if (!context.getUser()) throw new Error('Auth error')

  return context.createGroup(group)
}
