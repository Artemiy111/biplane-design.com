import type { IProjectRepo, IUseCase, ProjectId } from './types'

export class GetProjectUseCase implements IUseCase {
  constructor(private repo: IProjectRepo) {}

  async execute(id: ProjectId) {
    return this.repo.getOne(id)
  }
}
