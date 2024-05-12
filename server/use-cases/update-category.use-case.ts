import type { ICategoryRepo, IUseCase, IUserRepo, LoginUserDto, UpdateCategoryDto } from './types'

export class UpdateCategoryUseCase implements IUseCase {
  constructor(private categoryRepo: ICategoryRepo, private userRepo: IUserRepo) { }

  async execute(dto: UpdateCategoryDto, loginDto: LoginUserDto) {
    const user = await this.userRepo.getUser(loginDto)
    if (!user.ok) return user

    return await this.categoryRepo.update(dto)
  }
}
