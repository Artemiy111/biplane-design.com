import type { GroupId, IGroupDbRepo, IUseCase, IUserRepo } from './types'

export class GetGroupUseCase implements IUseCase {
  constructor(private groupRepo: IGroupDbRepo) {}

  async execute(id: GroupId) {
    return this.groupRepo.getGroup(id)
  }
}
