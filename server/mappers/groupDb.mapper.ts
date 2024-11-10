import type { GroupDbCreate, GroupDbUpdate } from '../db/schema'
import type { CreateGroupDto, UpdateGroupDto } from '../use-cases/types'

export const groupDbMapper = {
  toCreate(dto: CreateGroupDto): GroupDbCreate {
    return {
      slug: dto.slug,
      title: dto.title,
    }
  },
  toUpdate(dto: UpdateGroupDto): GroupDbUpdate {
    return {
      title: dto.title,
      slug: dto.slug,
      order: dto.order,
    }
  },
  toUpdateWithoutOrder(db: GroupDbUpdate): Omit<GroupDbUpdate, 'order'> {
    const { order: _order, ...toUpdate } = db
    return toUpdate
  },
}
