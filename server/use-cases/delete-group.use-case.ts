import type { GroupId, IGroupRepo, IUseCase } from './types'

export class DeleteGroupUseCase implements IUseCase {
  constructor(private groupRepo: IGroupRepo) { }

  async execute(id: GroupId) {
    return await this.groupRepo.delete(id)
  }
}
