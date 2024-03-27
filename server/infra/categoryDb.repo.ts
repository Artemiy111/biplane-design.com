import { eq } from 'drizzle-orm'
import { err, ok } from '../shared/result'
import type { Db } from '../db'
import { projectDbMapper } from './projectDb.repo'
import { type CategoryDbDeep, categories, images, projects } from '~/server/db/schema'
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
}

export class CategoryDbRepo implements ICategoryDbRepo {
  constructor(private db: Db) {}

  async getCategory(id: CategoryId) {
    try {
      const res = await this.db.query.categories.findFirst({
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

  async getCategories() {
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

  async createCategory(_dto: CreateCategoryDto) {
    return err(new Error('not impl'))
  }

  async updateCategory(_dto: UpdateCategoryDto) {
    return err(new Error('not impl'))
  }

  async deleteCategory(_id: CategoryId) {
    return err(new Error('not impl'))
  }
}
