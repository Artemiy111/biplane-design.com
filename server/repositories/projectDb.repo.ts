import { and, count, eq, gt, gte, lt, lte, sql } from 'drizzle-orm'

import type { CategoryId, ProjectDb, ProjectDbUpdate, ProjectId } from '~~/server/db/schema'
import type { CreateProjectDto } from '~~/server/use-cases/types'

import { projects } from '~~/server/db/schema'

import type { Db } from '../db'

import { projectDbMapper } from '../mappers/projectDb.mapper'

export class ProjectDbRepo {
  constructor(private db: Db) { }

  async getOne(id: ProjectId): Promise<ProjectDb> {
    const model = await this.db.query.projects.findFirst({
      where: eq(projects.id, id), with: {
        images: {
          orderBy: images => images.order,
        },
      },
    })
    if (!model) throw new Error(`Could not get project with id '${id}'`)
    return model
  }

  async getOneByUri(uri: string) {
    const model = await this.db.query.projects.findFirst({
      where: eq(projects.uri, uri), with: {
        images: {
          orderBy: images => images.order,
        },
      },
    })
    if (!model) throw new Error(`Could not get project with uri '${uri}'`)
    return model
  }

  async getAllByCategoryId(categoryId: CategoryId) {
    return await this.db.query.projects.findMany({
      where: eq(projects.categoryId, categoryId),
      with: {
        images: {
          orderBy: images => images.order,
        },
      },
      orderBy: projects => projects.order,
    })
  }

  async getAll() {
    return await this.db.query.projects.findMany({
      with: {
        images: {
          orderBy: images => images.order,
        },
      },
      orderBy: projects => projects.order,
    })
  }

  async create(dto: CreateProjectDto) {
    return this.db.transaction(async (tx) => {
      const toCreate = projectDbMapper.toDbCreate(dto, 1000)
      const created = (await tx.insert(projects).values(toCreate).returning())[0]
      const [curOrder] = await tx.select({ value: count() }).from(projects).where(eq(projects.categoryId, dto.categoryId))
      await tx.update(projects).set({ order: curOrder.value }).where(eq(projects.id, created.id)).returning()
      const returned = await tx.query.projects.findFirst({
        where: eq(projects.id, created.id), with: {
          images: {
            orderBy: images => images.order,
          },
        },
      })
      return returned!
    }, {
      deferrable: true,
      isolationLevel: 'read uncommitted',
    })
  }

  async updateOrder(id: ProjectId, newOrder: number) {
    return await this.db.transaction(async (tx) => {
      const model = await tx.query.projects.findFirst({ where: eq(projects.id, id) })
      if (!model) throw tx.rollback()

      if (model.order === newOrder) return

      const [curOrder] = await tx.select({ value: count() }).from(projects).where(eq(projects.categoryId, model.categoryId))
      if (newOrder > curOrder.value + 1)
        throw new Error('New order is out of range')

      if (newOrder > model.order) {
        await tx.update(projects).set({ order: sql`(${projects.order} - 1) * 1000` }).where(and(
          eq(projects.categoryId, model.categoryId),
          gt(projects.order, model.order),
          lte(projects.order, newOrder),
        ))
      }
      else if (newOrder < model.order) {
        await tx.update(projects).set({ order: sql`(${projects.order} + 1) * 1000` }).where(and(
          eq(projects.categoryId, model.categoryId),
          gte(projects.order, newOrder),
          lt(projects.order, model.order),
        ))
      }

      await tx.update(projects).set({ order: newOrder }).where(eq(projects.id, model.id))
      await tx.update(projects).set({ order: sql`${projects.order} / 1000` }).where(gte(projects.order, 1000))
    })
  }

  async update(id: ProjectId, update: ProjectDbUpdate) {
    return await this.db.transaction(async (tx) => {
      const model = await this.getOne(id)

      if (update.categoryId !== model.categoryId) {
        const [lastOrder] = await tx.select({ value: count() }).from(projects).where(eq(projects.categoryId, model.categoryId))
        await this.updateOrder(id, lastOrder.value)

        await tx.update(projects).set({ order: 999 }).where(eq(projects.id, id))
        await tx.update(projects)
          .set(projectDbMapper.toDbUpdateWithoutOrder(update))
          .where(eq(projects.id, id))
        const [curOrder] = await tx.select({ value: count() }).from(projects).where(eq(projects.categoryId, update.categoryId))
        await tx.update(projects).set({ order: curOrder.value }).where(eq(projects.id, id))
      }
      else {
        await this.updateOrder(id, update.order)
        await tx.update(projects)
          .set(projectDbMapper.toDbUpdateWithoutOrder(update))
          .where(eq(projects.id, id))
      }

      const returned = await tx.query.projects.findFirst({
        where: eq(projects.id, id), with: {
          images: {
            orderBy: images => images.order,
          },
        },
      })
      return returned!
    })
  }

  async delete(id: ProjectId) {
    return await this.db.transaction(async (tx) => {
      const toDelete = await tx.query.projects.findFirst({ where: eq(projects.id, id) })
      if (!toDelete) throw tx.rollback()
      await this.db.delete(projects).where(eq(projects.id, id))
      await tx.update(projects).set({ order: sql`(${projects.order} - 1) * 1000` }).where(and(eq(projects.categoryId, toDelete.categoryId), gt(projects.order, toDelete.order)))
      await tx.update(projects).set({ order: sql`${projects.order} / 1000` }).where(and(eq(projects.categoryId, toDelete.categoryId), gte(projects.order, 1000)))
    })
  }
}
