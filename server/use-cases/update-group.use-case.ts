import type { IGroupRepo, IUseCase, IUserRepo, LoginUserDto, UpdateGroupDto } from './types'

export class UpdateGroupUseCase implements IUseCase {
  constructor(private projectRepo: IGroupRepo, private userRepo: IUserRepo) { }

  async execute(dto: UpdateGroupDto, loginDto: LoginUserDto) {
    const user = await this.userRepo.getUser(loginDto)
    if (!user.ok) return user

    return await this.projectRepo.update(dto)
  }
}
