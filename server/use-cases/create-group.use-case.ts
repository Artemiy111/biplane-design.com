import type { CreateGroupDto, IGroupRepo, IUseCase } from './types'

export class CreateGroupUseCase implements IUseCase {
  constructor(private groupRepo: IGroupRepo) { }

  async execute(dto: CreateGroupDto) {
    return await this.groupRepo.create(dto)
  }
}
