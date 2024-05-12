import type { CreateProjectDto, IProjectRepo, IUseCase, IUserRepo, LoginUserDto } from './types'

export class CreateProjectUseCase implements IUseCase {
  constructor(private projectRepo: IProjectRepo, private userRepo: IUserRepo) { }

  async execute(dto: CreateProjectDto, loginDto: LoginUserDto) {
    const user = await this.userRepo.getUser(loginDto)
    if (!user.ok) return user

    return await this.projectRepo.create(dto)
  }
}
