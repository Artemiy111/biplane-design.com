import path from 'node:path'
import { cwd } from 'node:process'
import { eq } from 'drizzle-orm'
import { err, ok } from '../shared/result'
import type { Db } from '~/server/db'
import type { ImageDb } from '~/server/db/schema'
import { images } from '~/server/db/schema'
import type {
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
}

export class ImageDbRepo implements IImageDbRepo {
  constructor(private db: Db) {}

  async getImage(id: ImageId) {
    try {
      const image = await this.db.query.images.findFirst({ where: eq(images.id, id) })
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

  async getImagesByProjectUri(uri: string) {
    try {
      return ok((await this.db.select().from(images).where(eq(images.projectUrlFriendly, uri))).map(imageDbMapper.toDto))
    }
    catch (_e) {
      return err(new Error('oops'))
    }
  }

  async createImage() {
    return Promise.resolve(err(new Error('not impl')))
  }

  async updateImage(_dto: UpdateImageDto) {
    return Promise.resolve(err(new Error('not impl')))
  }

  async deleteImage(_id: ImageId) {
    return Promise.resolve(err(new Error('not impl')))
  }
}
