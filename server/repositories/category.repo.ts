import type { CategoryId, GroupId } from '../db/schema'
import type { CreateCategoryDto, UpdateCategoryDto } from '../types'
import type { CategoryDbRepo } from './categoryDb.repo'
import type { ProjectRepo } from './project.repo'

import { categoryMapper } from '../mappers/category.mapper'
import { categoryDbMapper } from '../mappers/categoryDb.mapper'

export class CategoryRepo {
  constructor(private dbRepo: CategoryDbRepo, private projectRepo: ProjectRepo) { }
  async getOne(id: CategoryId) {
    const model = await this.dbRepo.getOne(id)
    const projects = await this.projectRepo.getByCategoryId(id)
    return categoryMapper.toDto(model, projects)
  }

  async getAllByGroupId(groupId: GroupId) {
    const models = await this.dbRepo.getByGroupId(groupId)
    return Promise.all(models.map(async (model) => {
      const projects = await this.projectRepo.getByCategoryId(model.id)
      return categoryMapper.toDto(model, projects)
    }))
  }

  async getAll() {
    const models = await this.dbRepo.getAll()
    return Promise.all(models.map(async (model) => {
      const projects = await this.projectRepo.getByCategoryId(model.id)
      return categoryMapper.toDto(model, projects)
    }))
  }

}
