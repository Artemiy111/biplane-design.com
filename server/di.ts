import { UserRepo } from './infra/user.repo'
import { DeleteGroupUseCase } from './use-cases/delete-group.use-case'
import { GroupDbRepo } from './infra/groupDb.repo'
import { GetGroupUseCase } from './use-cases/get-group.use-case'
import { CreateGroupUseCase } from './use-cases/create-group.use-case'
import { GetGroupsUseCase } from './use-cases/get-groups.use-case'

export const groupDbRepo = new GroupDbRepo()
export const userRepo = new UserRepo()

export const getGroupUseCase = new GetGroupUseCase(groupDbRepo)
export const getGroupsUseCase = new GetGroupsUseCase(groupDbRepo)
export const deleteGroupUseCase = new DeleteGroupUseCase(groupDbRepo, userRepo)
export const createGroupUseCase = new CreateGroupUseCase(groupDbRepo, userRepo)
