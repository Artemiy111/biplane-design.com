import { categories, groups, projects } from './schema'
import { db } from '.'
import { toUrlFriendly } from '~/utils/toUrlFriendly'

const groupsBiplane = ['Архитектура', 'Графика']
const categoriesBiplane = [
  ['Лучшие', 'Здания', 'Офисы', 'Общественное', 'Рестораны', 'Квартиры'],
  ['Логотипы', 'Этикетки'],
]

await db.delete(groups)

groupsBiplane.forEach(async (group, idx) => {
  const insertedGroup = (await db.insert(groups).values({ title: group, urlFriendly: toUrlFriendly(group) }).returning())[0]

  categoriesBiplane[idx].forEach((async (category) => {
    await db.insert(categories).values({
      title: category,
      urlFriendly: toUrlFriendly(category),
      groupId: insertedGroup.id,
    },
    )
  }))
})
