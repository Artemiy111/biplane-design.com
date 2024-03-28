import type { CategoryId, ICategoryDbRepo, IUseCase } from './types'

export class GetCategoryUseCase implements IUseCase {
  constructor(private repo: ICategoryDbRepo) {}

  async execute(id: CategoryId) {
    return this.repo.getOne(id)
  }
}
