import type { ImageDbCreate, ImageDbUpdate } from '../db/schema'
import type { CreateImageDto, UpdateImageDto } from '../use-cases/types'

export const imageDbMapper = {
  toDbCreate(dto: CreateImageDto, filename: string): ImageDbCreate {
    return {
      id: filename,
      projectId: dto.projectId,
      alt: dto.file.name,
      fit: dto.fit,
    }
  },
  toDbUpdate(dto: UpdateImageDto): ImageDbUpdate {
    return {
      alt: dto.alt,
      fit: dto.fit,
      order: dto.order,
    }
  },
  toDbUpdateWithoutOrder(db: ImageDbUpdate): Omit<ImageDbUpdate, 'order'> {
    const { order: _order, ...toUpdate } = db
    return toUpdate
  },
}
