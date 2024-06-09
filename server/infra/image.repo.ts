import type { ImageDb } from '../db/schema'
import { err, ok } from '../shared/result'
import type { CreateImageDto, ImageDto, ImageId, ProjectId, UpdateImageDto } from '../use-cases/types'
import type { ImageDbRepo } from './imageDb.repo'
import type { ImageS3Repo } from './imageS3.repo'
import type { ProjectDbRepo } from './projectDb.repo'

export const imageMapper = {
  toDto(db: ImageDb, url: string): ImageDto {
    return {
      ...db,
      url: url,
    }
  },
}

export class ImageRepo {
  constructor(private dbRepo: ImageDbRepo, private bucketRepo: ImageS3Repo, private projectDbRepo: ProjectDbRepo) { }

  async getOne(filename: ImageId) {
    const image = await this.dbRepo.getOne(filename)
    if (!image.ok) return image

    const project = await this.projectDbRepo.getOne(image.value.projectId)
    if (!project.ok) return project

    const url = this.bucketRepo.getUrl(project.value.uri, image.value.id)

    return ok(imageMapper.toDto(image.value, url))
  }

  async getAllByProjectId(projectId: ProjectId) {
    const project = await this.projectDbRepo.getOne(projectId)
    if (!project.ok) return project

    const images = await this.dbRepo.getAllByProjectId(projectId)
    if (!images.ok) return images

    try {
      const res = await Promise.all(images.value.map(async (img) => {
        const url = this.bucketRepo.getUrl(project.value.uri, img.id)
        return imageMapper.toDto(img, url)
      }))
      return ok(res)
    }
    catch (_e) {
      const error = _e as Error
      return err(error)
    }
  }

  async create(dto: CreateImageDto) {
    const project = await this.projectDbRepo.getOne(dto.projectId)
    if (!project.ok) return project
    dto.filename = crypto.randomUUID() + '.' + dto.filename.split('.').at(-1)

    const createdInBucket = await this.bucketRepo.createImageFile(project.value.uri, dto.filename, dto.data)
    if (!createdInBucket.ok) return createdInBucket

    const url = this.bucketRepo.getUrl(project.value.uri, dto.filename)

    const createdInDb = await this.dbRepo.create(dto)
    if (!createdInDb.ok) return createdInDb

    const res = imageMapper.toDto(createdInDb.value, url)
    return ok(res)
  }

  async update(dto: UpdateImageDto) {
    const image = await this.getOne(dto.filename)
    if (!image.ok) return image

    const project = await this.projectDbRepo.getOne(image.value.projectId)
    if (!project.ok) return project

    const updatedInDb = await this.dbRepo.update(dto)
    if (!updatedInDb.ok) return updatedInDb
    return this.getOne(dto.filename)
  }

  async delete(id: ImageId) {
    const image = await this.dbRepo.getOne(id)
    if (!image.ok) return image

    const project = await this.projectDbRepo.getOne(image.value.projectId)
    if (!project.ok) return project

    const deletedInBucket = await this.bucketRepo.deleteImageFile(project.value.uri, image.value.id)
    if (!deletedInBucket.ok) return deletedInBucket

    const deletedInDb = await this.dbRepo.delete(image.value.id)
    if (!deletedInDb.ok) return deletedInDb

    return ok(undefined)
  }
}
