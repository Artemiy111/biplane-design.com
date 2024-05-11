import type { CategoryId, ICategoryRepo, IUseCase } from './types'

export class GetCategoryUseCase implements IUseCase {
  constructor(private repo: ICategoryRepo) { }

  async execute(id: CategoryId) {
    return this.repo.getOne(id)
  }
}
