import { and, count, eq, getTableColumns, gt, gte, lt, lte, sql } from 'drizzle-orm'
import { imageDbMapper } from '../mappers/imageDb.mapper'
import type { Db } from '~/server/db'
import type { ImageDbCreate, ImageDbUpdate, ImageId, ProjectId } from '~/server/db/schema'
import { images } from '~/server/db/schema'

export class ImageDbRepo {
  constructor(private db: Db) { }

  async getOne(id: ImageId) {
    const model = await this.db.query.images.findFirst({ where: eq(images.id, id) })
    if (!model) throw new Error(`Could not get image with id '${id}'`)
    return model
  }

  async getAll() {
    return await this.db.select().from(images).orderBy(images.order)
  }

  async getAllByProjectId(projectId: ProjectId) {
    return await this.db.select().from(images).orderBy(images.order).where(eq(images.projectId, projectId))
  }

  async create(create: ImageDbCreate) {
    return this.db.transaction(async (tx) => {
      const [created] = await tx.insert(images).values({ ...create, order: 999 }).returning()
      const [curOrder] = await tx.select({ value: count() }).from(images).where(eq(images.projectId, create.projectId))
      await tx.update(images).set({ order: curOrder.value }).where(eq(images.id, created.id)).returning()
      const returned = await tx.query.images.findFirst({ where: eq(images.id, create.id) })
      return returned!
    }, {
      deferrable: true,
      isolationLevel: 'read uncommitted',
    })
  }

  private async updateOrder(id: ImageId, newOrder: number) {
    return await this.db.transaction(async (tx) => {
      const model = await tx.query.images.findFirst({ where: eq(images.id, id) })
      if (!model) throw tx.rollback()
      if (model.order === newOrder) return
      const [curOrder] = await tx.select({ value: count() }).from(images).where(eq(images.projectId, model.projectId))
      if (newOrder > curOrder.value + 1)
        throw new Error('New order is out of range')

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
    })
  }

  async update(id: ImageId, update: ImageDbUpdate) {
    return await this.db.transaction(async (tx) => {
      await this.updateOrder(id, update.order)
      await tx.update(images)
        .set(imageDbMapper.toDbUpdateWithoutOrder(update))
        .where(eq(images.id, id)).returning()
      const returned = await tx.query.images.findFirst({ where: eq(images.id, id) })
      return returned!
    })
  }

  async delete(id: ImageId) {
    return await this.db.transaction(async (tx) => {
      const imageToDelete = await this.getOne(id)

      await this.db.delete(images).where(eq(images.id, id))

      const remainImages = await tx.select((
        { ...getTableColumns(images), newOrder: sql<number>`row_number() over (order by ${images.order})`.mapWith(Number).as('new_order') }
      )).from(images).where(eq(images.projectId, imageToDelete.projectId))

      await Promise.all(
        remainImages.map((img) => {
          return tx.update(images).set({ order: img.newOrder * 1000 }).where(
            eq(images.id, img.id),
          )
        }),
      )

      await Promise.all(
        remainImages.map((img) => {
          return tx.update(images).set({ order: img.newOrder }).where(
            eq(images.id, img.id),
          )
        }),
      )
    })
  }
}
