import type { IGroupRepo, IUseCase, UpdateGroupDto } from './types'

export class UpdateGroupUseCase implements IUseCase {
  constructor(private projectRepo: IGroupRepo) { }

  async execute(dto: UpdateGroupDto) {
    return await this.projectRepo.update(dto)
  }
}
