import type { CreateImageDto, IImageRepo, IUseCase, IUserRepo, LoginUserDto } from './types'

export class CreateImageUseCase implements IUseCase {
  constructor(private imageRepo: IImageRepo, private userRepo: IUserRepo) { }

  async execute(dto: CreateImageDto, loginDto: LoginUserDto) {
    const user = await this.userRepo.getUser(loginDto)
    if (!user.ok) return user
    return await this.imageRepo.create(dto)
  }
}
