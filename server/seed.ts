import { logger } from './shared/logger'
import type { CreateCategoryDto, CreateGroupDto } from './use-cases/types'
import { createCategoryUseCase, createGroupUseCase } from './di'

import { toUrlFriendly } from '~/utils/toUrlFriendly'

const groupsBiplane = ['Архитектура', 'Графика']
const categoriesBiplane = [
  ['Лучшие', 'Здания', 'Офисы', 'Общественное', 'Рестораны', 'Квартиры'],
  ['Логотипы', 'Этикетки'],
]

const groupsToCreate: CreateGroupDto[] = groupsBiplane.map((g) => {
  return {
    title: g,
    uri: toUrlFriendly(g),
  }
})

// const categoriesToCreate: CreateCategoryDto =

const createdGroups = await Promise.all(groupsToCreate.map(async (g, idx) => {
  await new Promise(res => setTimeout(res, idx * 500))
  return await createGroupUseCase.execute(g)
}))
logger.log(createdGroups)
const createdCategories = createdGroups.map((g, idx) => {
  if (g.ok) {
    const dtos: CreateCategoryDto[] = categoriesBiplane[idx].map(c => ({
      title: c,
      uri: toUrlFriendly(c),
      groupId: g.value.id,
    }))
    return Promise.all(dtos.map(dto => createCategoryUseCase.execute(dto)))
  }
  return []
})
const created = await Promise.all(createdCategories)
logger.log(created)
