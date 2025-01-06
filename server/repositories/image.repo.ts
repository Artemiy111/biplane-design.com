import type { ImageId, ProjectId } from '../db/schema'
import type { CreateImageDto, UpdateImageDto } from '../types'
import { imageDbRepo as dbRepo } from './imageDb.repo'
import { imageS3Repo as s3Repo } from './imageS3.repo'
import { imageMapper } from '../mappers/image.mapper'
import { imageDbMapper } from '../mappers/imageDb.mapper'

class ImageRepo {
  async getOne(id: ImageId) {

    const model = await dbRepo.getOne(id)
    const url = s3Repo.getUrl(model.projectId, model.id)
    return imageMapper.toDto(model, url)
  }

  async getAllByProjectId(projectId: ProjectId) {
    const models = await dbRepo.getAllByProjectId(projectId)
    return await Promise.all(models.map(async (model) => {
      const url = s3Repo.getUrl(model.projectId, model.id)
      return imageMapper.toDto(model, url)
    }))
  }

  async create(dto: CreateImageDto) {
    const filename = crypto.randomUUID() + '.' + dto.file.type.split('/').at(-1)
    await s3Repo.createImageFile(dto.projectId, filename, dto.file)
    const createdInDb = await dbRepo.create(imageDbMapper.toDbCreate(dto, filename))
    const url = s3Repo.getUrl(dto.projectId, filename)
    return imageMapper.toDto(createdInDb, url)
  }

  async update(id: ImageId, dto: UpdateImageDto) {
    const model = await this.getOne(id)
    const updatedInDb = await dbRepo.update(id, imageDbMapper.toDbUpdate(dto))

    const url = s3Repo.getUrl(model.projectId, id)
    return imageMapper.toDto(updatedInDb, url)
  }

  async delete(id: ImageId) {
    const model = await dbRepo.getOne(id)

    await s3Repo.deleteImageFile(model.projectId, model.id)
    await dbRepo.delete(model.id)
  }
}

export const imageRepo = new ImageRepo()