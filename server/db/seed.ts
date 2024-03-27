import { sql } from 'drizzle-orm'
import { categories, groups, projects } from './schema'
import { db } from '.'
import { toUrlFriendly } from '~/utils/toUrlFriendly'

const groupsBiplane = ['Архитектура', 'Графика']
const categoriesBiplane = [
  ['Лучшие', 'Здания', 'Офисы', 'Общественное', 'Рестораны', 'Квартиры'],
  ['Логотипы', 'Этикетки'],
]

db.transaction((tx) => {
  tx.delete(groups)
  groupsBiplane.forEach(async (group, idx) => {
    const insertedGroup = (await tx.insert(groups).values({ title: group, urlFriendly: toUrlFriendly(group), order: idx + 1 }).returning())[0]

    categoriesBiplane[idx].forEach((async (category, idx) => {
      await tx.insert(categories).values({
        title: category,
        urlFriendly: toUrlFriendly(category),
        groupId: insertedGroup.id,
        order: idx + 1,
      },
      )
    }))
  })
  return tx.query.categories.findMany()
})
