import type { CategoryId, ProjectId } from '../db/schema'
import type {
  CreateProjectDto,
  UpdateProjectDto,
} from '../types'

import { projectMapper } from '../mappers/project.mapper'
import { imageRepo } from './image.repo'
import { projectDbRepo as dbRepo } from './projectDb.repo'
import { projectS3Repo as s3Repo } from './projectS3.repo'

class ProjectRepo {
  async getOne(id: ProjectId) {
    const model = await dbRepo.getOne(id)
    const images = await imageRepo.getAllByProjectId(id)
    return projectMapper.toDto(model, images)
  }

  async getOneBySlug(slug: string) {
    const model = await dbRepo.getOneBySlug(slug)
    const images = await imageRepo.getAllByProjectId(model.id)
    return projectMapper.toDto(model, images)
  }

  async getByCategoryId(categoryId: CategoryId) {
    const models = await dbRepo.getAllByCategoryId(categoryId)
    return Promise.all(models.map(async (model) => {
      const images = await imageRepo.getAllByProjectId(model.id)
      return projectMapper.toDto(model, images)
    }))
  }

  async getAll() {
    const models = await dbRepo.getAll()
    return Promise.all(models.map(async (model) => {
      const images = await imageRepo.getAllByProjectId(model.id)
      return projectMapper.toDto(model, images)
    }))
  }

  async create(dto: CreateProjectDto) {
    const createdInDb = await dbRepo.create(dto)
    const images = await imageRepo.getAllByProjectId(createdInDb.id)
    return projectMapper.toDto(createdInDb, images)
  }

  async update(id: ProjectId, dto: UpdateProjectDto) {
    const updatedInDb = await dbRepo.update(id, dto)
    const images = await imageRepo.getAllByProjectId(id)
    return projectMapper.toDto(updatedInDb, images)
  }

  async updateOrder(id: ProjectId, newOrder: number) {
    await dbRepo.updateOrder(id, newOrder)
  }

  async delete(id: ProjectId) {
    const project = await dbRepo.getOne(id)
    await s3Repo.deleteDir(id)
    await dbRepo.delete(project.id)
  }
}

export const projectRepo = new ProjectRepo()
