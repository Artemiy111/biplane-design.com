import { and, eq, getTableColumns, gt, gte, lt, lte, sql } from 'drizzle-orm'
import type { Db, DbTransaction } from '../db'
import { err, ok } from '../shared/result'
import { imageDbMapper } from './imageDb.repo'
import { type ProjectDbCreate, type ProjectDbDeep, type ProjectDbUpdate, projects } from '~/server/db/schema'
import type { ProjectDbDto, CreateProjectDto, IProjectDbRepo, ProjectId, UpdateProjectDto, CategoryId } from '~/server/use-cases/types'

export const projectDbMapper = {
  toDb(db: ProjectDbDeep): ProjectDbDto {
    return {
      categoryId: db.categoryId,
      id: db.id,
      title: db.title,
      uri: db.uri,
      yearStart: db.yearStart,
      yearEnd: db.yearEnd,
      location: db.location,
      status: db.status,
      order: db.order,
      images: db.images.map(imageDbMapper.toDb),
    }
  },
  toDbCreate(dto: CreateProjectDto, order: number): ProjectDbCreate {
    return {
      categoryId: dto.categoryId,
      title: dto.title,
      uri: dto.uri,
      yearStart: dto.yearStart,
      yearEnd: dto.yearEnd,
      location: dto.location,
      status: dto.status,
      order,
    }
  },
  toDbUpdate(dto: UpdateProjectDto): ProjectDbUpdate {
    return {
      categoryId: dto.categoryId,
      id: dto.id,
      title: dto.title,
      uri: dto.uri,
      yearStart: dto.yearStart,
      yearEnd: dto.yearEnd,
      location: dto.location,
      status: dto.status,
      order: dto.order,
    }
  },
  toDbUpdateWithoutOrder(db: ProjectDbUpdate): Omit<ProjectDbUpdate, 'order'> {
    const { order: _order, ...toUpdate } = db
    return toUpdate
  },
}

export class ProjectDbRepo implements IProjectDbRepo {
  constructor(private db: Db) { }

  private async getNextOrder(categoryId: CategoryId, tx?: DbTransaction) {
    const ctx = tx || this.db
    try {
      const count = (await ctx.select().from(projects).where(eq(projects.categoryId, categoryId))).length
      return ok(count + 1)
    }
    catch (e) {
      return err(new Error(`Could not get next order of project`))
    }
  }

  async getOne(id: ProjectId, tx?: DbTransaction) {
    const ctx = tx || this.db
    try {
      const project = (await ctx.query.projects.findFirst({
        where: eq(projects.id, id), with: {
          images: {
            orderBy: images => images.order,
          },
        },
      }))
      if (!project)
        return err(new Error(`Project with id \`${id}\` is not found`))

      return ok(projectDbMapper.toDb(project))
    }
    catch (_e) {
      return err(new Error(`Could not get project`))
    }
  }

  async getOneByUri(uri: string, tx?: DbTransaction) {
    const ctx = tx || this.db
    try {
      const project = (await ctx.query.projects.findFirst({
        where: eq(projects.uri, uri), with: {
          images: {
            orderBy: images => images.order,
          },
        },
      }))
      if (!project)
        return err(new Error(`Project with uri \`${uri}\` is not found`))

      return ok(projectDbMapper.toDb(project))
    }
    catch (_e) {
      return err(new Error(`Could not get project by uri \`${uri}\``))
    }
  }

  async getByCategoryId(categoryId: CategoryId, tx?: DbTransaction) {
    const ctx = tx || this.db
    try {
      const projectsByCategoryId = (await ctx.query.projects.findMany({
        where: eq(projects.categoryId, categoryId),
        with: {
          images: {
            orderBy: images => images.order,
          },
        },
        orderBy: projects => projects.order,
      }))
      return ok(projectsByCategoryId.map(projectDbMapper.toDb))
    }
    catch (_e) {
      return err(new Error(`Could not get projects`))
    }
  }

  async getAll(tx?: DbTransaction) {
    const ctx = tx || this.db
    try {
      const projects = (await ctx.query.projects.findMany({
        with: {
          images: {
            orderBy: images => images.order,
          },
        },
        orderBy: projects => projects.order,
      }))
      return ok(projects.map(projectDbMapper.toDb))
    }
    catch (_e) {
      return err(new Error(`Could not get projects`))
    }
  }

  async create(dto: CreateProjectDto, tx?: DbTransaction) {
    const ctx = tx || this.db

    try {
      return ctx.transaction(async (tx) => {
        const nextOrder = await this.getNextOrder(dto.categoryId, tx)
        if (!nextOrder.ok)
          return tx.rollback()

        const toCreate = projectDbMapper.toDbCreate(dto, nextOrder.value)

        const createdInDb = (await tx.insert(projects).values(toCreate).returning())[0]
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

  private async updateOrder(dto: UpdateProjectDto, newOrder: number, tx?: DbTransaction) {
    if (dto.order === newOrder)
      return ok(undefined)

    const ctx = tx || this.db

    try {
      return await ctx.transaction(async (tx) => {
        const nextOrder = await this.getNextOrder(dto.categoryId, tx)
        if (!nextOrder.ok)
          return err(nextOrder.error)

        if (newOrder > nextOrder.value)
          return err('New order is out of range')

        if (newOrder > dto.order) {
          await tx.update(projects).set({ order: sql`(${projects.order} - 1) * 1000` }).where(and(
            eq(projects.categoryId, dto.categoryId),
            gt(projects.order, dto.order),
            lte(projects.order, newOrder),
          ))
        }
        else if (newOrder < dto.order) {
          await tx.update(projects).set({ order: sql`(${projects.order} + 1) * 1000` }).where(and(
            eq(projects.categoryId, dto.categoryId),
            gte(projects.order, newOrder),
            lt(projects.order, dto.order),
          ))
        }

        await tx.update(projects).set({ order: newOrder }).where(eq(projects.id, dto.id))
        await tx.update(projects).set({ order: sql`${projects.order} / 1000` }).where(gte(projects.order, 1000))
        return ok(undefined)
      })
    }
    catch (_e) {
      return err(new Error(`Could not update order of project with id \`${dto.id}\``))
    }
  }

  async update(dto: UpdateProjectDto, tx?: DbTransaction) {
    const ctx = tx || this.db

    try {
      return await ctx.transaction(async (tx) => {
        const project = await this.getOne(dto.id, tx)
        if (!project.ok)
          return project

        const isProjectCategoryUpdated = dto.categoryId !== project.value.categoryId
        if (isProjectCategoryUpdated) {
          const tmpOrder = 999
          await this.updateOrder(project.value, tmpOrder, tx)

          await tx.update(projects)
            .set(projectDbMapper.toDbUpdateWithoutOrder(dto))
            .where(eq(projects.id, dto.id))

          const newOrder = await this.getNextOrder(dto.categoryId, tx)
          if (!newOrder.ok)
            return tx.rollback()
          await this.updateOrder(dto, newOrder.value - 1, tx)
        }
        else {
          await this.updateOrder(project.value, dto.order, tx)
          await tx.update(projects)
            .set(projectDbMapper.toDbUpdateWithoutOrder(dto))
            .where(eq(projects.id, dto.id))
        }

        const updatedProject = await this.getOne(dto.id, tx)
        if (!updatedProject.ok)
          return tx.rollback()

        return ok(updatedProject.value)
      })
    }
    catch (e) {
      return err(new Error(`Could not update project with id \`${dto.id}\``))
    }
  }

  async delete(id: ProjectId, tx?: DbTransaction) {
    const ctx = tx || this.db
    try {
      return await ctx.transaction(async (tx) => {
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
        return ok(undefined)
      })
    }
    catch (_e) {
      return err(new Error(`Could not delete project with id \`${id}\``))
    }
  }
}
