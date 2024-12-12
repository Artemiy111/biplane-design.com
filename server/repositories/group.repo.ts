import type { GroupId } from '../db/schema'
import type { CreateGroupDto, GroupDto, UpdateGroupDto } from '../types'
import type { CategoryRepo } from './category.repo'
import type { GroupDbRepo } from './groupDb.repo'

import { groupMapper } from '../mappers/group.mapper'

export class GroupRepo {
  constructor(private dbRepo: GroupDbRepo, private categoryRepo: CategoryRepo) { }

  async getOne(id: GroupId): Promise<GroupDto> {
    const model = await this.dbRepo.getOne(id)
    const categories = await this.categoryRepo.getAllByGroupId(model.id)
    return groupMapper.toDto(model, categories)
  }

  async getAll(): Promise<GroupDto[]> {
    const models = await this.dbRepo.getAll()

    return await Promise.all(models.map(async (model) => {
      const categories = await this.categoryRepo.getAllByGroupId(model.id)
      return groupMapper.toDto(model, categories)
    }))
  }
}
