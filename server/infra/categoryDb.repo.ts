import { projectDbMapper } from './projectDb.repo'
import type { CategoryDbDeep } from '~/server/db/schema'
import type { CategoryDto } from '~/server/use-cases/types'

export const categoryDbMapper = {
  toDto(db: CategoryDbDeep): CategoryDto {
    return {
      groupId: db.groupId,
      id: db.id,
      title: db.title,
      uri: db.urlFriendly,
      order: db.order,
      projects: db.projects.map(projectDbMapper.toDto),
    }
  },
}
