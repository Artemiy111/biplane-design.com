import { and, eq, gt, gte, lt, lte, sql } from 'drizzle-orm'
import type { PgTransaction } from 'drizzle-orm/pg-core'
import type { PostgresJsQueryResultHKT } from 'drizzle-orm/postgres-js'
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
import { groups, projects } from '~/server/db/schema'

// export const groupMapper = {
//   toCreate(dto: GroupDto): CreateGroupDto {
//     return {
//       title: dto.title,
//       uri: dto.uri,
//     }
//   },

//   toUpdate(dto: GroupDto): UpdateGroupDto {
//     return {
//       id: dto.id,
//       uri: dto.uri,
//       title: dto.title,
//       order: dto.order,
//     }
//   },
// }

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
  toCreate(dto: CreateGroupDto, order: number): GroupDbCreate {
    return {
      urlFriendly: dto.uri,
      title: dto.title,
      order,
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

type DbTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0]

export class GroupDbRepo implements IGroupDbRepo {
  private db: typeof db = db
  private tx: DbTransaction | null = null
  private get ctx() {
    return this.tx || db
  }

  private startTransaction(tx: DbTransaction) {
    this.tx = tx
  }

  private endTransaction() {
    this.tx = null
  }

  private rollBack() {
    this.tx?.rollback()
  }

  private async getGroupNextOrder() {
    try {
      const groupsCount = (await this.ctx.select().from(groups)).length
      return ok(groupsCount + 1)
    }
    catch (e) {
      return err(new Error('oops'))
    }
  }

  private async updateGroupOrder(dto: GroupDto, newOrder: number) {
    if (dto.order === newOrder)
      return ok(undefined)

    let returnValue: Result<void, Error> = ok(undefined)
    try {
      db.transaction(async (tx) => {
        this.startTransaction(tx)

        const nextOrder = await this.getGroupNextOrder()
        if (!nextOrder.ok)
          return err(nextOrder.error)

        if (newOrder > nextOrder.value)
          return err('New order is out of range')

        if (newOrder > dto.order) {
          await tx.update(groups).set({ order: sql`(${groups.order} - 1) * 1000` }).where(and(
            gt(projects.order, dto.order),
            lte(projects.order, dto.order),
          ))
        }
        else if (newOrder < dto.order) {
          await tx.update(projects).set({ order: sql`(${projects.order} + 1) * 1000` }).where(and(
            gte(projects.order, newOrder),
            lt(projects.order, dto.order),
          ))
        }

        await tx.update(projects).set({ order: dto.order }).where(eq(projects.urlFriendly, dto.uri))
        await tx.update(projects).set({ order: sql`${projects.order} / 1000` }).where(gte(projects.order, 1000))
      })
    }
    catch (_e) {
      returnValue = err(new Error('oops'))
      this.rollBack()
    }
    finally {
      this.endTransaction()
      // eslint-disable-next-line no-unsafe-finally
      return returnValue
    }
  }

  async getGroup(id: GroupId) {
    try {
      const group
      = (await this.ctx.query.groups.findFirst({
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
      }))
      if (!group)
        return err(new Error(`Group with id \`${id}\ does not exist`))

      return ok(groupDbMapper.toDto(group))
    }
    catch (_e) {
      return err(new Error('oops'))
    }
  }

  async getGroups() {
    try {
      const groups = await this.ctx.query.groups.findMany({
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

      const toCreate = groupDbMapper.toCreate(dto, nextOrder.value)
      const createdInDb = (await this.db.insert(groups).values(toCreate).returning())[0]
      const created = await this.getGroup(createdInDb.id)
      if (!created.ok)
        return err(new Error('oops'))

      return ok(created.value!)
    }
    catch (e) {
      return err(new Error('oops'))
    }
  }

  async updateGroup(dto: UpdateGroupDto): Promise<Result<GroupDto, Error>> {
    let returnValue: Result<GroupDto, Error> = err(new Error('oops'))

    try {
      returnValue = await db.transaction(async (tx) => {
        this.startTransaction(tx)

        const group = await this.getGroup(dto.id)
        if (!group.ok)
          return err(group.error)

        await this.ctx.update(groups)
          .set({ title: dto.title, urlFriendly: dto.uri })
          .where(eq(groups.id, dto.id))

        await this.updateGroupOrder(group.value, dto.order)

        const updatedGroup = await this.getGroup(dto.id)
        if (!updatedGroup.ok)
          return err(updatedGroup.error)

        return ok(updatedGroup.value)
      })
    }
    catch (e) {
      returnValue = err(new Error('oops'))
      this.rollBack()
    }
    finally {
      this.endTransaction()
      // eslint-disable-next-line no-unsafe-finally
      return returnValue
    }
  }

  async deleteGroup(_id: GroupId) {
    return err(new Error('oops'))
  }
}
