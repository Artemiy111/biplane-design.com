import type { CreateCategoryDto, CreateGroupDto } from '../use-cases/types'

import { toUri } from '../../src/shared/lib/utils/to-uri'
import { categoryRepo, groupRepo } from '../di'
import { logger } from '../shared/logger'

const groupsBiplane = ['Архитектура', 'Графика']
const categoriesBiplane = [
  ['Лучшие', 'Здания', 'Офисы', 'Общественное', 'Рестораны', 'Квартиры'],
  ['Логотипы', 'Этикетки'],
]

const groupsToCreate: CreateGroupDto[] = groupsBiplane.map((g) => {
  return {
    title: g,
    uri: toUri(g),
  }
})

const createdGroups = await Promise.all(groupsToCreate.map(async (g, idx) => {
  return await groupRepo.create(g)
}))
logger.log(createdGroups)

const createdCategories = createdGroups.map(async (g, idx) => {
  if (g) {
    const dtos: CreateCategoryDto[] = categoriesBiplane[idx].map(c => ({
      title: c,
      uri: toUri(c),
      groupId: g.id,
    }))
    return Promise.all(dtos.map(async (dto, _idx) => {
      return await categoryRepo.create(dto)
    }))
  }
  return []
})
const created = await Promise.all(createdCategories)
console.log(created)
