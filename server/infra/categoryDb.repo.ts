import { and, eq, getTableColumns, gt, gte, lt, lte, sql } from 'drizzle-orm'
import { err, ok } from '../shared/result'
import type { Db } from '../db'
import { projectDbMapper } from './projectDb.repo'
import { type CategoryDbCreate, type CategoryDbDeep, type CategoryDbUpdate, categories } from '~/server/db/schema'
import type { CategoryDbDto, CategoryId, CreateCategoryDto, ICategoryDbRepo, UpdateCategoryDto, GroupId } from '~/server/use-cases/types'

export const categoryDbMapper = {
  toDb(db: CategoryDbDeep): CategoryDbDto {
    return {
      groupId: db.groupId,
      id: db.id,
      title: db.title,
      uri: db.uri,
      order: db.order,
      projects: db.projects.map(projectDbMapper.toDb),
    }
  },
  toDbCreate(dto: CreateCategoryDto, order: number): CategoryDbCreate {
    return {
      groupId: dto.groupId,
      title: dto.title,
      uri: dto.uri,
      order,
    }
  },
  toDbUpdate(dto: UpdateCategoryDto): CategoryDbUpdate {
    return {
      id: dto.id,
      title: dto.title,
      uri: dto.uri,
      order: dto.order,
    }
  },
  toDbUpdateWithoutOrder(db: CategoryDbUpdate): Omit<CategoryDbUpdate, 'order'> {
    const { order: _order, ...toUpdate } = db
    return toUpdate
  },
}

export class CategoryDbRepo implements ICategoryDbRepo {
  constructor(private db: Db) { }

  async getNextOrder(groupId: GroupId) {
    const ctx = this.db
    try {
      const count = (await ctx.select().from(categories).where(eq(categories.groupId, groupId))).length
      return ok(count + 1)
    }
    catch (_e) {
      return err(new Error(`Cannot get order of new category`))
    }
  }

  async getOne(id: CategoryId) {
    const ctx = this.db
    try {
      const res = await ctx.query.categories.findFirst({
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
      if (!res)
        return err(new Error(`Could not find category with id \`${id}\``))
      return ok(categoryDbMapper.toDb(res))
    }
    catch (_e) {
      return err(new Error(`Could not find category with id \`${id}\``))
    }
  }

  async getByGroupId(groupId: GroupId) {
    try {
      const res = await this.db.query.categories.findMany({
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
      return ok(res.map(categoryDbMapper.toDb))
    }
    catch (_e) {
      return err(new Error(`Could not get categories`))
    }
  }

  async getAll() {
    try {
      const res = await this.db.query.categories.findMany({
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
      return ok(res.map(categoryDbMapper.toDb))
    }
    catch (_e) {
      return err(new Error(`Could not get categories`))
    }
  }

  async create(dto: CreateCategoryDto) {
    const ctx = this.db
    try {
      return ctx.transaction(async (tx) => {
        const nextOrder = await this.getNextOrder(dto.groupId)
        if (!nextOrder.ok)
          return tx.rollback()

        const toCreate = categoryDbMapper.toDbCreate(dto, nextOrder.value)
        const createdInDb = (await tx.insert(categories).values(toCreate).returning())[0]
        const created = await this.getOne(createdInDb.id)
        if (!created.ok)
          return tx.rollback()

        return ok(created.value!)
      }, {
        isolationLevel: 'read committed',
      })
    }
    catch (e) {
      return err(new Error(`Could not create category`))
    }
  }

  private async updateOrder(dto: CategoryDbDto, newOrder: number) {
    if (dto.order === newOrder)
      return ok(undefined)

    const ctx = this.db

    try {
      return await ctx.transaction(async (tx) => {
        const nextOrder = await this.getNextOrder(dto.groupId)
        if (!nextOrder.ok)
          return newOrder

        if (newOrder > nextOrder.value)
          return err(new Error('New order is out of range'))

        if (newOrder > dto.order) {
          await tx.update(categories).set({ order: sql`(${categories.order} - 1) * 1000` }).where(and(
            eq(categories.groupId, dto.groupId),
            gt(categories.order, dto.order),
            lte(categories.order, newOrder),
          ))
        }
        else if (newOrder < dto.order) {
          await tx.update(categories).set({ order: sql`(${categories.order} + 1) * 1000` }).where(and(
            eq(categories.groupId, dto.groupId),
            gte(categories.order, newOrder),
            lt(categories.order, dto.order),
          ))
        }

        await tx.update(categories).set({ order: newOrder }).where(eq(categories.uri, dto.uri))
        await tx.update(categories).set({ order: sql`${categories.order} / 1000` }).where(gte(categories.order, 1000))
        return ok(undefined)
      })
    }
    catch (_e) {
      return err(new Error(`Could not update order of category with id \`${dto.id}\``))
    }
  }

  async update(dto: UpdateCategoryDto) {
    const ctx = this.db

    try {
      return await ctx.transaction(async (tx) => {
        const category = await this.getOne(dto.id)
        if (!category.ok)
          return category

        await tx.update(categories)
          .set(categoryDbMapper.toDbUpdateWithoutOrder(categoryDbMapper.toDbUpdate(dto)))
          .where(eq(categories.id, dto.id))

        await this.updateOrder(category.value, dto.order)

        const updatedGroup = await this.getOne(dto.id)
        if (!updatedGroup.ok)
          return tx.rollback()

        return ok(updatedGroup.value)
      })
    }
    catch (e) {
      return err(new Error(`Could not update category with id \`${dto.id}\``))
    }
  }

  async delete(id: CategoryId) {
    const ctx = this.db
    try {
      return await ctx.transaction(async (tx) => {
        const toDelete = await tx.query.groups.findFirst({ where: eq(categories.id, id) })
        if (!toDelete)
          return tx.rollback()

        const deletedInDb = (await tx.delete(categories).where(eq(categories.id, id)).returning())[0]
        if (!deletedInDb)
          return tx.rollback()

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
        return ok(undefined)
      })
    }
    catch (_e) {
      return err(new Error(`Could not delete group with id \`${id}\``))
    }
  }
}
