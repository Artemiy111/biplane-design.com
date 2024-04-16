import { err, ok } from '../shared/result'
import type { CreateImageDto, IImageDbRepo, IImageFsRepo, IImageRepo, ImageId, UpdateImageDto } from '../use-cases/types'

export class ImageRepo implements IImageRepo {
  constructor(private dbRepo: IImageDbRepo, private fsRepo: IImageFsRepo) {}

  async getOne(id: ImageId) {
    return await this.dbRepo.getOne(id)
  }

  async getAllByProjectUri(uri: string) {
    return await this.dbRepo.getAllByProjectUri(uri)
  }

  async create(dto: CreateImageDto) {
    const createdInDb = await this.dbRepo.create(dto)
    if (!createdInDb.ok)
      return err(createdInDb.error)

    const createdInFs = await this.fsRepo.createImageFile(dto.projectUri, dto.filename, dto.data)
    if (!createdInFs.ok)
      return err(createdInFs.error)

    return createdInDb
  }

  async update(dto: UpdateImageDto) {
    const image = await this.dbRepo.getOne(dto.id)
    if (!image.ok)
      return err(image.error)

    const updatedInDb = await this.dbRepo.update(dto)
    if (!updatedInDb.ok)
      return err(updatedInDb.error)

    // !FIXME сделать перенос в другую папку при изменении projectUri
    const updatedInFs = await this.fsRepo.renameImageFile(image.value.projectUri, image.value.filename, dto.filename)
    if (!updatedInFs.ok)
      return err(updatedInFs.error)

    return updatedInDb
  }

  async delete(id: ImageId) {
    const image = await this.dbRepo.getOne(id)
    if (!image.ok)
      return err(image.error)

    const deletedInDb = await this.dbRepo.delete(image.value.id)
    if (!deletedInDb.ok)
      return err(deletedInDb.error)

    const deletedInFs = await this.fsRepo.deleteImageFile(image.value.projectUri, image.value.filename)
    if (!deletedInFs.ok)
      return err(deletedInFs.error)

    return ok(undefined)
  }
}
