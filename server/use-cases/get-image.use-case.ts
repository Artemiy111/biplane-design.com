import type { IImageRepo, IUseCase, ImageId } from './types'

export class GetImageUseCase implements IUseCase {
  constructor(private repo: IImageRepo) {}

  async execute(id: ImageId) {
    return this.repo.getImage(id)
  }
}
