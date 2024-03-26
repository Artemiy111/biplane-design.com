import { eq } from 'drizzle-orm'
import { GroupEntity } from '../entities/group.entity'
import type { Result } from '../shared/result'
import { ResultOk, err, ok } from '../shared/result'
import { IGroupEntity } from './../entities/group.entity'
import { categoryDbMapper } from './categoryDb.repo'
import type {
  CreateGroupDto,
  GroupDto,
  GroupId,
  IGroupDbRepo,
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

export const groupDbMapper = {
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

export class GroupDbRepo implements IGroupDbRepo {
  async getGroupNextOrder() {
    try {
      const groupsCount = (await db.select().from(groups)).length
      return ok(groupsCount + 1)
    }
    catch (e) {
      return err(new Error('oops'))
    }
  }

  async getGroup(id: GroupId) {
    try {
      const group
      = (await db.query.groups.findFirst({
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
      return ok(group === null ? null : groupDbMapper.toDto(group))
    }
    catch (_e) {
      return err(new Error('oops'))
    }
  }

  async getGroups() {
    try {
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
      return ok(groups.map(groupDbMapper.toDto))
    }
    catch (_e) {
      return err(new Error('oops'))
    }
  }

  async createGroup(dto: CreateGroupDto) {
    try {
      const nextOrder = await this.getGroupNextOrder()
      if (!nextOrder.ok)
        return err(nextOrder.error)

      const group = groupDbMapper.toCreate(dto)

      const createdInDb = (await db.insert(groups)
        .values({ ...group, order: nextOrder.value })
        .returning())[0]

      const created = await this.getGroup(createdInDb.id)
      if (!created.ok)
        return err(new Error('oops'))

      return ok(created.value!)
    }
    catch (e) {
      return err(new Error('oops'))
    }
  }

  async updateGroup(_dto: UpdateGroupDto) {
    // try{
    //   await db.transaction(async (tx) => {
    //     const group = await tx.select().from(groups).where(eq(groups.id, dto.id))
    //     const nextOrder = await this.getGroupNextOrder()
    //     await tx.update(groups).set(groupDbMapper.toUpdate(dto))
    //   })
    //   return ok((await this.getGroup(dto.id))!)
    // }
    // catch (_e) {
    //   return err(new Error('oops'))
    // }
    return err(new Error('oops'))
  }

  async deleteGroup(_id: GroupId) {
    return err(new Error('oops'))
  }
}
