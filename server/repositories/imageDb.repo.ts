import { and, count, eq, gt, gte, lt, lte, sql } from 'drizzle-orm'

import type { ImageDbCreate, ImageDbUpdate, ImageId, ProjectId } from '~~/server/db/schema'

import { db } from '~~/server/db'
import { images } from '~~/server/db/schema'

import { imageDbMapper } from '../mappers/imageDb.mapper'

class ImageDbRepo {
  async getOne(id: ImageId) {
    const model = await db.query.images.findFirst({
      where: eq(images.id, id),
    })
    if (!model) throw new Error(`Could not get image with id '${id}'`)
    return model
  }

  async getAll() {
    return await db.select().from(images).orderBy(images.order)
  }

  async getAllByProjectId(projectId: ProjectId) {
    return await db.select().from(images).orderBy(images.order).where(eq(images.projectId, projectId))
  }

  async create(create: ImageDbCreate) {
    return db.transaction(async (tx) => {
      const [created] = await tx.insert(images).values({ ...create, order: 999 }).returning()
      const [curOrder] = await tx.select({ value: count() }).from(images).where(eq(images.projectId, create.projectId))
      await tx.update(images).set({ order: curOrder.value }).where(eq(images.id, created.id)).returning()
      const returned = await tx.query.images.findFirst({ where: eq(images.id, create.id) })
      return returned!
    }, {
      // deferrable: true,
      // isolationLevel: 'read uncommitted',
    })
  }

  private async updateOrder(id: ImageId, newOrder: number) {
    console.log('start order')

    return await db.transaction(async (tx) => {
      console.log('tx')
      const model = await tx.query.images.findFirst({ where: eq(images.id, id) })
      console.log('model', model)
      // console.log('updated order', model.order, newOrder)
      if (!model) throw tx.rollback()
      if (model.order === newOrder) return
      // const [curOrder] = await tx.select({ value: count() }).from(images).where(eq(images.projectId, model.projectId))
      // if (newOrder > curOrder.value + 1)
      //   throw new Error('New order is out of range')
      // await tx.update(images).set({ order: 999 }).where(eq(images.id, id))

      if (newOrder > model.order) {
        await tx.update(images).set({ order: sql`(${images.order} - 1) * 1000` }).where(and(
          eq(images.projectId, model.projectId),
          gt(images.order, model.order),
          lte(images.order, newOrder),
        ))
      }
      else if (newOrder < model.order) {
        await tx.update(images).set({ order: sql`(${images.order} + 1) * 1000` }).where(and(
          eq(images.projectId, model.projectId),
          gte(images.order, newOrder),
          lt(images.order, model.order),
        ))
      }
      await tx.update(images).set({ order: newOrder }).where(eq(images.id, id))
      await tx.update(images).set({ order: sql`${images.order} / 1000` }).where(gte(images.order, 1000))
    }, {
      behavior: 'deferred',
      // deferrable: true,
      // isolationLevel: 'read uncommitted',
    })
  }

  async update(id: ImageId, update: ImageDbUpdate) {
    return await db.transaction(async (tx) => {
      await this.updateOrder(id, update.order)
      await tx.update(images)
        .set(imageDbMapper.toDbUpdateWithoutOrder(update))
        .where(eq(images.id, id)).returning()
      const returned = await tx.query.images.findFirst({ where: eq(images.id, id) })
      return returned!
    })
  }

  async delete(id: ImageId) {
    return await db.transaction(async (tx) => {
      const toDelete = await tx.query.images.findFirst({ where: eq(images.id, id) })
      if (!toDelete) throw tx.rollback()
      await tx.delete(images).where(eq(images.id, id))
      await tx.update(images).set({ order: sql`(${images.order} - 1) * 1000` }).where(and(eq(images.projectId, toDelete.projectId), gt(images.order, toDelete.order)))
      await tx.update(images).set({ order: sql`${images.order} / 1000` }).where(and(eq(images.projectId, toDelete.projectId), gte(images.order, 1000)))
    }, {
      // deferrable: true,
      // isolationLevel: 'read uncommitted',
    })
  }
}

export const imageDbRepo = new ImageDbRepo()
