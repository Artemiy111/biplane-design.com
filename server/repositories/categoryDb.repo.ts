import { and, count, eq, getTableColumns, gt, gte, lt, lte, sql } from 'drizzle-orm'

import type { CategoryDbCreate, CategoryId, GroupId } from '~~/server/db/schema'
import type { UpdateCategoryDto } from '~~/server/use-cases/types'

import { categories } from '~~/server/db/schema'

import type { Db } from '../db'

import { categoryDbMapper } from '../mappers/categoryDb.mapper'

export class CategoryDbRepo {
  constructor(private db: Db) { }

  async getOne(id: CategoryId) {
    const model = await this.db.query.categories.findFirst({
      where: eq(categories.id, id),
      with: {
        projects: {
          with: {
            images: {
              orderBy: images => images.order,
            },
          },
          orderBy: projects => projects.order,
        },
      },
      orderBy: categories => categories.order,
    })
    if (!model)
      throw new Error(`Could not find category with id \`${id}\``)
    return model
  }

  async getByGroupId(groupId: GroupId) {
    const model = await this.db.query.categories.findMany({
      where: eq(categories.groupId, groupId),
      with: {
        projects: {
          with: {
            images: {
              orderBy: images => images.order,
            },
          },
          orderBy: projects => projects.order,
        },

      },
      orderBy: categories.order,
    })
    if (!model)
      throw new Error(`Could not get categories`)
    return model
  }

  async getAll() {
    const models = await this.db.query.categories.findMany({
      with: {
        projects: {
          with: {
            images: {
              orderBy: images => images.order,
            },
          },
          orderBy: projects => projects.order,
        },
      },
      orderBy: categories.order,
    })
    return models
  }

  async create(create: CategoryDbCreate) {
    return this.db.transaction(async (tx) => {
      const createdInDb = (await tx.insert(categories).values({ ...create, order: 999 }).returning())[0]
      const [curOrder] = await tx.select({ value: count() }).from(categories).where(eq(categories.groupId, create.groupId))
      await tx.update(categories).set({ order: curOrder.value }).where(eq(categories.id, createdInDb.id)).returning()
      return await this.getOne(createdInDb.id)
    }, {
      // deferrable: true,
      // 'behavior': 'immediate'
      // isolationLevel: 'read uncommitted',
    })
  }

  private async updateOrder(id: CategoryId, newOrder: number) {
    return await this.db.transaction(async (tx) => {
      const model = await tx.query.categories.findFirst({ where: eq(categories.id, id) })
      if (!model || model.order === newOrder) throw tx.rollback()

      const [curOrder] = await tx.select({ value: count() }).from(categories)
      if (newOrder > curOrder.value + 1)
        throw new Error('New order is out of range')

      if (newOrder > model.order) {
        await tx.update(categories).set({ order: sql`(${categories.order} - 1) * 1000` }).where(and(
          eq(categories.groupId, model.groupId),
          gt(categories.order, model.order),
          lte(categories.order, newOrder),
        ))
      }
      else if (newOrder < model.order) {
        await tx.update(categories).set({ order: sql`(${categories.order} + 1) * 1000` }).where(and(
          eq(categories.groupId, model.groupId),
          gte(categories.order, newOrder),
          lt(categories.order, model.order),
        ))
      }

      await tx.update(categories).set({ order: newOrder }).where(eq(categories.slug, model.slug))
      await tx.update(categories).set({ order: sql`${categories.order} / 1000` }).where(gte(categories.order, 1000))
    })
  }

  async update(id: CategoryId, dto: UpdateCategoryDto) {
    return await this.db.transaction(async (tx) => {
      await tx.update(categories)
        .set(categoryDbMapper.toDbUpdateWithoutOrder(categoryDbMapper.toDbUpdate(dto)))
        .where(eq(categories.id, id))
      await this.updateOrder(id, dto.order)
      return await this.getOne(id)
    })
  }

  async delete(id: CategoryId) {
    return await this.db.transaction(async (tx) => {
      const toDelete = await tx.query.groups.findFirst({ where: eq(categories.id, id) })
      if (!toDelete)
        return tx.rollback()

      await tx.delete(categories).where(eq(categories.id, id)).returning()

      const remain = await tx.select(({ ...getTableColumns(categories), newOrder: sql<number>`row_number() over (order by ${categories.order})`.mapWith(Number).as('new_order') })).from(categories)
      await Promise.all(
        remain.map((category) => {
          return tx.update(categories).set({ order: category.newOrder * 1000 }).where(
            eq(categories.id, category.id),
          )
        }),
      )
      await Promise.all(
        remain.map((category) => {
          return tx.update(categories).set({ order: category.newOrder }).where(
            eq(categories.id, category.id),
          )
        }),
      )
    })
  }
}
