import { err } from '../shared/result'
import type { CategoryId, ICategoryRepo, IUseCase, IUserRepo } from './types'

export class DeleteCategoryUseCase implements IUseCase {
  constructor(private categoryRepo: ICategoryRepo, private userRepo: IUserRepo) { }

  async execute(id: CategoryId) {
    if (!(await this.userRepo.getUser()))
      return err(new Error('Unauthorized'))

    return await this.categoryRepo.delete(id)
  }
}
