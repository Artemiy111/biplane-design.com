import { categories, groups, projects } from './schema'
import { db } from '.'
import { toUrlFriendly } from '~/utils/toUrlFriendly'

const groupsBiplane = ['Архитектура', 'Графика']
const categoriesBiplane = [
  ['Лучшие', 'Здания', 'Офисы', 'Общественное', 'Рестораны', 'Квартиры'],
  ['Логотипы', 'Этикетки'],
]

groupsBiplane.forEach(async (group, idx) => {
  const insertedGroup = await db.insert(groups).values({ title: group, urlFriendly: toUrlFriendly(group) }).returning()

  categoriesBiplane[idx].forEach((async (category) => {
    await db.insert(categories).values({
      title: category,
      urlFriendly: toUrlFriendly(category),
      groupId: insertedGroup[0].id,
    },
    )
  }))
})
