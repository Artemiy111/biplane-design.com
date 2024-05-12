import type { CategoryId, ICategoryRepo, IUseCase, IUserRepo, LoginUserDto } from './types'

export class DeleteCategoryUseCase implements IUseCase {
  constructor(private categoryRepo: ICategoryRepo, private userRepo: IUserRepo) { }

  async execute(id: CategoryId, loginDto: LoginUserDto) {
    const user = await this.userRepo.getUser(loginDto)
    if (!user.ok) return user

    return await this.categoryRepo.delete(id)
  }
}
