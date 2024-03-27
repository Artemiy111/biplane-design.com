import { err } from '../shared/result'
import type { CreateImageDto, IImageDbRepo, IImageFsRepo, IImageRepo, ImageId, UpdateImageDto } from '../use-cases/types'

export class ImageRepo implements IImageRepo {
  constructor(private dbRepo: IImageDbRepo, private fsRepo: IImageFsRepo) {}

  async getImage(id: ImageId) {
    return await this.dbRepo.getImage(id)
  }

  async getImagesByProjectUri(uri: string) {
    return await this.dbRepo.getImagesByProjectUri(uri)
  }

  async createImage(_dto: CreateImageDto) {
    return err(new Error(`not impl`))
  }

  async updateImage(_dto: UpdateImageDto) {
    return err(new Error(`not impl`))
  }

  async deleteImage(_id: ImageId) {
    return err(new Error(`not impl`))
  }
}
