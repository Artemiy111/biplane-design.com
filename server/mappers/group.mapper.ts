import type { GroupDbDeep } from '../db/schema'
import type { CategoryDto, GroupDto } from '../use-cases/types'

export const groupMapper = {
  toDto(db: GroupDbDeep, categories: CategoryDto[]): GroupDto {
    return {
      ...db,
      categories,
    }
  },
}
