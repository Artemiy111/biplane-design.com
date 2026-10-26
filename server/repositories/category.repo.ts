import { eq } from 'drizzle-orm'

import type { CategoryId } from '../db/schema'
import type { CategoryDto } from '../types'

import { db } from '../db'
import { categories } from '../db/schema'
import { imageExtras } from './image.repo'

class CategoryRepo {
  async getOne(id: CategoryId): Promise<CategoryDto> {
    const model = await db.query.categories.findFirst({
      where: eq(categories.id, id),
      with: {
        projects: {
          with: {
            images: {
              extras: imageExtras,
              orderBy: images => images.order,
            },
          },
          orderBy: projects => projects.order,
        },
      },
    })
    if (!model) throw new Error(`Could not find category with id '${id}'`)
    return model
  }

  async getAll(): Promise<CategoryDto[]> {
    return db.query.categories.findMany({
      with: {
        projects: {
          with: {
            images: {
              extras: imageExtras,
              orderBy: images => images.order,
            },
          },
          orderBy: projects => projects.order,
        },
      },
      orderBy: categories => categories.order,
    })
  }
}

export const categoryRepo = new CategoryRepo()
