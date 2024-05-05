import { and, eq, getTableColumns, gt, gte, lt, lte, sql } from 'drizzle-orm'
import { err, ok } from '../shared/result'
import type { Db, DbTransaction } from '~/server/db'
import type { ImageDb, ImageDbCreate, ImageDbUpdate } from '~/server/db/schema'
import { images } from '~/server/db/schema'
import type {
  CreateImageDto,
  IImageDbRepo,
  ImageDto,
  ImageId,
  UpdateImageDto,
} from '~/server/use-cases/types'

// !FIX захардкоженый путь
export const imageDbMapper = {
  toDto(db: ImageDb): ImageDto {
    return {
      projectUri: db.projectUrlFriendly,
      id: db.id,
      filename: db.filename,
      url: `/images/projects/${db.projectUrlFriendly}/${db.filename}`,
      alt: db.title || db.filename,
      order: db.order,
    }
  },
  toCreate(dto: CreateImageDto, order: number): ImageDbCreate {
    return {
      projectUrlFriendly: dto.projectUri,
      filename: dto.filename,
      title: dto.alt,
      order,
    }
  },
  toUpdate(dto: UpdateImageDto): ImageDbUpdate {
    return {
      id: dto.id,
      filename: dto.filename,
      title: dto.alt,
      projectUrlFriendly: dto.projectUri,
      order: dto.order,
    }
  },
  toUpdateWithoutOrder(db: ImageDbCreate): Omit<ImageDbCreate, 'order'> {
    const { order: _order, ...toUpdate } = db
    return toUpdate
  },
}

export class ImageDbRepo implements IImageDbRepo {
  constructor(private db: Db) {}

  async getOne(id: ImageId, tx?: DbTransaction) {
    const ctx = tx || this.db
    try {
      const image = await ctx.query.images.findFirst({ where: eq(images.id, id) })
      if (!image)
        return err(new Error(`Image with id \`${id}\` does not exist`))
      return ok(imageDbMapper.toDto(image))
    }
    catch (_e) {
      return err(new Error('oops'))
    }
  }

  async getImages() {
    try {
      return ok((await this.db.select().from(images).orderBy(images.order)).map(imageDbMapper.toDto))
    }
    catch (_e) {
      return err(new Error('oops'))
    }
  }

  async getAllByProjectUri(uri: string) {
    try {
      return ok((await this.db.select().from(images).where(eq(images.projectUrlFriendly, uri))).map(imageDbMapper.toDto))
    }
    catch (_e) {
      return err(new Error('oops'))
    }
  }

  async getNextOrder(projectUri: string, tx: DbTransaction) {
    const ctx = tx || this.db
    try {
      const count = (await ctx.select().from(images).where(eq(images.projectUrlFriendly, projectUri))).length
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
        const nextOrder = await this.getNextOrder(dto.projectUri, tx)
        if (!nextOrder.ok)
          return tx.rollback()

        const toCreate = imageDbMapper.toCreate(dto, nextOrder.value)

        const createdInDb = (await tx.insert(images).values(toCreate).returning())[0]
        const created = await this.getOne(createdInDb.id, tx)
        if (!created.ok)
          return tx.rollback()

        return ok(created.value!)
      })
    }
    catch (e) {
      return err(new Error(`Could not create project`))
    }
  }

  private async updateOrder(dto: ImageDto, newOrder: number, tx?: DbTransaction) {
    if (dto.order === newOrder)
      return ok(undefined)

    const ctx = tx || this.db

    try {
      return await ctx.transaction(async (tx) => {
        const nextOrder = await this.getNextOrder(dto.projectUri, tx)
        if (!nextOrder.ok)
          return err(nextOrder.error)

        if (newOrder > nextOrder.value)
          return err('New order is out of range')

        if (newOrder > dto.order) {
          await tx.update(images).set({ order: sql`(${images.order} - 1) * 1000` }).where(and(
            eq(images.projectUrlFriendly, dto.projectUri),
            gt(images.order, dto.order),
            lte(images.order, dto.order),
          ))
        }
        else if (newOrder < dto.order) {
          await tx.update(images).set({ order: sql`(${images.order} + 1) * 1000` }).where(and(
            eq(images.projectUrlFriendly, dto.projectUri),
            gte(images.order, newOrder),
            lt(images.order, dto.order),
          ))
        }

        await tx.update(images).set({ order: dto.order }).where(eq(images.id, dto.id))
        await tx.update(images).set({ order: sql`${images.order} / 1000` }).where(gte(images.order, 1000))
      })
    }
    catch (_e) {
      return err(new Error(`Could not update order of project with id \`${dto.id}\``))
    }
  }

  async update(dto: UpdateImageDto, tx?: DbTransaction) {
    const ctx = tx || this.db

    try {
      return await ctx.transaction(async (tx) => {
        const image = await this.getOne(dto.id, tx)
        if (!image.ok)
          return tx.rollback()
        await this.updateOrder(image.value, dto.order, tx)

        await tx.update(images)
          .set(imageDbMapper.toUpdateWithoutOrder(imageDbMapper.toUpdate(dto)))
          .where(eq(images.id, dto.id))
        const updatedImage = await this.getOne(dto.id, tx)
        if (!updatedImage.ok)
          return tx.rollback()

        return ok(updatedImage.value)
      })
    }
    catch (e) {
      return err(new Error(`Could not update image with id \`${dto.id}\``))
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
        )).from(images).where(eq(images.projectUrlFriendly, imageToDelete.value.projectUri))

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
