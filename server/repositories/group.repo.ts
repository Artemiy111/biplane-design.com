import type { GroupId } from '../db/schema'
import type { GroupDto } from '../types'

import { groupMapper } from '../mappers/group.mapper'
import { categoryRepo } from './category.repo'
import { groupDbRepo as dbRepo } from './groupDb.repo'

class GroupRepo {
  async getOne(id: GroupId): Promise<GroupDto> {
    const model = await dbRepo.getOne(id)
    const categories = await categoryRepo.getAllByGroupId(model.id)
    return groupMapper.toDto(model, categories)
  }

  async getAll(): Promise<GroupDto[]> {
    const models = await dbRepo.getAll()

    return await Promise.all(models.map(async (model) => {
      const categories = await categoryRepo.getAllByGroupId(model.id)
      return groupMapper.toDto(model, categories)
    }))
  }
}

export const groupRepo = new GroupRepo()
