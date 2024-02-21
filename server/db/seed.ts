import { categories, projects, themes } from './schema'
import { db } from '.'

const themesBiplan = ['Архитектура', 'Графика']
const categoriesArchitecture = ['Лучшие', 'Здания', 'Офисы', 'Общественное', 'Рестораны', 'Квартиры']
const categoriesDesign = ['Логотипы', 'Этикетки']

// themesBiplan.forEach(async (theme) => {
//   await db.insert(themes).values({ title: theme })

//   categoriesArchitecture.forEach((async (category) => {
//     await db.insert(categories).values({
//       title:
//        category,
//       themeId: await db.query.themes.findFirst({'where': ({themes, {eq}}) => }),
//     })
//   }))
// })
