import type { ImageId, ProjectId } from '../db/schema'
import type { CreateImageDto, UpdateImageDto } from '../use-cases/types'
import type { ImageDbRepo } from './imageDb.repo'
import type { ImageS3Repo } from './imageS3.repo'

import { imageMapper } from '../mappers/image.mapper'
import { imageDbMapper } from '../mappers/imageDb.mapper'

export class ImageRepo {
  constructor(private dbRepo: ImageDbRepo, private s3Repo: ImageS3Repo) { }

  async getOne(id: ImageId) {
    const model = await this.dbRepo.getOne(id)
    const url = this.s3Repo.getUrl(model.projectId, model.id)
    return imageMapper.toDto(model, url)
  }

  async getAllByProjectId(projectId: ProjectId) {
    const models = await this.dbRepo.getAllByProjectId(projectId)
    return await Promise.all(models.map(async (model) => {
      const url = this.s3Repo.getUrl(model.projectId, model.id)
      return imageMapper.toDto(model, url)
    }))
  }

  async create(dto: CreateImageDto) {
    const filename = crypto.randomUUID() + '.' + dto.file.type.split('/').at(-1)
    await this.s3Repo.createImageFile(dto.projectId, filename, dto.file)
    const createdInDb = await this.dbRepo.create(imageDbMapper.toDbCreate(dto, filename))
    const url = this.s3Repo.getUrl(dto.projectId, filename)
    return imageMapper.toDto(createdInDb, url)
  }

  async update(id: ImageId, dto: UpdateImageDto) {
    const model = await this.getOne(id)

    const updatedInDb = await this.dbRepo.update(id, imageDbMapper.toDbUpdate(dto))

    const url = this.s3Repo.getUrl(model.projectId, id)
    return imageMapper.toDto(updatedInDb, url)
  }

  async delete(id: ImageId) {
    const model = await this.dbRepo.getOne(id)

    await this.s3Repo.deleteImageFile(model.projectId, model.id)
    await this.dbRepo.delete(model.id)
  }
}
