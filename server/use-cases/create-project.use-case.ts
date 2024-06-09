import type { CreateProjectDto, IProjectRepo, IUseCase } from './types'

export class CreateProjectUseCase implements IUseCase {
  constructor(private projectRepo: IProjectRepo) { }

  async execute(dto: CreateProjectDto) {
    return await this.projectRepo.create(dto)
  }
}
