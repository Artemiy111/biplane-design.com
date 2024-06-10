import type { CategoryDbDeep } from '../db/schema'
import type { CategoryDto, ProjectDto } from '../use-cases/types'

export const categoryMapper = {
  toDto(db: CategoryDbDeep, projects: ProjectDto[]): CategoryDto {
    return {
      ...db,
      projects,
    }
  },
}
