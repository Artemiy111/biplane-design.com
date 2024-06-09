import { err, ok } from '../shared/result'
import type { CreateImageDto, IImageBucketRepo, IImageDbRepo, IImageRepo, IProjectDbRepo, ImageDto, ImageId, ProjectId, UpdateImageDto } from '../use-cases/types'

export const imageMapper = {
  toDto(dbDto: Omit<ImageDto, 'url'>, url: string) {
    return {
      ...dbDto,
      url: url,
    }
  },
}

export class ImageRepo implements IImageRepo {
  constructor(private dbRepo: IImageDbRepo, private bucketRepo: IImageBucketRepo, private projectDbRepo: IProjectDbRepo) { }

  async getOne(id: ImageId) {
    const image = await this.dbRepo.getOne(id)
    if (!image.ok) return image

    const project = await this.projectDbRepo.getOne(image.value.projectId)
    if (!project.ok) return project

    const url = await this.bucketRepo.getImageUrl(project.value.uri, image.value.filename)
    if (!url.ok) return url

    return ok(imageMapper.toDto(image.value, url.value))
  }

  async getAllByProjectId(projectId: ProjectId) {
    const project = await this.projectDbRepo.getOne(projectId)
    if (!project.ok) return project

    const images = await this.dbRepo.getAllByProjectId(projectId)
    if (!images.ok) return images

    try {
      const res = await Promise.all(images.value.map(async (img) => {
        const url = await this.bucketRepo.getImageUrl(project.value.uri, img.filename)
        if (!url.ok) throw new Error(`Could not get url for image with project ${project.value.uri} and filename ${img.filename}`)
        return imageMapper.toDto(img, url.value)
      }))
      return ok(res)
    }
    catch (_e) {
      const error = _e as Error
      return err(error)
    }
  }

  private genFilename(filename: string) {
    return filename + crypto.randomUUID().slice(0, 8)
  }

  async create(dto: CreateImageDto) {
    const project = await this.projectDbRepo.getOne(dto.projectId)
    if (!project.ok) return project

    let filename = dto.filename
    const maybeCollisionFilename = await this.dbRepo.getOneByFilename(dto.projectId, dto.filename)
    if (maybeCollisionFilename.ok) filename = this.genFilename(dto.filename)
    dto.filename = filename

    const createdInBucket = await this.bucketRepo.createImageFile(project.value.uri, dto.filename, dto.type, dto.data)
    if (!createdInBucket.ok) return createdInBucket

    const createdInDb = await this.dbRepo.create(dto)
    if (!createdInDb.ok) return createdInDb

    const url = await this.bucketRepo.getImageUrl(project.value.uri, dto.filename)
    if (!url.ok) return url

    const res = imageMapper.toDto(createdInDb.value, url.value)
    return ok(res)
  }

  async update(dto: UpdateImageDto) {
    const image = await this.getOne(dto.id)
    if (!image.ok) return image

    const project = await this.projectDbRepo.getOne(image.value.projectId)
    if (!project.ok) return project

    if (dto.filename !== image.value.filename) {
      const updatedInBucket = await this.bucketRepo.renameImageFile(project.value.uri, image.value.filename, dto.filename)
      if (!updatedInBucket.ok) return err(updatedInBucket.error)
    }
    const updatedInDb = await this.dbRepo.update(dto)
    if (!updatedInDb.ok) return updatedInDb
    return this.getOne(dto.id)
  }

  async delete(id: ImageId) {
    const image = await this.dbRepo.getOne(id)
    if (!image.ok) return image

    const project = await this.projectDbRepo.getOne(image.value.projectId)
    if (!project.ok) return project

    const deletedInBucket = await this.bucketRepo.deleteImageFile(project.value.uri, image.value.filename)
    if (!deletedInBucket.ok) return deletedInBucket

    const deletedInDb = await this.dbRepo.delete(image.value.id)
    if (!deletedInDb.ok) return deletedInDb

    return ok(undefined)
  }
}
