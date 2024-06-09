import type { IProjectRepo, IUseCase, ProjectId } from './types'

export class DeleteProjectUseCase implements IUseCase {
  constructor(private projectRepo: IProjectRepo) { }

  async execute(id: ProjectId) {
    return await this.projectRepo.delete(id)
  }
}
