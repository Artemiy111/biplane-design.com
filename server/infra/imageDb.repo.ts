import path from 'node:path'
import { cwd } from 'node:process'
import { eq } from 'drizzle-orm'
import { err, ok } from '../shared/result'
import type { Db, DbTransaction } from '~/server/db'
import type { ImageDb, ImageDbCreate, ImageDbUpdate } from '~/server/db/schema'
import { images } from '~/server/db/schema'
import type {
  CreateImageDto,
  IImageDbRepo,
  IImageFsRepo,
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
  toCreate(dto: CreateImageDto, order: number): ImageDbCreate  {
    return {
      'projectUrlFriendly': dto.projectUri,
      'filename': dto.filename,
      'title': dto.alt,
      order
    }
  },
  toUpdate(dto: UpdateImageDto): ImageDbUpdate {
    return {
      'id': dto.id,
      'filename': dto.filename,
      'title': dto.alt,
      'projectUrlFriendly': dto.projectUri,
      order: dto.order
    }
  }
}

export class ImageDbRepo implements IImageDbRepo {
  constructor(private db: Db) {}

  async getOne(id: ImageId, tx?:DbTransaction) {
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

  async create(dto: CreateImageDto, tx?:DbTransaction) {
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

  async update(_dto: UpdateImageDto) {
    return Promise.resolve(err(new Error('not impl')))
  }

  async delete(_id: ImageId) {
    return Promise.resolve(err(new Error('not impl')))
  }
}
