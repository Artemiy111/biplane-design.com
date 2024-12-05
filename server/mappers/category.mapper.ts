import type { CategoryDbDeep } from '../db/schema'
import type { CategoryDto, ProjectDto } from '../types'

export const categoryMapper = {
  toDto(db: CategoryDbDeep, projects: ProjectDto[]): CategoryDto {
    return {
      ...db,
      projects,
    }
  },
}
