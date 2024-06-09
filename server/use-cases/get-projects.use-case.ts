import type { IProjectRepo, IUseCase } from './types'

export class GetProjectsUseCase implements IUseCase {
  constructor(private repo: IProjectRepo) { }

  async execute() {
    return this.repo.getAll()
  }
}
