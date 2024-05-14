import { and, eq, getTableColumns, gt, gte, lt, lte, sql } from 'drizzle-orm'
import { err, ok } from '../shared/result'
import type { Db, DbTransaction } from '~/server/db'
import type { ImageDb, ImageDbCreate, ImageDbUpdate } from '~/server/db/schema'
import { images } from '~/server/db/schema'
import type {
  CreateImageDto,
  IImageDbRepo,
  ImageDbDto,
  ImageId,
  ProjectId,
  UpdateImageDto,
} from '~/server/use-cases/types'

export const imageDbMapper = {
  toDb(db: ImageDb): ImageDbDto {
    return {
      projectId: db.projectId,
      id: db.id,
      filename: db.filename,
      order: db.order,
      alt: db.alt,
    }
  },
  toDbCreate(dto: CreateImageDto, order: number): ImageDbCreate {
    return {
      projectId: dto.projectId,
      filename: dto.filename,
      alt: dto.alt,
      order,
    }
  },
  toDbUpdate(dto: UpdateImageDto): ImageDbUpdate {
    return {
      id: dto.id,
      filename: dto.filename,
      alt: dto.alt,
      order: dto.order,
    }
  },
  toDbUpdateWithoutOrder(db: ImageDbUpdate): Omit<ImageDbUpdate, 'order'> {
    const { order: _order, ...toUpdate } = db
    return toUpdate
  },
}

export class ImageDbRepo implements IImageDbRepo {
  constructor(private db: Db) { }

  async getOne(id: ImageId, tx?: DbTransaction) {
    const ctx = tx || this.db
    try {
      const image = await ctx.query.images.findFirst({ where: eq(images.id, id) })
      if (!image)
        return err(new Error(`Image with id \`${id}\` does not exist`))
      return ok(image)
    }
    catch (_e) {
      return err(new Error(`Could not get image with id \`${id}\``))
    }
  }

  async getOneByFilename(filename: string, tx?: DbTransaction) {
    const ctx = tx || this.db
    try {
      const image = await ctx.query.images.findFirst({ where: eq(images.filename, filename) })
      if (!image)
        return err(new Error(`Image with filename \`${filename}\` does not exist`))
      return ok(image)
    }
    catch (_e) {
      return err(new Error(`Could not get image with filename \`${filename}\``))
    }
  }

  async getAll() {
    try {
      const all = (await this.db.select().from(images).orderBy(images.order)).map(imageDbMapper.toDb)
      return ok(all)
    }
    catch (_e) {
      return err(new Error('Could not get all images'))
    }
  }

  async getAllByProjectId(projectId: ProjectId) {
    try {
      const all = (await this.db.select().from(images).orderBy(images.order).where(eq(images.projectId, projectId))).map(imageDbMapper.toDb)
      return ok(all)
    }
    catch (_e) {
      return err(new Error(`Could not get images by project with id \`${projectId}\``))
    }
  }

  async getNextOrder(projectId: ProjectId, tx: DbTransaction) {
    const ctx = tx || this.db
    try {
      const count = (await ctx.select().from(images).where(eq(images.projectId, projectId))).length
      return ok(count + 1)
    }
    catch (e) {
      return err(new Error(`Could not get next order of image`))
    }
  }

  async create(dto: CreateImageDto, tx?: DbTransaction) {
    const ctx = tx || this.db

    try {
      return ctx.transaction(async (tx) => {
        const nextOrder = await this.getNextOrder(dto.projectId, tx)
        if (!nextOrder.ok)
          return tx.rollback()

        const toCreate = imageDbMapper.toDbCreate(dto, nextOrder.value)

        const createdInDb = (await tx.insert(images).values(toCreate).returning())[0]
        const created = await this.getOne(createdInDb.id, tx)
        if (!created.ok)
          return tx.rollback()

        return ok(created.value!)
      })
    }
    catch (e) {
      return err(new Error(`Could not create image`))
    }
  }

  private async updateOrder(dto: ImageDbDto, newOrder: number, tx?: DbTransaction) {
    if (dto.order === newOrder)
      return ok(undefined)

    const ctx = tx || this.db

    try {
      return await ctx.transaction(async (tx) => {
        const nextOrder = await this.getNextOrder(dto.projectId, tx)
        if (!nextOrder.ok)
          return nextOrder

        if (newOrder > nextOrder.value)
          return err(new Error('New order is out of range'))

        if (newOrder > dto.order) {
          await tx.update(images).set({ order: sql`(${images.order} - 1) * 1000` }).where(and(
            eq(images.projectId, dto.projectId),
            gt(images.order, dto.order),
            lte(images.order, newOrder),
          ))
        }
        else if (newOrder < dto.order) {
          await tx.update(images).set({ order: sql`(${images.order} + 1) * 1000` }).where(and(
            eq(images.projectId, dto.projectId),
            gte(images.order, newOrder),
            lt(images.order, dto.order),
          ))
        }

        await tx.update(images).set({ order: newOrder }).where(eq(images.id, dto.id))
        await tx.update(images).set({ order: sql`${images.order} / 1000` }).where(gte(images.order, 1000))
        return ok(undefined)
      })
    }
    catch (_e) {
      return err(new Error(`Could not update order of image with id \`${dto.id}\``))
    }
  }

  async update(dto: UpdateImageDto, tx?: DbTransaction) {
    const ctx = tx || this.db

    try {
      return await ctx.transaction(async (tx) => {
        const image = await this.getOne(dto.id, tx)
        if (!image.ok) {
          return image
        }

        const orderUpdated = await this.updateOrder(image.value, dto.order, tx)
        if (!orderUpdated.ok) {
          return tx.rollback()
        }

        await tx.update(images)
          .set(imageDbMapper.toDbUpdateWithoutOrder(dto))
          .where(eq(images.id, dto.id))
        const updatedImage = await this.getOne(dto.id, tx)
        if (!updatedImage.ok)
          return tx.rollback()

        return ok(updatedImage.value)
      })
    }
    catch (_e) {
      const error = _e as Error
      return err(new Error(`Could not update image with id \`${dto.id}\`: ${error.message}`))
    }
  }

  async delete(id: ImageId, tx?: DbTransaction) {
    const ctx = tx || this.db

    try {
      return await ctx.transaction(async (tx) => {
        const imageToDelete = await this.getOne(id, tx)
        if (!imageToDelete.ok)
          throw tx.rollback()

        await this.db.delete(images).where(eq(images.id, id))

        const remainImages = await tx.select((
          { ...getTableColumns(images), newOrder: sql<number>`row_number() over (order by ${images.order})`.mapWith(Number).as('new_order') }
        )).from(images).where(eq(images.projectId, imageToDelete.value.projectId))

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
        return ok(undefined)
      })
    }
    catch (_e) {
      return err(new Error(`Could not delete image with id \`${id}\``))
    }
  }
}
