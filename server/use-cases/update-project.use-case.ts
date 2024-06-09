import type { IProjectRepo, IUseCase, UpdateProjectDto } from './types'

export class UpdateProjectUseCase implements IUseCase {
  constructor(private projectRepo: IProjectRepo) { }

  async execute(dto: UpdateProjectDto) {
    return await this.projectRepo.update(dto)
  }
}
