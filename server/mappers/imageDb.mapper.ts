import type { ImageDbCreate, ImageDbUpdate } from '../db/schema'
import type { CreateImageDto, UpdateImageDto } from '../use-cases/types'

export const imageDbMapper = {
  toDbCreate(dto: CreateImageDto): ImageDbCreate {
    return {
      id: dto.filename,
      projectId: dto.projectId,
      alt: dto.alt,
    }
  },
  toDbUpdate(dto: UpdateImageDto): ImageDbUpdate {
    return {
      alt: dto.alt,
      order: dto.order,
    }
  },
  toDbUpdateWithoutOrder(db: ImageDbUpdate): Omit<ImageDbUpdate, 'order'> {
    const { order: _order, ...toUpdate } = db
    return toUpdate
  },
}
