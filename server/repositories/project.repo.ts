import type { ProjectId, CategoryId } from '../db/schema'
import { projectMapper } from '../mappers/project.mapper'
import type {
  CreateProjectDto,
  UpdateProjectDto,
} from '../use-cases/types'
import type { ImageRepo } from './image.repo'
import type { ProjectDbRepo } from './projectDb.repo'
import type { ProjectS3Repo } from './projectS3.repo'

export class ProjectRepo {
  constructor(private dbRepo: ProjectDbRepo, private bucketRepo: ProjectS3Repo, private imageRepo: ImageRepo) { }

  async getOne(id: ProjectId) {
    const model = await this.dbRepo.getOne(id)
    const images = await this.imageRepo.getAllByProjectId(id)
    return projectMapper.toDto(model, images)
  }

  async getOneByUri(uri: string) {
    const model = await this.dbRepo.getOneByUri(uri)
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
    await this.bucketRepo.createDir(dto.uri)
    const images = await this.imageRepo.getAllByProjectId(createdInDb.id)
    return projectMapper.toDto(createdInDb, images)
  }

  async update(id: ProjectId, dto: UpdateProjectDto) {
    const model = await this.dbRepo.getOne(id)
    const updatedInDb = await this.dbRepo.update(id, dto)
    await this.bucketRepo.renameDir(model.uri, dto.uri)
    const images = await this.imageRepo.getAllByProjectId(id)
    return projectMapper.toDto(updatedInDb, images)
  }

  async updateOrder(id: ProjectId, newOrder: number) {
    await this.dbRepo.updateOrder(id, newOrder)
  }

  async delete(id: ProjectId) {
    const project = await this.dbRepo.getOne(id)
    await this.bucketRepo.deleteDir(project.uri)
    await this.dbRepo.delete(project.id)
  }
}
