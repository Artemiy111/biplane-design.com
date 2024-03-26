import path from 'node:path'
import { cwd } from 'node:process'
import { eq } from 'drizzle-orm'
import { db } from '~/server/db'
import type { ImageDb } from '~/server/db/schema'
import { images } from '~/server/db/schema'
import type {
  DeleteImage,
  GetImages,
  GetImagesByProjectUri,
  IImageFsRepo,
  ImageDto,
  ImageId,
  UpdateImage,
  UpdateImageDto,
} from '~/server/use-cases/types'

const PROJECTS_DIR = path.join(cwd(), 'public/images/projects')

export const imageDbMapper = {
  toDto(db: ImageDb): ImageDto {
    return {
      projectUri: db.projectUrlFriendly,
      id: db.id,
      filename: db.filename,
      url: `${PROJECTS_DIR}/${db.projectUrlFriendly}/${db.filename}`,
      alt: db.title || db.filename,
      order: db.order,
    }
  },
}

export const getImages: GetImages = async () => {
  return (await db.select().from(images).orderBy(images.order)).map(imageDbMapper.toDto)
}

export const getImagesByProjectUri: GetImagesByProjectUri = async (uri: string) => {
  return (
    await db.select().from(images).where(eq(images.projectUrlFriendly, uri)).orderBy(images.order)
  ).map(imageDbMapper.toDto)
}

export const updateImage: UpdateImage = async (dto: UpdateImageDto) => {}

export const deleteImage: DeleteImage = async (id: ImageId) => {}
