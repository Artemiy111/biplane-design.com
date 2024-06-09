import type { CategoryId, ICategoryRepo, IUseCase } from './types'

export class DeleteCategoryUseCase implements IUseCase {
  constructor(private categoryRepo: ICategoryRepo) { }

  async execute(id: CategoryId) {
    return await this.categoryRepo.delete(id)
  }
}
