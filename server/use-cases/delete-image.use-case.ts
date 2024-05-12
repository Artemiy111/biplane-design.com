import type { IImageRepo, IUseCase, IUserRepo, ImageId, LoginUserDto } from './types'

export class DeleteImageUseCase implements IUseCase {
  constructor(private imageRepo: IImageRepo, private userRepo: IUserRepo) { }

  async execute(id: ImageId, loginDto: LoginUserDto) {
    const user = await this.userRepo.getUser(loginDto)
    if (!user.ok) return user

    return await this.imageRepo.delete(id)
  }
}
