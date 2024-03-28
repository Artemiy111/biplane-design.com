import { err } from '../shared/result'
import type { GroupId, IGroupRepo, IUseCase, IUserRepo } from './types'

export class DeleteGroupUseCase implements IUseCase {
  constructor(private groupRepo: IGroupRepo, private userRepo: IUserRepo) {}

  async execute(id: GroupId) {
    if (!(await this.userRepo.getUser()))
      return err(new Error('Unauthorized'))

    return await this.groupRepo.delete(id)
  }
}
