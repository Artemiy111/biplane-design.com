import { err } from '../shared/result'
import type { IGroupRepo, IUseCase, IUserRepo, UpdateGroupDto } from './types'

export class UpdateGroupUseCase implements IUseCase {
  constructor(private projectRepo: IGroupRepo, private userRepo: IUserRepo) {}

  async execute(dto: UpdateGroupDto) {
    if (!(await this.userRepo.getUser()))
      return err(new Error(`Unauthorized`))

    return await this.projectRepo.update(dto)
  }
}
