import type { IImageRepo, IUseCase, IUserRepo, LoginUserDto, UpdateImageDto } from './types'

export class UpdateImageUseCase implements IUseCase {
  constructor(private imageRepo: IImageRepo, private userRepo: IUserRepo) { }

  async execute(dto: UpdateImageDto, loginDto: LoginUserDto) {
    const user = await this.userRepo.getUser(loginDto)
    if (!user.ok) return user

    return await this.imageRepo.update(dto)
  }
}
