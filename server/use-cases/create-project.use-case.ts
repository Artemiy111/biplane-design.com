import { err } from '../shared/result'
import type { CreateProjectDto, IProjectRepo, IUseCase, IUserRepo } from './types'

export class CreateProjectUseCase implements IUseCase {
  constructor(private projectRepo: IProjectRepo, private userRepo: IUserRepo) {}

  async execute(dto: CreateProjectDto) {
    if (!(await this.userRepo.getUser()))
      return err(new Error(`Unauthorized`))

    return await this.projectRepo.create(dto)
  }
}
