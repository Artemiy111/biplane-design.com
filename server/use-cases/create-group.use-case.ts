import type { CreateGroupDto, IGroupRepo, IUseCase, IUserRepo, LoginUserDto } from './types'

export class CreateGroupUseCase implements IUseCase {
  constructor(private groupRepo: IGroupRepo, private userRepo: IUserRepo) { }

  async execute(dto: CreateGroupDto, loginDto: LoginUserDto) {
    const user = await this.userRepo.getUser(loginDto)
    if (!user.ok) return user

    return await this.groupRepo.create(dto)
  }
}
