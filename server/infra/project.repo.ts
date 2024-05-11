import { ImageDb } from '../db/schema'
import { err, ok } from '../shared/result'
import type { CreateProjectDto, IProjectDbRepo, IProjectBucketRepo, IProjectRepo, ProjectId, UpdateProjectDto, IImageRepo, IImageBucketRepo, ProjectDbDto, ProjectDto, ImageDto, CategoryId } from '../use-cases/types'
import { imageMapper } from './image.repo'

// Что делать если изменилось только в бд, но не в файловой системе?

const projectMapper = {
  toDto(dbDto: ProjectDbDto, images: ImageDto[]): ProjectDto {
    return {
      ...dbDto,
      images,
    }
  },
}

export class ProjectRepo implements IProjectRepo {
  constructor(private dbRepo: IProjectDbRepo, private bucketRepo: IProjectBucketRepo, private imageRepo: IImageRepo) { }

  async getOne(id: ProjectId) {
    const project = await this.dbRepo.getOne(id)
    if (!project.ok) return project

    const images = await this.imageRepo.getAllByProjectId(project.value.id)
    if (!images.ok) return images

    return ok(projectMapper.toDto(project.value, images.value))
  }

  async getOneByUri(uri: string) {
    const project = await this.dbRepo.getOneByUri(uri)
    if (!project.ok) return project

    const images = await this.imageRepo.getAllByProjectId(project.value.id)
    if (!images.ok) return images

    return ok(projectMapper.toDto(project.value, images.value))
  }

  async getByCategoryId(categoryId: CategoryId) {
    const projects = await this.dbRepo.getByCategoryId(categoryId)
    if (!projects.ok) return projects

    try {
      const images = await Promise.all(projects.value.map(async (project) => {
        const images = await this.imageRepo.getAllByProjectId(project.id)
        if (!images.ok) throw new Error('oops')
        return images.value
      }))
      const res = projects.value.map((project, idx) => projectMapper.toDto(project, images[idx]))
      return ok(res)
    }
    catch (_e) {
      return err(_e as Error)
    }
  }

  async getAll() {
    const projects = await this.dbRepo.getAll()
    if (!projects.ok) return projects

    try {
      const images = await Promise.all(projects.value.map(async (project) => {
        const images = await this.imageRepo.getAllByProjectId(project.id)
        if (!images.ok) throw new Error('oops')
        return images.value
      }))
      const res = projects.value.map((project, idx) => projectMapper.toDto(project, images[idx]))
      return ok(res)
    }
    catch (_e) {
      return err(_e as Error)
    }
  }

  async create(dto: CreateProjectDto) {
    const createdInDb = await this.dbRepo.create(dto)
    if (!createdInDb.ok) return createdInDb

    const createdInBucket = await this.bucketRepo.createDir(dto.uri)
    if (!createdInBucket.ok) return createdInBucket

    const images = await this.imageRepo.getAllByProjectId(createdInDb.value.id)
    if (!images.ok) return images

    return ok(projectMapper.toDto(createdInDb.value, images.value))
  }

  async update(dto: UpdateProjectDto) {
    const project = await this.dbRepo.getOne(dto.id)
    if (!project.ok) return project

    const updatedInBucket = await this.bucketRepo.renameDir(project.value.uri, dto.uri)
    if (!updatedInBucket.ok) return updatedInBucket

    const updatedInDb = await this.dbRepo.update(dto)
    if (!updatedInDb.ok) return updatedInDb

    const images = await this.imageRepo.getAllByProjectId(updatedInDb.value.id)
    if (!images.ok) return images

    return ok(projectMapper.toDto(updatedInDb.value, images.value))
  }

  async delete(id: ProjectId) {
    const project = await this.dbRepo.getOne(id)
    if (!project.ok) return project

    const deletedInBucket = await this.bucketRepo.deleteDir(project.value.uri)
    if (!deletedInBucket.ok) return deletedInBucket

    const deletedInDb = await this.dbRepo.delete(project.value.id)
    if (!deletedInDb.ok) return deletedInDb

    return ok(undefined)
  }
}
