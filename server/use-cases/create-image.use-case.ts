import { err } from '../shared/result'
import type { CreateImageDto, IImageRepo, IUseCase, IUserRepo } from './types'

export class CreateImageUseCase implements IUseCase {
  constructor(private imageRepo: IImageRepo, private userRepo: IUserRepo) { }

  async execute(dto: CreateImageDto) {
    if (!(await this.userRepo.getUser()))
      return err(new Error(`Unauthorized`))

    return await this.imageRepo.create(dto)
  }
}
