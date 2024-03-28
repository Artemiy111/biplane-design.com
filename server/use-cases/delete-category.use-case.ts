import { err } from '../shared/result'
import type { CategoryId, ICategoryDbRepo, IUseCase, IUserRepo } from './types'

export class DeleteCategoryUseCase implements IUseCase {
  constructor(private categoryRepo: ICategoryDbRepo, private userRepo: IUserRepo) {}

  async execute(id: CategoryId) {
    if (!(await this.userRepo.getUser()))
      return err(new Error('Unauthorized'))

    return await this.categoryRepo.delete(id)
  }
}
