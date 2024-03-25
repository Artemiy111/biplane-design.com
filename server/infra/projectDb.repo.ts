import { imageDbMapper } from './imageDb.repo'
import type { ProjectDbDeep } from '~/server/db/schema'
import type { ProjectDto } from '~/server/use-cases/types'

export const projectDbMapper = {
  toDto(db: ProjectDbDeep): ProjectDto {
    return {
      categoryId: db.categoryId,
      id: db.id,
      title: db.title,
      uri: db.urlFriendly,
      yearStart: db.yearStart,
      yearEnd: db.yearEnd,
      location: db.location,
      status: db.status,
      order: db.order,
      images: db.images.map(imageDbMapper.toDto),
    }
  },
}
