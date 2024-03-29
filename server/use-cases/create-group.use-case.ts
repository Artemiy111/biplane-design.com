import { err } from '../shared/result'
import type { CreateGroupDto, IGroupRepo, IUseCase, IUserRepo } from './types'

export class CreateGroupUseCase implements IUseCase {
  constructor(private groupRepo: IGroupRepo, private userRepo: IUserRepo) {}

  async execute(dto: CreateGroupDto) {
    if (!(await this.userRepo.getUser()))
      return err(new Error('Unauthorized'))

    return await this.groupRepo.create(dto)
  }
}
