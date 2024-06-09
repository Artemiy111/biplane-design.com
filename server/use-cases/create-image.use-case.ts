import type { CreateImageDto, IImageRepo, IUseCase } from './types'

export class CreateImageUseCase implements IUseCase {
  constructor(private imageRepo: IImageRepo) { }

  async execute(dto: CreateImageDto) {
    return await this.imageRepo.create(dto)
  }
}
