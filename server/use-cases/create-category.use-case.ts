import type { CreateCategoryDto, ICategoryRepo, IUseCase, IUserRepo, LoginUserDto } from './types'

export class CreateCategoryUseCase implements IUseCase {
  constructor(private categoryRepo: ICategoryRepo, private userRepo: IUserRepo) { }

  async execute(dto: CreateCategoryDto, loginDto: LoginUserDto) {
    const user = await this.userRepo.getUser(loginDto)
    if (!user.ok) return user

    return await this.categoryRepo.create(dto)
  }
}
