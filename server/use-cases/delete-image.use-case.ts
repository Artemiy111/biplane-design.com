import type { IImageRepo, IUseCase, ImageId } from './types'

export class DeleteImageUseCase implements IUseCase {
  constructor(private imageRepo: IImageRepo) { }

  async execute(id: ImageId) {
    return await this.imageRepo.delete(id)
  }
}
