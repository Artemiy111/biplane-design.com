import type { ProjectDbDeep } from '../db/schema'
import type { ImageDto, ProjectDto } from '../use-cases/types'

export const projectMapper = {
  toDto(db: ProjectDbDeep, images: ImageDto[]): ProjectDto {
    return {
      ...db,
      images,
    }
  },
}
