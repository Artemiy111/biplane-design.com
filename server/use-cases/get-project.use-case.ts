import type { ProjectRepo } from '../infra/project.repo'
import type { IUseCase, ProjectId } from './types'

export class GetProjectUseCase implements IUseCase {
  constructor(private repo: ProjectRepo) { }

  async execute(id: ProjectId) {
    return this.repo.getOne(id)
  }
}
