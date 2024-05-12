import type { IProjectRepo, IUseCase, IUserRepo, LoginUserDto, ProjectId } from './types'

export class DeleteProjectUseCase implements IUseCase {
  constructor(private projectRepo: IProjectRepo, private userRepo: IUserRepo) { }

  async execute(id: ProjectId, loginDto: LoginUserDto) {
    const user = await this.userRepo.getUser(loginDto)
    if (!user.ok) return user

    return await this.projectRepo.delete(id)
  }
}
