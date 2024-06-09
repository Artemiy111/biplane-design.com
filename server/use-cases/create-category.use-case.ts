import type { CreateCategoryDto, ICategoryRepo, IUseCase } from './types'

export class CreateCategoryUseCase implements IUseCase {
  constructor(private categoryRepo: ICategoryRepo) { }

  async execute(dto: CreateCategoryDto) {
    return await this.categoryRepo.create(dto)
  }
}
