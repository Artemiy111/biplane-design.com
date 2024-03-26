import type { IGroupDbRepo, IUseCase } from './types'

export class GetGroupsUseCase implements IUseCase {
  constructor(private groupRepo: IGroupDbRepo) {}

  async execute() {
    return this.groupRepo.getGroups()
  }
}
