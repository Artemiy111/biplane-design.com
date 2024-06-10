import type { ImageId, ProjectId } from '../db/schema'
import { imageMapper } from '../mappers/image.mapper'
import { imageDbMapper } from '../mappers/imageDb.mapper'
import type { CreateImageDto, UpdateImageDto } from '../use-cases/types'
import type { ImageDbRepo } from './imageDb.repo'
import type { ImageS3Repo } from './imageS3.repo'
import type { ProjectDbRepo } from './projectDb.repo'

export class ImageRepo {
  constructor(private dbRepo: ImageDbRepo, private bucketRepo: ImageS3Repo, private projectDbRepo: ProjectDbRepo) { }

  async getOne(id: ImageId) {
    const model = await this.dbRepo.getOne(id)
    const project = await this.projectDbRepo.getOne(model.projectId)
    const url = this.bucketRepo.getUrl(project.uri, model.id)
    return imageMapper.toDto(model, url)
  }

  async getAllByProjectId(projectId: ProjectId) {
    const project = await this.projectDbRepo.getOne(projectId)
    const images = await this.dbRepo.getAllByProjectId(projectId)
    return await Promise.all(images.map(async (img) => {
      const url = this.bucketRepo.getUrl(project.uri, img.id)
      return imageMapper.toDto(img, url)
    }))
  }

  async create(dto: CreateImageDto) {
    const project = await this.projectDbRepo.getOne(dto.projectId)
    dto.filename = crypto.randomUUID() + '.' + dto.filename.split('.').at(-1)

    const createdInDb = await this.dbRepo.create(imageDbMapper.toDbCreate(dto))
    await this.bucketRepo.createImageFile(project.uri, dto.filename, dto.data)

    const url = this.bucketRepo.getUrl(project.uri, dto.filename)
    return imageMapper.toDto(createdInDb, url)
  }

  async update(id: ImageId, dto: UpdateImageDto) {
    const image = await this.getOne(id)
    const project = await this.projectDbRepo.getOne(image.projectId)

    const updatedInDb = await this.dbRepo.update(id, imageDbMapper.toDbUpdate(dto))

    const url = this.bucketRepo.getUrl(project.uri, id)
    return imageMapper.toDto(updatedInDb, url)
  }

  async delete(id: ImageId) {
    const image = await this.dbRepo.getOne(id)
    const project = await this.projectDbRepo.getOne(image.projectId)

    await this.bucketRepo.deleteImageFile(project.uri, image.id)
    await this.dbRepo.delete(image.id)
  }
}
