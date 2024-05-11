import { err } from '../shared/result'
import type { CreateCategoryDto, ICategoryRepo, IUseCase, IUserRepo } from './types'

export class CreateCategoryUseCase implements IUseCase {
  constructor(private categoryRepo: ICategoryRepo, private userRepo: IUserRepo) { }

  async execute(dto: CreateCategoryDto) {
    if (!(await this.userRepo.getUser()))
      return err(new Error('Unauthorized'))

    return await this.categoryRepo.create(dto)
  }
}
