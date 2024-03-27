import { eq } from 'drizzle-orm'
import type { Db } from '../db'
import { err, ok } from '../shared/result'
import type { CreateProjectDto, IProjectDbRepo, ProjectId } from './../use-cases/types'
import { imageDbMapper } from './imageDb.repo'
import { type ProjectDbDeep, images, projects } from '~/server/db/schema'
import type { ProjectDto } from '~/server/use-cases/types'

export const projectDbMapper = {
  toDto(db: ProjectDbDeep): ProjectDto {
    return {
      categoryId: db.categoryId,
      id: db.id,
      title: db.title,
      uri: db.urlFriendly,
      yearStart: db.yearStart,
      yearEnd: db.yearEnd,
      location: db.location,
      status: db.status,
      order: db.order,
      images: db.images.map(imageDbMapper.toDto),
    }
  },
}

export class ProjectDbRepo implements IProjectDbRepo {
  constructor(private db: Db) {}
  async getProject(id: ProjectId) {
    try {
      const project = (await this.db.query.projects.findFirst({ where: eq(projects.id, id), with: {
        images: { orderBy: images.order,
        },
      } }))
      if (!project)
        return err(new Error(`Project with id \`${id}\` is not found`))

      return ok(projectDbMapper.toDto(project))
    }
    catch (_e) {
      return err(new Error('oops'))
    }
  }

  async getProjectByUri(uri: string) {
    try {
      const project = (await this.db.query.projects.findFirst({ where: eq(projects.urlFriendly, uri), with: {
        images: { orderBy: images.order,
        },
      } }))
      if (!project)
        return err(new Error(`Project with uri \`${uri}\` is not found`))

      return ok(projectDbMapper.toDto(project))
    }
    catch (_e) {
      return err(new Error('oops'))
    }
  }

  async getProjects() {
    try {
      const projects = (await this.db.query.projects.findMany({
        with: {
          images: {
            orderBy: images.order,
          },
        },
      }))
      return ok(projects.map(projectDbMapper.toDto))
    }
    catch (_e) {
      return err(new Error('oops'))
    }
  }

  async createProject(dto: CreateProjectDto) {
    return Promise.resolve(err(new Error('not impl')))
  }

  async updateProject() {
    return Promise.resolve(err(new Error('not impl')))
  }

  async deleteProject() {
    return Promise.resolve(err(new Error('not impl')))
  }
}
