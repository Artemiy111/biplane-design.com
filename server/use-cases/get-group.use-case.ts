import type { GroupId, IGroupRepo, IUseCase } from './types'

export class GetGroupUseCase implements IUseCase {
  constructor(private repo: IGroupRepo) { }

  async execute(id: GroupId) {
    return this.repo.getOne(id)
  }
}
