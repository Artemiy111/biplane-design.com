import type { ProjectDbCreate, ProjectDbUpdate } from '../db/schema'
import type { CreateProjectDto, UpdateProjectDto } from '../use-cases/types'

export const projectDbMapper = {
  toDbCreate(dto: CreateProjectDto, order: number): ProjectDbCreate {
    return {
      categoryId: dto.categoryId,
      title: dto.title,
      uri: dto.uri,
      yearStart: dto.yearStart,
      yearEnd: dto.yearEnd,
      location: dto.location,
      status: dto.status,
      order,
    }
  },
  toDbUpdate(dto: UpdateProjectDto): ProjectDbUpdate {
    return {
      categoryId: dto.categoryId,
      title: dto.title,
      uri: dto.uri,
      yearStart: dto.yearStart,
      yearEnd: dto.yearEnd,
      location: dto.location,
      status: dto.status,
      order: dto.order,
      isMinimal: dto.isMinimal,
      isVisible: dto.isVisible,
    }
  },
  toDbUpdateWithoutOrder(db: ProjectDbUpdate): Omit<ProjectDbUpdate, 'order'> {
    const { order: _order, ...toUpdate } = db
    return toUpdate
  },
}
