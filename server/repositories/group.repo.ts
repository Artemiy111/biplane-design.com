import { eq } from 'drizzle-orm'

import type { GroupId } from '../db/schema'
import type { GroupDto } from '../types'

import { db } from '../db'
import { groups } from '../db/schema'
import { imageExtras } from './image.repo'

class GroupRepo {
  async getOne(id: GroupId): Promise<GroupDto> {
    const model = await db.query.groups.findFirst({
      where: eq(groups.id, id),
      with: {
        categories: {
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
        },
      },
    })
    if (!model) throw new Error(`Group with id '${id}' does not exist`)
    return model
  }

  async getAll(): Promise<GroupDto[]> {
    return db.query.groups.findMany({
      with: {
        categories: {
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
        },
      },
      orderBy: groups => groups.order,
    })
  }
}

export const groupRepo = new GroupRepo()
