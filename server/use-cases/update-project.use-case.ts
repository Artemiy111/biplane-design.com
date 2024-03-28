import { err } from '../shared/result'
import type { IProjectRepo, IUseCase, IUserRepo, UpdateProjectDto } from './types'

export class UpdateProjectUseCase implements IUseCase {
  constructor(private projectRepo: IProjectRepo, private userRepo: IUserRepo) {}

  async execute(dto: UpdateProjectDto) {
    if (!(await this.userRepo.getUser()))
      return err(new Error(`Unauthorized`))

    return await this.projectRepo.update(dto)
  }
}
