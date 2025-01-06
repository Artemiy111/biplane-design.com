import type { CategoryId, GroupId } from '../db/schema'
import type { CreateCategoryDto, UpdateCategoryDto } from '../types'
import { categoryDbRepo as dbRepo } from './categoryDb.repo'
import { projectRepo } from './project.repo'
import { categoryMapper } from '../mappers/category.mapper'
import { categoryDbMapper } from '../mappers/categoryDb.mapper'

class CategoryRepo {
  async getOne(id: CategoryId) {
    const model = await dbRepo.getOne(id)
    const projects = await projectRepo.getByCategoryId(id)
    return categoryMapper.toDto(model, projects)
  }

  async getAllByGroupId(groupId: GroupId) {
    const models = await dbRepo.getByGroupId(groupId)
    return Promise.all(models.map(async (model) => {
      const projects = await projectRepo.getByCategoryId(model.id)
      return categoryMapper.toDto(model, projects)
    }))
  }

  async getAll() {
    const models = await dbRepo.getAll()
    return Promise.all(models.map(async (model) => {
      const projects = await projectRepo.getByCategoryId(model.id)
      return categoryMapper.toDto(model, projects)
    }))
  }
}

export const categoryRepo = new CategoryRepo()