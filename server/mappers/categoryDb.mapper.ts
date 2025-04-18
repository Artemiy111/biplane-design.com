import type { CategoryDbCreate, CategoryDbUpdate } from '../db/schema'
import type { CreateCategoryDto, UpdateCategoryDto } from '../types'

export const categoryDbMapper = {
  toDbCreate(dto: CreateCategoryDto): CategoryDbCreate {
    return {
      groupId: dto.groupId,
      title: dto.title,
      slug: dto.slug,
      layout: dto.layout,
    }
  },
  toDbUpdate(dto: UpdateCategoryDto): CategoryDbUpdate {
    return {
      title: dto.title,
      slug: dto.slug,
      layout: dto.layout,
      order: dto.order,
    }
  },
  toDbUpdateWithoutOrder(db: CategoryDbUpdate): Omit<CategoryDbUpdate, 'order'> {
    const { order: _order, ...toUpdate } = db
    return toUpdate
  },
}
