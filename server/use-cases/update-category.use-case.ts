import { err } from '../shared/result'
import type { ICategoryRepo, IUseCase, IUserRepo, UpdateCategoryDto } from './types'

export class UpdateCategoryUseCase implements IUseCase {
  constructor(private categoryRepo: ICategoryRepo, private userRepo: IUserRepo) { }

  async execute(dto: UpdateCategoryDto) {
    if (!(await this.userRepo.getUser()))
      return err(new Error('Unauthorized'))

    return await this.categoryRepo.update(dto)
  }
}
