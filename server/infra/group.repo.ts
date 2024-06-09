import { err, ok } from '../shared/result'
import type { GroupDbDto, CategoryDto, GroupDto, GroupId, CreateGroupDto, UpdateGroupDto } from '../use-cases/types'
import type { CategoryRepo } from './category.repo'
import type { GroupDbRepo } from './groupDb.repo'

const groupMapper = {
  toDto(dbDto: GroupDbDto, categories: CategoryDto[]): GroupDto {
    return {
      ...dbDto,
      categories: categories,
    }
  },
}

export class GroupRepo {
  constructor(private dbRepo: GroupDbRepo, private categoryRepo: CategoryRepo) { }

  async getOne(id: GroupId) {
    const group = await this.dbRepo.getOne(id)
    if (!group.ok) return group

    const categories = await this.categoryRepo.getByGroupId(id)
    if (!categories.ok) return categories

    const res = groupMapper.toDto(group.value, categories.value)
    return ok(res)
  }

  async getAll() {
    const groups = await this.dbRepo.getAll()
    if (!groups.ok) return groups

    try {
      const categories = await Promise.all(groups.value.map(async (group) => {
        const categories = await this.categoryRepo.getByGroupId(group.id)
        if (!categories.ok) throw categories.error
        return categories.value
      }))

      const res = groups.value.map((group, idx) => groupMapper.toDto(group, categories[idx]))
      return ok(res)
    }
    catch (_e) {
      const error = _e as Error
      return err(error)
    }
  }

  async create(dto: CreateGroupDto) {
    const created = await this.dbRepo.create(dto)
    if (!created.ok) return created
    return this.getOne(created.value.id)
  }

  async update(dto: UpdateGroupDto) {
    const updated = await this.dbRepo.update(dto)
    if (!updated.ok) return updated

    return this.getOne(updated.value.id)
  }

  async delete(id: GroupId) {
    return this.dbRepo.delete(id)
  }
}
