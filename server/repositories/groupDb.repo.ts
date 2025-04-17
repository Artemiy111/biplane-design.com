import { eq } from 'drizzle-orm'

import type { GroupId } from '~~/server/db/schema'

import { db } from '~~/server/db'
import { groups } from '~~/server/db/schema'

class GroupDbRepo {
  async getOne(id: GroupId) {
    const model
      = await db.query.groups.findFirst({
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
    return await db.query.groups.findMany({
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
}

export const groupDbRepo = new GroupDbRepo()
