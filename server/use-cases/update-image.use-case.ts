import type { IImageRepo, IUseCase, UpdateImageDto } from './types'

export class UpdateImageUseCase implements IUseCase {
  constructor(private imageRepo: IImageRepo) { }

  async execute(dto: UpdateImageDto) {
    return await this.imageRepo.update(dto)
  }
}
