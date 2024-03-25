import { eq } from 'drizzle-orm'
import { GroupEntity } from '../entities/group.entity'
import { IGroupEntity } from './../entities/group.entity'
import { categoryDbMapper } from './categoryDb.repo'
import type {
  CreateGroup,
  CreateGroupDto,
  DeleteGroup,
  GetGroup,
  GetGroupNextOrder,
  GetGroups,
  GroupDto,
  GroupId,
  IGroupDbRepo,
  UpdateGroup,
  UpdateGroupDto,
} from '~/server/use-cases/types'
import { db } from '~/server/db'
import type { GroupDbCreate, GroupDbDeep, GroupDbUpdate } from '~/server/db/schema'
import { groups } from '~/server/db/schema'

export const groupMapper = {
  toCreate(dto: GroupDto): CreateGroupDto {
    return {
      title: dto.title,
      order: dto.order,
      uri: dto.uri,
    }
  },

  toUpdate(dto: GroupDto): UpdateGroupDto {
    return {
      id: dto.id,
      uri: dto.uri,
      title: dto.title,
      order: dto.order,
    }
  },
}

const groupDbMapper = {
  toDto(db: GroupDbDeep): GroupDto {
    return {
      id: db.id,
      title: db.title,
      uri: db.urlFriendly,
      order: db.order,
      categories: db.categories.map(categoryDbMapper.toDto),
    }
  },
  toCreate(dto: CreateGroupDto): GroupDbCreate {
    return {
      urlFriendly: dto.uri,
      title: dto.title,
      order: dto.order,
    }
  },
  toUpdate(db: UpdateGroupDto): GroupDbUpdate {
    return {
      id: db.id,
      order: db.order,
      title: db.title,
      urlFriendly: db.uri,
    }
  },
}

export const getGroupNextOrder: GetGroupNextOrder = async () => {
  return (await db.select().from(groups)).length + 1
}

export const getGroup: GetGroup = async (id: GroupId) => {
  const group =
    (await db.query.groups.findFirst({
      where: eq(groups.id, id),
      with: {
        categories: {
          with: {
            projects: {
              with: {
                images: { orderBy: images => images.order },
              },
              orderBy: projects => projects.order,
            },
          },
          orderBy: categories => categories.order,
        },
      },
      orderBy: groups => groups.order,
    })) || null
  return group === null ? null : groupDbMapper.toDto(group)
}

export const getGroups: GetGroups = async () => {
  const groups = await db.query.groups.findMany({
    with: {
      categories: {
        with: {
          projects: {
            with: {
              images: { orderBy: images => images.order },
            },
            orderBy: projects => projects.order,
          },
        },
        orderBy: categories => categories.order,
      },
    },
    orderBy: groups => groups.order,
  })
  return groups.map(groupDbMapper.toDto)
}

export const createGroup: CreateGroup = async (dto: CreateGroupDto) => {
  const nextOrder = await getGroupNextOrder()
  const group = new GroupEntity({ ...dto, order: nextOrder })
}

export const updateGroup: UpdateGroup = async (dto: UpdateGroupDto) => {
  await db.transaction(async tx => {
    const group = await tx.select().from(groups).where(eq(groups.id, dto.id))
    const nextOrder = await getGroupNextOrder()
  })
  await db.update(groups).set(groupDbMapper.toUpdate(dto))
  return (await getGroup(dto.id))!
}

export const deleteGroup: DeleteGroup = async (id: GroupId) => {}

export function createGroupDbRepo(): IGroupDbRepo {
  return {
    getGroup,
    getGroups,
    createGroup,
    updateGroup,
    deleteGroup,
  }
}
