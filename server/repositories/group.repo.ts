import type { GroupId } from '../db/schema'
import { groupMapper } from '../mappers/group.mapper'
import type { CreateGroupDto, UpdateGroupDto } from '../use-cases/types'
import type { CategoryRepo } from './category.repo'
import type { GroupDbRepo } from './groupDb.repo'

export class GroupRepo {
  constructor(private dbRepo: GroupDbRepo, private categoryRepo: CategoryRepo) { }

  async getOne(id: GroupId) {
    const model = await this.dbRepo.getOne(id)
    const categories = await this.categoryRepo.getAllByGroupId(model.id)
    return groupMapper.toDto(model, categories)
  }

  async getAll() {
    const models = await this.dbRepo.getAll()

    return await Promise.all(models.map(async (model) => {
      const categories = await this.categoryRepo.getAllByGroupId(model.id)
      return groupMapper.toDto(model, categories)
    }))
  }

  async create(dto: CreateGroupDto) {
    const created = await this.dbRepo.create(dto)
    const categories = await this.categoryRepo.getAllByGroupId(created.id)
    return groupMapper.toDto(created, categories)
  }

  async update(id: GroupId, dto: UpdateGroupDto) {
    const updated = await this.dbRepo.update(id, dto)
    const categories = await this.categoryRepo.getAllByGroupId(updated.id)
    return groupMapper.toDto(updated, categories)
  }

  async delete(id: GroupId) {
    return this.dbRepo.delete(id)
  }
}
