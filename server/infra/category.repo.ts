import { err, ok } from '../shared/result'
import type { CategoryId, CategoryDbDto, CategoryDto, CreateCategoryDto, UpdateCategoryDto, ProjectDto, GroupId } from '../use-cases/types'
import type { CategoryDbRepo } from './categoryDb.repo'
import type { ProjectRepo } from './project.repo'

const categoryMapper = {
  toDto(dbDto: CategoryDbDto, projects: ProjectDto[]): CategoryDto {
    return {
      ...dbDto,
      projects,
    }
  },
}
export class CategoryRepo {
  constructor(private dbRepo: CategoryDbRepo, private projectRepo: ProjectRepo) { }
  async getOne(id: CategoryId) {
    const category = await this.dbRepo.getOne(id)
    if (!category.ok) return category

    const projects = await this.projectRepo.getByCategoryId(id)
    if (!projects.ok) return projects

    const res = categoryMapper.toDto(category.value, projects.value)
    return ok(res)
  }

  async getByGroupId(groupId: GroupId) {
    const categories = await this.dbRepo.getByGroupId(groupId)
    if (!categories.ok) return categories

    try {
      const projects = await Promise.all(categories.value.map(async (category) => {
        const projects = await this.projectRepo.getByCategoryId(category.id)
        if (!projects.ok) throw projects.error
        return projects.value
      }))

      const res = categories.value.map((category, idx) => categoryMapper.toDto(category, projects[idx]))
      return ok(res)
    }
    catch (_e) {
      const error = _e as Error
      return err(error)
    }
  }

  async getAll() {
    const categories = await this.dbRepo.getAll()
    if (!categories.ok) return categories

    try {
      const projects = await Promise.all(categories.value.map(async (category) => {
        const projects = await this.projectRepo.getByCategoryId(category.id)
        if (!projects.ok) throw projects.error
        return projects.value
      }))

      const res = categories.value.map((category, idx) => categoryMapper.toDto(category, projects[idx]))
      return ok(res)
    }
    catch (_e) {
      const error = _e as Error
      return err(error)
    }
  }

  async create(dto: CreateCategoryDto) {
    const created = await this.dbRepo.create(dto)
    if (!created.ok) return created

    return this.getOne(created.value.id)
  }

  async update(dto: UpdateCategoryDto) {
    const updated = await this.dbRepo.update(dto)
    if (!updated.ok) return updated

    return this.getOne(updated.value.id)
  }

  async delete(id: CategoryId) {
    return this.dbRepo.delete(id)
  }
}
