import { and, count, eq, getTableColumns, gt, gte, lt, lte, sql } from 'drizzle-orm'

import type { Db } from '~~/server/db'
import type { GroupId } from '~~/server/db/schema'
import type {
  CreateGroupDto,
  UpdateGroupDto,
} from '~~/server/use-cases/types'

import { groups } from '~~/server/db/schema'

import { groupDbMapper } from '../mappers/groupDb.mapper'

export class GroupDbRepo {
  constructor(private db: Db) { }

  async getOne(id: GroupId) {
    const model
      = await this.db.query.groups.findFirst({
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
      })
    if (!model)
      throw new Error(`Group with id '${id}' does not exist`)
    return model
  }

  async getAll() {
    return await this.db.query.groups.findMany({
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
  }

  async create(create: CreateGroupDto) {
    return this.db.transaction(async (tx) => {
      const [createdInDb] = await tx.insert(groups).values({ ...create, order: 999 }).returning()
      const [curOrder] = await tx.select({ value: count() }).from(groups)
      await tx.update(groups).set({ order: curOrder.value }).where(eq(groups.id, createdInDb.id)).returning()
      return this.getOne(createdInDb.id)
    }, {
      // deferrable: true,
      // isolationLevel: 'read uncommitted',
    })
  }

  private async updateOrder(id: GroupId, newOrder: number) {
    return await this.db.transaction(async (tx) => {
      const model = await tx.query.groups.findFirst({ where: eq(groups.id, id) })
      if (!model || model.order === newOrder) throw tx.rollback()
      const [curOrder] = await tx.select({ value: count() }).from(groups)

      if (newOrder > curOrder.value + 1)
        throw new Error('New order is out of range')

      if (newOrder > model.order) {
        await tx.update(groups).set({ order: sql`(${groups.order} - 1) * 1000` }).where(and(
          gt(groups.order, model.order),
          lte(groups.order, newOrder),
        ))
      }
      else if (newOrder < model.order) {
        await tx.update(groups).set({ order: sql`(${groups.order} + 1) * 1000` }).where(and(
          gte(groups.order, newOrder),
          lt(groups.order, model.order),
        ))
      }

      await tx.update(groups).set({ order: newOrder }).where(eq(groups.slug, model.slug))
      await tx.update(groups).set({ order: sql`${groups.order} / 1000` }).where(gte(groups.order, 1000))
    })
  }

  async update(id: GroupId, update: UpdateGroupDto) {
    const ctx = this.db

    return await ctx.transaction(async (tx) => {
      await tx.update(groups)
        .set(groupDbMapper.toUpdateWithoutOrder(groupDbMapper.toUpdate(update)))
        .where(eq(groups.id, id))
      await this.updateOrder(id, update.order)

      return await this.getOne(id)
    })
  }

  async delete(id: GroupId) {
    return await this.db.transaction(async (tx) => {
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
    })
  }
}
