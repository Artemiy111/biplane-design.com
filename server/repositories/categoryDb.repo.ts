import { eq } from 'drizzle-orm'

import type { CategoryId, GroupId } from '~~/server/db/schema'

import { categories } from '~~/server/db/schema'

import { db } from '../db'

class CategoryDbRepo {
  async getOne(id: CategoryId) {
    const model = await db.query.categories.findFirst({
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
    const model = await db.query.categories.findMany({
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
    const models = await db.query.categories.findMany({
      with: {
        group: true,
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
}

export const categoryDbRepo = new CategoryDbRepo()
