import { type ProjectRepo } from '../infra/project.repo'
import type { IUseCase, UpdateProjectDto } from './types'

export class UpdateProjectUseCase implements IUseCase {
  constructor(private projectRepo: ProjectRepo) { }

  async execute(dto: UpdateProjectDto) {
    return await this.projectRepo.update(dto)
  }
}
