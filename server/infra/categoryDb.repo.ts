import { eq } from 'drizzle-orm'
import { err, ok } from '../shared/result'
import type { Db, DbTransaction } from '../db'
import { projectDbMapper } from './projectDb.repo'
import { type CategoryDbCreate, type CategoryDbDeep, categories, images, projects } from '~/server/db/schema'
import type { CategoryDto, CategoryId, CreateCategoryDto, ICategoryDbRepo, UpdateCategoryDto } from '~/server/use-cases/types'

export const categoryDbMapper = {
  toDto(db: CategoryDbDeep): CategoryDto {
    return {
      groupId: db.groupId,
      id: db.id,
      title: db.title,
      uri: db.urlFriendly,
      order: db.order,
      projects: db.projects.map(projectDbMapper.toDto),
    }
  },
  toCreate(dto: CreateCategoryDto, order: number): CategoryDbCreate {
    return {
      groupId: dto.groupId,
      title: dto.title,
      urlFriendly: dto.uri,
      order,
    }
  },
}

export class CategoryDbRepo implements ICategoryDbRepo {
  constructor(private db: Db) {}

  async getNextOrder(tx?: DbTransaction) {
    const ctx = tx || this.db
    try {
      return ok((await ctx.select().from(categories)).length)
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
                orderBy: images.order,
              },
            },
            orderBy: projects.order,
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
                orderBy: images.order,
              },
            },
            orderBy: projects.order,
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
      })
    }
    catch (e) {
      return err(new Error('oops'))
    }
  }

  async update(_dto: UpdateCategoryDto) {
    return err(new Error('not impl'))
  }

  async delete(_id: CategoryId) {
    return err(new Error('not impl'))
  }
}
