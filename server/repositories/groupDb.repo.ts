import { and, count, eq, getTableColumns, gt, gte, lt, lte, sql } from 'drizzle-orm'

import type { Db } from '~~/server/db'
import type { GroupId } from '~~/server/db/schema'

import { groups } from '~~/server/db/schema'

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
}
