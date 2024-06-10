import type { CategoryDbCreate, CategoryDbUpdate } from '../db/schema'
import type { CreateCategoryDto, UpdateCategoryDto } from '../use-cases/types'

export const categoryDbMapper = {
  toDbCreate(dto: CreateCategoryDto): CategoryDbCreate {
    return {
      groupId: dto.groupId,
      title: dto.title,
      uri: dto.uri,
    }
  },
  toDbUpdate(dto: UpdateCategoryDto): CategoryDbUpdate {
    return {
      title: dto.title,
      uri: dto.uri,
      order: dto.order,
    }
  },
  toDbUpdateWithoutOrder(db: CategoryDbUpdate): Omit<CategoryDbUpdate, 'order'> {
    const { order: _order, ...toUpdate } = db
    return toUpdate
  },
}
