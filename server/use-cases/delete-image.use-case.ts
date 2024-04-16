import { err } from '../shared/result'
import type { IImageRepo, IUseCase, IUserRepo, ImageId } from './types'

export class DeleteImageUseCase implements IUseCase {
  constructor(private imageRepo: IImageRepo, private userRepo: IUserRepo) {}

  async execute(id: ImageId) {
    if (!(await this.userRepo.getUser()))
      return err(new Error('Unauthorized'))

    return await this.imageRepo.delete(id)
  }
}
