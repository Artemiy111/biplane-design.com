import type { GroupId, IGroupRepo, IUseCase, IUserRepo, LoginUserDto } from './types'

export class DeleteGroupUseCase implements IUseCase {
  constructor(private groupRepo: IGroupRepo, private userRepo: IUserRepo) { }

  async execute(id: GroupId, loginDto: LoginUserDto) {
    const user = await this.userRepo.getUser(loginDto)
    if (!user.ok) return user

    return await this.groupRepo.delete(id)
  }
}
