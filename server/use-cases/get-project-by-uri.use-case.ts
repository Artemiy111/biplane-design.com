import type { IProjectRepo, IUseCase } from './types'

export class GetGroupUseCase implements IUseCase {
  constructor(private projectRepo: IProjectRepo) {}

  async execute(uri: string) {
    return this.groupRepo.getGroup(id)
  }
}
