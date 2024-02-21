import { db } from '~/server/db'

export default defineEventHandler(async () => {
  const themes = await db.query.themes.findMany({
    with: {
      categories: {
        with: {
          projects: true,
        },
      },
    },
  })
  return themes
})
