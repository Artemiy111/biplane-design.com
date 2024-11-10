import type { CategoryId, ProjectId } from '../db/schema'
import type {
  CreateProjectDto,
  UpdateProjectDto,
} from '../use-cases/types'
import type { ImageRepo } from './image.repo'
import type { ProjectDbRepo } from './projectDb.repo'
import type { ProjectS3Repo } from './projectS3.repo'

import { projectMapper } from '../mappers/project.mapper'

export class ProjectRepo {
  constructor(private dbRepo: ProjectDbRepo, private bucketRepo: ProjectS3Repo, private imageRepo: ImageRepo) { }

  async getOne(id: ProjectId) {
    const model = await this.dbRepo.getOne(id)
    const images = await this.imageRepo.getAllByProjectId(id)
    return projectMapper.toDto(model, images)
  }

  async getOneBySlug(slug: string) {
    const model = await this.dbRepo.getOneBySlug(slug)
    const images = await this.imageRepo.getAllByProjectId(model.id)
    return projectMapper.toDto(model, images)
  }

  async getByCategoryId(categoryId: CategoryId) {
    const models = await this.dbRepo.getAllByCategoryId(categoryId)
    return Promise.all(models.map(async (model) => {
      const images = await this.imageRepo.getAllByProjectId(model.id)
      return projectMapper.toDto(model, images)
    }))
  }

  async getAll() {
    const models = await this.dbRepo.getAll()
    return Promise.all(models.map(async (model) => {
      const images = await this.imageRepo.getAllByProjectId(model.id)
      return projectMapper.toDto(model, images)
    }))
  }

  async create(dto: CreateProjectDto) {
    const createdInDb = await this.dbRepo.create(dto)
    const images = await this.imageRepo.getAllByProjectId(createdInDb.id)
    return projectMapper.toDto(createdInDb, images)
  }

  async update(id: ProjectId, dto: UpdateProjectDto) {
    const updatedInDb = await this.dbRepo.update(id, dto)
    const images = await this.imageRepo.getAllByProjectId(id)
    return projectMapper.toDto(updatedInDb, images)
  }

  async updateOrder(id: ProjectId, newOrder: number) {
    await this.dbRepo.updateOrder(id, newOrder)
  }

  async delete(id: ProjectId) {
    const project = await this.dbRepo.getOne(id)
    await this.bucketRepo.deleteDir(id)
    await this.dbRepo.delete(project.id)
  }
}
