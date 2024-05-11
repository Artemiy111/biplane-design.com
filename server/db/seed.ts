import { categories, groups } from './schema'
import { db } from '.'
import { toUri } from '~/utils/toUri'

const groupsBiplane = ['Архитектура', 'Графика']
const categoriesBiplane = [
  ['Лучшие', 'Здания', 'Офисы', 'Общественное', 'Рестораны', 'Квартиры'],
  ['Логотипы', 'Этикетки'],
]

db.transaction((tx) => {
  tx.delete(groups)
  groupsBiplane.forEach(async (group, idx) => {
    const insertedGroup = (await tx.insert(groups).values({ title: group, urlFriendly: toUri(group), order: idx + 1 }).returning())[0]

    categoriesBiplane[idx].forEach((async (category, idx) => {
      await tx.insert(categories).values({
        title: category,
        urlFriendly: toUri(category),
        groupId: insertedGroup.id,
        order: idx + 1,
      },
      )
    }))
  })
  return tx.query.categories.findMany()
})
