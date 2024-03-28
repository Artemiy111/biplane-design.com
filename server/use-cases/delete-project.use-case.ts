import { err } from '../shared/result'
import type { IProjectRepo, IUseCase, IUserRepo, ProjectId } from './types'

export class DeleteProjectUseCase implements IUseCase {
  constructor(private projectRepo: IProjectRepo, private userRepo: IUserRepo) {}

  async execute(id: ProjectId) {
    if (!(await this.userRepo.getUser()))
      return err(new Error('Unauthorized'))

    return await this.projectRepo.delete(id)
  }
}
