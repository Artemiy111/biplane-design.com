import type { IProjectRepo, IUseCase, IUserRepo, LoginUserDto, UpdateProjectDto } from './types'

export class UpdateProjectUseCase implements IUseCase {
  constructor(private projectRepo: IProjectRepo, private userRepo: IUserRepo) { }

  async execute(dto: UpdateProjectDto, loginDto: LoginUserDto) {
    const user = await this.userRepo.getUser(loginDto)
    if (!user.ok) return user

    return await this.projectRepo.update(dto)
  }
}
