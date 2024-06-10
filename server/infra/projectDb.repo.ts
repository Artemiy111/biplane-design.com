import { and, count, eq, getTableColumns, gt, gte, lt, lte, sql } from 'drizzle-orm'
import type { Db } from '../db'
import { projectDbMapper } from '../mappers/projectDb.mapper'
import type { CategoryId, ProjectId, ProjectDbUpdate } from '~/server/db/schema'
import { projects } from '~/server/db/schema'
import type { CreateProjectDto } from '~/server/use-cases/types'

export class ProjectDbRepo {
  constructor(private db: Db) { }

  async getOne(id: ProjectId) {
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
      const createdInDb = (await tx.insert(projects).values(toCreate).returning())[0]
      const [curOrder] = await tx.select({ value: count() }).from(projects).where(eq(projects.categoryId, dto.categoryId))
      await tx.update(projects).set({ order: curOrder.value }).where(eq(projects.id, createdInDb.id)).returning()
      return await this.getOne(createdInDb.id)
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
      const needCategoryUpdate = update.categoryId !== model.categoryId
      if (needCategoryUpdate) {
        const TMP_ORDER = 999
        await this.updateOrder(id, TMP_ORDER)

        await tx.update(projects)
          .set(projectDbMapper.toDbUpdateWithoutOrder(update))
          .where(eq(projects.id, id))

        const [curOrder] = await tx.select({ value: count() }).from(projects).where(eq(projects.categoryId, update.categoryId))
        await this.updateOrder(id, curOrder.value)
      }
      else {
        await this.updateOrder(id, update.order)
        await tx.update(projects)
          .set(projectDbMapper.toDbUpdateWithoutOrder(update))
          .where(eq(projects.id, id))
      }

      const updatedProject = await this.getOne(id)
      if (!updatedProject)
        return tx.rollback()

      return updatedProject
    })
  }

  async delete(id: ProjectId) {
    return await this.db.transaction(async (tx) => {
      await this.db.delete(projects).where(eq(projects.id, id))

      const remainProjects = await tx.select((
        { ...getTableColumns(projects), newOrder: sql<number>`row_number() over (order by ${projects.order})`.mapWith(Number).as('new_order') }
      )).from(projects)

      await Promise.all(
        remainProjects.map((proj) => {
          return tx.update(projects).set({ order: proj.newOrder * 1000 }).where(
            eq(projects.id, proj.id),
          )
        }),
      )

      await Promise.all(
        remainProjects.map((proj) => {
          return tx.update(projects).set({ order: proj.newOrder }).where(
            eq(projects.id, proj.id),
          )
        }),
      )
    })
  }
}
