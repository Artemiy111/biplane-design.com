import type { IGroupDbRepo, IUseCase } from './types'

export class GetGroupsUseCase implements IUseCase {
  constructor(private repo: IGroupDbRepo) {}

  async execute() {
    return this.repo.getGroups()
  }
}
