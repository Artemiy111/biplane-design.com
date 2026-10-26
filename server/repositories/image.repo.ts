import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { and, count, eq, gt, gte, lt, lte, sql } from 'drizzle-orm'

import type { ImageDb, ImageId, ProjectId } from '../db/schema'
import type { CreateImageDto, ImageDto, UpdateImageDto } from '../types'

import { db, type DbTransaction } from '../db'
import { images } from '../db/schema'
import { env } from '../utils/env'
import { s3 } from '../utils/s3'

export const imageExtras = {
  url: sql<string>`${env.ENDPOINT_URL} || '/' || ${env.BUCKET_NAME} || '/' || ${images.projectId} || '/' || ${images.id}`.as('url'),
}

const getKey = (projectId: ProjectId, filename: string) => `${projectId}/${filename}`

class ImageRepo {
  async getOne(id: ImageId): Promise<ImageDto> {
    const model = await db.query.images.findFirst({
      where: eq(images.id, id),
      extras: imageExtras,
    })
    if (!model) throw new Error(`Could not get image with id '${id}'`)
    return model
  }

  async create(dto: CreateImageDto): Promise<ImageDto> {
    const filename = `${crypto.randomUUID()}.${dto.file.type.split('/').at(-1)}`

    await s3.send(new PutObjectCommand({
      Bucket: env.BUCKET_NAME,
      Key: getKey(dto.projectId, filename),
      Body: Buffer.from(await dto.file.arrayBuffer()),
      ContentType: dto.file.type,
    }))

    await db.transaction(async (tx) => {
      const [row] = await tx.select({ value: count() }).from(images).where(eq(images.projectId, dto.projectId))
      await tx.insert(images).values({
        id: filename,
        projectId: dto.projectId,
        alt: dto.file.name,
        fit: dto.fit,
        order: (row?.value ?? 0) + 1,
      })
    })

    return this.getOne(filename)
  }

  async update(id: ImageId, dto: UpdateImageDto): Promise<ImageDto> {
    await db.transaction(async (tx) => {
      const model = await tx.query.images.findFirst({ where: eq(images.id, id) })
      if (!model) throw new Error(`Could not get image with id '${id}'`)

      await this.move(tx, model, dto.order)
      await tx.update(images).set({ alt: dto.alt, fit: dto.fit }).where(eq(images.id, id))
    })

    return this.getOne(id)
  }

  async delete(id: ImageId): Promise<void> {
    const model = await db.query.images.findFirst({ where: eq(images.id, id) })
    if (!model) return

    await s3.send(new DeleteObjectCommand({
      Bucket: env.BUCKET_NAME,
      Key: getKey(model.projectId, model.id),
    }))

    await db.transaction(async (tx) => {
      await tx.delete(images).where(eq(images.id, id))
      await tx.update(images)
        .set({ order: sql`(${images.order} - 1) * 1000` })
        .where(and(eq(images.projectId, model.projectId), gt(images.order, model.order)))
      await tx.update(images)
        .set({ order: sql`${images.order} / 1000` })
        .where(and(eq(images.projectId, model.projectId), gte(images.order, 1000)))
    })
  }

  private async move(tx: DbTransaction, model: ImageDb, newOrder: number) {
    if (model.order === newOrder) return

    if (newOrder > model.order) {
      await tx.update(images).set({ order: sql`(${images.order} - 1) * 1000` }).where(and(
        eq(images.projectId, model.projectId),
        gt(images.order, model.order),
        lte(images.order, newOrder),
      ))
    }
    else {
      await tx.update(images).set({ order: sql`(${images.order} + 1) * 1000` }).where(and(
        eq(images.projectId, model.projectId),
        gte(images.order, newOrder),
        lt(images.order, model.order),
      ))
    }

    await tx.update(images).set({ order: newOrder }).where(eq(images.id, model.id))
    await tx.update(images)
      .set({ order: sql`${images.order} / 1000` })
      .where(and(eq(images.projectId, model.projectId), gte(images.order, 1000)))
  }
}

export const imageRepo = new ImageRepo()
