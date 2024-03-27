import { and, eq, getTableColumns, gt, gte, lt, lte, sql } from 'drizzle-orm'
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
import type { Db, DbTransaction } from '~/server/db'
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

export class GroupDbRepo implements IGroupDbRepo {
  constructor(private db: Db) {}

  private async getGroupNextOrder(tx?: DbTransaction) {
    const ctx = tx || this.db
    try {
      const groupsCount = (await ctx.select().from(groups)).length
      return ok(groupsCount + 1)
    }
    catch (e) {
      return err(new Error('oops'))
    }
  }

  private async updateGroupOrder(dto: GroupDto, newOrder: number, tx?: DbTransaction) {
    if (dto.order === newOrder)
      return ok(undefined)

    const ctx = tx || this.db
    let returnValue: Result<void, Error> = ok(undefined)

    try {
      await ctx.transaction(async (tx) => {
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
    }
    finally {
      // eslint-disable-next-line no-unsafe-finally
      return returnValue
    }
  }

  async getGroup(id: GroupId, tx?: DbTransaction) {
    const ctx = tx || this.db
    try {
      const group
      = (await ctx.query.groups.findFirst({
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

  async getGroups(tx?: DbTransaction) {
    const ctx = tx || this.db
    try {
      const groups = await ctx.query.groups.findMany({
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

  async createGroup(dto: CreateGroupDto, tx?: DbTransaction) {
    const ctx = tx || this.db
    try {
      return ctx.transaction(async (tx) => {
        const nextOrder = await this.getGroupNextOrder(tx)
        if (!nextOrder.ok)
          return err(nextOrder.error)

        const toCreate = groupDbMapper.toCreate(dto, nextOrder.value)

        const createdInDb = (await tx.insert(groups).values(toCreate).returning())[0]
        const created = await this.getGroup(createdInDb.id, tx)
        if (!created.ok)
          return err(new Error('oops'))

        return ok(created.value!)
      })
    }
    catch (e) {
      return err(new Error('oops'))
    }
  }

  async updateGroup(dto: UpdateGroupDto, tx?: DbTransaction): Promise<Result<GroupDto, Error>> {
    const ctx = tx || this.db
    let returnValue: Result<GroupDto, Error> = err(new Error('oops'))

    try {
      returnValue = await ctx.transaction(async (tx) => {
        const group = await this.getGroup(dto.id, tx)
        if (!group.ok)
          return err(group.error)

        await tx.update(groups)
          .set({ title: dto.title, urlFriendly: dto.uri })
          .where(eq(groups.id, dto.id))

        await this.updateGroupOrder(group.value, dto.order, tx)

        const updatedGroup = await this.getGroup(dto.id, tx)
        if (!updatedGroup.ok)
          return err(updatedGroup.error)

        return ok(updatedGroup.value)
      })
    }
    catch (e) {
      returnValue = err(new Error('oops'))
    }
    finally {
      // eslint-disable-next-line no-unsafe-finally
      return returnValue
    }
  }

  async deleteGroup(id: GroupId, tx?: DbTransaction) {
    const ctx = tx || this.db
    try {
      return await ctx.transaction(async (tx) => {
        const toDelete = await tx.query.groups.findFirst({ where: eq(groups.id, id) })
        if (!toDelete)
          return err(new Error('oops'))

        const deletedInDb = (await tx.delete(projects).where(eq(projects.id, id)).returning())[0]
        if (!deletedInDb)
          return err(new Error('oops'))

        const remainProjects = await tx.select(({ ...getTableColumns(projects), newOrder: sql<number>`row_number() over (order by ${projects.order})`.mapWith(Number).as('new_order') })).from(projects)
        await Promise.all(
          remainProjects.map((proj) => {
            return tx.update(projects).set({ order: proj.newOrder * 1000 }).where(
              eq(projects.urlFriendly, proj.urlFriendly),
            )
          }),
        )
        await Promise.all(
          remainProjects.map((proj) => {
            return tx.update(projects).set({ order: proj.newOrder }).where(
              eq(projects.urlFriendly, proj.urlFriendly),
            )
          }),
        )
        return ok(undefined)
      })
    }
    catch (_e) {
      return err(new Error('oops'))
    }
  }
}
