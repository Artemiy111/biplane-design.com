import { err } from '../shared/result'
import type { IImageRepo, IUseCase, IUserRepo, UpdateImageDto } from './types'

export class UpdateImageUseCase implements IUseCase {
  constructor(private imageRepo: IImageRepo, private userRepo: IUserRepo) {}

  async execute(dto: UpdateImageDto) {
    if (!(await this.userRepo.getUser()))
      return err(new Error(`Unauthorized`))

    return await this.imageRepo.update(dto)
  }
}
