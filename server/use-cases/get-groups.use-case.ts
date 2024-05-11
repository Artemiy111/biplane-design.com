import type { IGroupRepo, IUseCase } from './types'

export class GetGroupsUseCase implements IUseCase {
  constructor(private repo: IGroupRepo) { }

  async execute() {
    return this.repo.getAll()
  }
}
