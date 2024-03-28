import { err } from '../shared/result'
import type { CreateImageDto, IImageDbRepo, IImageFsRepo, IImageRepo, ImageId, UpdateImageDto } from '../use-cases/types'

export class ImageRepo implements IImageRepo {
  constructor(private dbRepo: IImageDbRepo, private fsRepo: IImageFsRepo) {}

  async getOne(id: ImageId) {
    return await this.dbRepo.getOne(id)
  }

  async getAllByProjectUri(uri: string) {
    return await this.dbRepo.getAllByProjectUri(uri)
  }

  async create(_dto: CreateImageDto) {
    return err(new Error(`not impl`))
  }

  async update(_dto: UpdateImageDto) {
    return err(new Error(`not impl`))
  }

  async delete(_id: ImageId) {
    return err(new Error(`not impl`))
  }
}
