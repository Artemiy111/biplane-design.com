import { DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3'
import { and, count, eq, gt, gte, lt, lte, sql } from 'drizzle-orm'

import type { ProjectDb, ProjectId } from '../db/schema'
import type { CreateProjectDto, ProjectDto, UpdateProjectDto } from '../types'

import { db, type DbTransaction } from '../db'
import { projects } from '../db/schema'
import { env } from '../utils/env'
import { s3 } from '../utils/s3'
import { imageExtras } from './image.repo'

class ProjectRepo {
  async getOne(id: ProjectId): Promise<ProjectDto> {
    const model = await db.query.projects.findFirst({
      where: eq(projects.id, id),
      with: {
        images: {
          extras: imageExtras,
          orderBy: images => images.order,
        },
      },
    })
    if (!model) throw new Error(`Could not get project with id '${id}'`)
    return model
  }

  async getOneBySlug(slug: string): Promise<ProjectDto> {
    const model = await db.query.projects.findFirst({
      where: eq(projects.slug, slug),
      with: {
        images: {
          extras: imageExtras,
          orderBy: images => images.order,
        },
      },
    })
    if (!model) throw new Error(`Could not get project with slug '${slug}'`)
    return model
  }

  async getAll(): Promise<ProjectDto[]> {
    return db.query.projects.findMany({
      with: {
        images: {
          extras: imageExtras,
          orderBy: images => images.order,
        },
      },
      orderBy: projects => projects.order,
    })
  }

  async create(dto: CreateProjectDto): Promise<ProjectDto> {
    const created = await db.transaction(async (tx) => {
      const [row] = await tx.select({ value: count() }).from(projects).where(eq(projects.categoryId, dto.categoryId))
      const [model] = await tx.insert(projects)
        .values({ ...dto, order: (row?.value ?? 0) + 1 })
        .returning()

      if (!model) throw new Error('Could not create project')
      return model
    })

    return this.getOne(created.id)
  }

  async update(id: ProjectId, dto: UpdateProjectDto): Promise<ProjectDto> {
    await db.transaction(async (tx) => {
      const model = await tx.query.projects.findFirst({ where: eq(projects.id, id) })
      if (!model) throw new Error(`Could not get project with id '${id}'`)

      const { id: _id, order: _order, ...fields } = dto

      if (dto.categoryId === model.categoryId) {
        await this.move(tx, model, dto.order)
        await tx.update(projects).set(fields).where(eq(projects.id, id))
        return
      }

      const [row] = await tx.select({ value: count() }).from(projects).where(eq(projects.categoryId, dto.categoryId))
      await tx.update(projects)
        .set({ ...fields, order: (row?.value ?? 0) + 1 })
        .where(eq(projects.id, id))

      await tx.update(projects)
        .set({ order: sql`(${projects.order} - 1) * 1000` })
        .where(and(eq(projects.categoryId, model.categoryId), gt(projects.order, model.order)))
      await tx.update(projects)
        .set({ order: sql`${projects.order} / 1000` })
        .where(and(eq(projects.categoryId, model.categoryId), gte(projects.order, 1000)))
    })

    return this.getOne(id)
  }

  async updateOrder(id: ProjectId, newOrder: number): Promise<void> {
    await db.transaction(async (tx) => {
      const model = await tx.query.projects.findFirst({ where: eq(projects.id, id) })
      if (!model) throw new Error(`Could not get project with id '${id}'`)

      await this.move(tx, model, newOrder)
    })
  }

  async delete(id: ProjectId): Promise<void> {
    const model = await db.query.projects.findFirst({ where: eq(projects.id, id) })
    if (!model) return

    await this.deleteImagesDir(id)

    await db.transaction(async (tx) => {
      await tx.delete(projects).where(eq(projects.id, id))
      await tx.update(projects)
        .set({ order: sql`(${projects.order} - 1) * 1000` })
        .where(and(eq(projects.categoryId, model.categoryId), gt(projects.order, model.order)))
      await tx.update(projects)
        .set({ order: sql`${projects.order} / 1000` })
        .where(and(eq(projects.categoryId, model.categoryId), gte(projects.order, 1000)))
    })
  }

  private async move(tx: DbTransaction, model: ProjectDb, newOrder: number) {
    if (model.order === newOrder) return

    const [row] = await tx.select({ value: count() }).from(projects).where(eq(projects.categoryId, model.categoryId))
    if (newOrder > (row?.value ?? 0)) throw new Error('New order is out of range')

    if (newOrder > model.order) {
      await tx.update(projects).set({ order: sql`(${projects.order} - 1) * 1000` }).where(and(
        eq(projects.categoryId, model.categoryId),
        gt(projects.order, model.order),
        lte(projects.order, newOrder),
      ))
    }
    else {
      await tx.update(projects).set({ order: sql`(${projects.order} + 1) * 1000` }).where(and(
        eq(projects.categoryId, model.categoryId),
        gte(projects.order, newOrder),
        lt(projects.order, model.order),
      ))
    }

    await tx.update(projects).set({ order: newOrder }).where(eq(projects.id, model.id))
    await tx.update(projects)
      .set({ order: sql`${projects.order} / 1000` })
      .where(and(eq(projects.categoryId, model.categoryId), gte(projects.order, 1000)))
  }

  private async deleteImagesDir(projectId: ProjectId): Promise<void> {
    const list = await s3.send(new ListObjectsV2Command({
      Bucket: env.BUCKET_NAME,
      Prefix: `${projectId}/`,
    }))

    const keys = (list.Contents ?? []).flatMap(object => object.Key ? [object.Key] : [])
    await Promise.all(keys.map(Key => s3.send(new DeleteObjectCommand({
      Bucket: env.BUCKET_NAME,
      Key,
    }))))
  }
}

export const projectRepo = new ProjectRepo()
