import { and, eq, getTableColumns, gt, gte, lt, lte, sql } from 'drizzle-orm'
import { err, ok } from '../shared/result'
import type { Db, DbTransaction } from '../db'
import { projectDbMapper } from './projectDb.repo'
import { type CategoryDbCreate, type CategoryDbDeep, type CategoryDbUpdate, categories } from '~/server/db/schema'
import type { CategoryDto, CategoryId, CreateCategoryDto, ICategoryDbRepo, UpdateCategoryDto } from '~/server/use-cases/types'

export const categoryDbMapper = {
  toDto(db: CategoryDbDeep): CategoryDto {
    return {
      groupId: db.groupId,
      id: db.id,
      title: db.title,
      uri: db.uri,
      order: db.order,
      projects: db.projects.map(projectDbMapper.toDbDto),
    }
  },
  toCreate(dto: CreateCategoryDto, order: number): CategoryDbCreate {
    return {
      groupId: dto.groupId,
      title: dto.title,
      uri: dto.uri,
      order,
    }
  },
  toUpdate(dto: UpdateCategoryDto): CategoryDbUpdate {
    return {
      groupId: dto.groupId,
      id: dto.id,
      title: dto.title,
      uri: dto.uri,
      order: dto.order,
    }
  },
  toUpdateWithoutOrder(db: CategoryDbUpdate): Omit<CategoryDbUpdate, 'order'> {
    const { order: _order, ...toUpdate } = db
    return toUpdate
  },
}

export class CategoryDbRepo implements ICategoryDbRepo {
  constructor(private db: Db) { }

  async getNextOrder(tx?: DbTransaction) {
    const ctx = tx || this.db
    try {
      const count = (await ctx.select().from(categories)).length
      return ok(count + 1)
    }
    catch (_e) {
      return err(new Error(`Cannot get order of new category`))
    }
  }

  async getOne(id: CategoryId, tx?: DbTransaction) {
    const ctx = tx || this.db
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
      })
      if (!res)
        return err(new Error(`Could not find category with id \`${id}\``))
      return ok(categoryDbMapper.toDto(res))
    }
    catch (_e) {
      return err(new Error(`Could not find category with id \`${id}\``))
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
      return ok(res.map(categoryDbMapper.toDto))
    }
    catch (_e) {
      return err(new Error(`Could not get categories`))
    }
  }

  async create(dto: CreateCategoryDto, tx?: DbTransaction) {
    const ctx = tx || this.db
    try {
      return ctx.transaction(async (tx) => {
        const nextOrder = await this.getNextOrder(tx)
        if (!nextOrder.ok)
          return tx.rollback()

        const toCreate = categoryDbMapper.toCreate(dto, nextOrder.value)

        const createdInDb = (await tx.insert(categories).values(toCreate).returning())[0]
        const created = await this.getOne(createdInDb.id, tx)
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

  private async updateOrder(dto: CategoryDto, newOrder: number, tx?: DbTransaction) {
    if (dto.order === newOrder)
      return ok(undefined)

    const ctx = tx || this.db

    try {
      return await ctx.transaction(async (tx) => {
        const nextOrder = await this.getNextOrder()
        if (!nextOrder.ok)
          return tx.rollback()

        if (newOrder > nextOrder.value)
          return tx.rollback()

        if (newOrder > dto.order) {
          await tx.update(categories).set({ order: sql`(${categories.order} - 1) * 1000` }).where(and(
            gt(categories.order, dto.order),
            lte(categories.order, dto.order),
          ))
        }
        else if (newOrder < dto.order) {
          await tx.update(categories).set({ order: sql`(${categories.order} + 1) * 1000` }).where(and(
            gte(categories.order, newOrder),
            lt(categories.order, dto.order),
          ))
        }

        await tx.update(categories).set({ order: dto.order }).where(eq(categories.uri, dto.uri))
        await tx.update(categories).set({ order: sql`${categories.order} / 1000` }).where(gte(categories.order, 1000))
      })
    }
    catch (_e) {
      return err(new Error(`Could not update order of category with id \`${dto.id}\``))
    }
  }

  async update(dto: UpdateCategoryDto, tx?: DbTransaction) {
    const ctx = tx || this.db

    try {
      return await ctx.transaction(async (tx) => {
        const group = await this.getOne(dto.id, tx)
        if (!group.ok)
          return tx.rollback()

        await tx.update(categories)
          .set(categoryDbMapper.toUpdateWithoutOrder(categoryDbMapper.toUpdate(dto)))
          .where(eq(categories.id, dto.id))

        await this.updateOrder(group.value, dto.order, tx)

        const updatedGroup = await this.getOne(dto.id, tx)
        if (!updatedGroup.ok)
          return tx.rollback()

        return ok(updatedGroup.value)
      })
    }
    catch (e) {
      return err(new Error(`Could not update category with id \`${dto.id}\``))
    }
  }

  async delete(id: CategoryId, tx?: DbTransaction) {
    const ctx = tx || this.db
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
