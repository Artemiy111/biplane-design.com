import type { GroupId, IGroupDbRepo, IUseCase } from './types'

export class GetGroupUseCase implements IUseCase {
  constructor(private repo: IGroupDbRepo) {}

  async execute(id: GroupId) {
    return this.repo.getGroup(id)
  }
}
