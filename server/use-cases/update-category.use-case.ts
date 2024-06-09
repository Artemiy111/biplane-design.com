import type { ICategoryRepo, IUseCase, UpdateCategoryDto } from './types'

export class UpdateCategoryUseCase implements IUseCase {
  constructor(private categoryRepo: ICategoryRepo) { }

  async execute(dto: UpdateCategoryDto) {
    return await this.categoryRepo.update(dto)
  }
}
