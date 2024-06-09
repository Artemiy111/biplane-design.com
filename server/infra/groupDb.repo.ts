import { and, count, eq, getTableColumns, gt, gte, lt, lte, sql } from 'drizzle-orm'
import { err, ok } from '../shared/result'
import { categoryDbMapper } from './categoryDb.repo'
import type {
  CreateGroupDto,
  GroupDbDto,
  GroupId,
  UpdateGroupDto,
} from '~/server/use-cases/types'
import type { Db } from '~/server/db'
import type { GroupDbCreate, GroupDbDeep, GroupDbUpdate } from '~/server/db/schema'
import { groups } from '~/server/db/schema'

export const groupDbMapper = {
  toDbDto(db: GroupDbDeep): GroupDbDto {
    return {
      id: db.id,
      title: db.title,
      uri: db.uri,
      order: db.order,
      categories: db.categories.map(categoryDbMapper.toDb),
    }
  },
  toCreate(dto: CreateGroupDto, order: number): GroupDbCreate {
    return {
      uri: dto.uri,
      title: dto.title,
      order,
    }
  },
  toUpdate(dto: UpdateGroupDto): GroupDbUpdate {
    return {
      id: dto.id,
      order: dto.order,
      title: dto.title,
      uri: dto.uri,
    }
  },
  toUpdateWithoutOrder(db: GroupDbUpdate): Omit<GroupDbUpdate, 'order'> {
    const { order: _order, ...toUpdate } = db
    return toUpdate
  },
}

export class GroupDbRepo {
  constructor(private db: Db) { }

  async getOne(id: GroupId) {
    const ctx = this.db
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
        return err(new Error(`Group with id \`${id}\` does not exist`))

      return ok(groupDbMapper.toDbDto(group))
    }
    catch (_e) {
      return err(new Error(`Could not get group with id \`${id}\``))
    }
  }

  async getAll() {
    const ctx = this.db
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
      return ok(groups.map(groupDbMapper.toDbDto))
    }
    catch (_e) {
      return err(new Error(`Could not get groups`))
    }
  }

  async create(dto: CreateGroupDto) {
    const ctx = this.db
    try {
      return ctx.transaction(async (tx) => {
        const [curOrder] = await tx.select({ value: count() }).from(groups)
        const toCreate = groupDbMapper.toCreate(dto, curOrder.value + 1)
        const createdInDb = (await tx.insert(groups).values(toCreate).returning())[0]
        return ok(createdInDb)
      }, {
        isolationLevel: 'read uncommitted',
      })
    }
    catch (e) {
      return err(new Error(`Could not create group`))
    }
  }

  private async updateOrder(dto: GroupDbDto, newOrder: number) {
    if (dto.order === newOrder)
      return ok(undefined)

    const ctx = this.db

    try {
      return await ctx.transaction(async (tx) => {
        const [curOrder] = await tx.select({ value: count() }).from(groups)

        if (newOrder > curOrder.value + 1)
          return err(new Error('New order is out of range'))

        if (newOrder > dto.order) {
          await tx.update(groups).set({ order: sql`(${groups.order} - 1) * 1000` }).where(and(
            gt(groups.order, dto.order),
            lte(groups.order, newOrder),
          ))
        }
        else if (newOrder < dto.order) {
          await tx.update(groups).set({ order: sql`(${groups.order} + 1) * 1000` }).where(and(
            gte(groups.order, newOrder),
            lt(groups.order, dto.order),
          ))
        }

        await tx.update(groups).set({ order: newOrder }).where(eq(groups.uri, dto.uri))
        await tx.update(groups).set({ order: sql`${groups.order} / 1000` }).where(gte(groups.order, 1000))
        return ok(undefined)
      })
    }
    catch (_e) {
      return err(new Error(`Could not update order of group with id \`${dto.id}\``))
    }
  }

  async update(dto: UpdateGroupDto) {
    const ctx = this.db

    try {
      return await ctx.transaction(async (tx) => {
        const group = await this.getOne(dto.id)
        if (!group.ok)
          return group

        await tx.update(groups)
          .set(groupDbMapper.toUpdateWithoutOrder(groupDbMapper.toUpdate(dto)))
          .where(eq(groups.id, dto.id))

        await this.updateOrder(group.value, dto.order)

        const updatedGroup = await this.getOne(dto.id)
        if (!updatedGroup.ok)
          return tx.rollback()

        return ok(updatedGroup.value)
      })
    }
    catch (e) {
      return err(new Error(`Could not update group with id \`${dto.id}\``))
    }
  }

  async delete(id: GroupId) {
    const ctx = this.db
    try {
      return await ctx.transaction(async (tx) => {
        const toDelete = await tx.query.groups.findFirst({ where: eq(groups.id, id) })
        if (!toDelete)
          return tx.rollback()

        const deletedInDb = (await tx.delete(groups).where(eq(groups.id, id)).returning())[0]
        if (!deletedInDb)
          return tx.rollback()

        const remain = await tx.select(({ ...getTableColumns(groups), newOrder: sql<number>`row_number() over (order by ${groups.order})`.mapWith(Number).as('new_order') })).from(groups)
        await Promise.all(
          remain.map((group) => {
            return tx.update(groups).set({ order: group.newOrder * 1000 }).where(
              eq(groups.id, group.id),
            )
          }),
        )
        await Promise.all(
          remain.map((group) => {
            return tx.update(groups).set({ order: group.newOrder }).where(
              eq(groups.id, group.id),
            )
          }),
        )
        return ok(undefined)
      })
    }
    catch (_e) {
      return err(new Error(`Could not delete group with id \`${id}\``))
    }
  }
}
