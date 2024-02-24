import { db } from '~/server/db'

export default defineEventHandler(async () => {
  const groups = await db.query.groups.findMany({
    with: {
      categories: {
        with: {
          projects: {
            with: {
              images: true,
            },
          },
        },
      },
    },
  })
  return groups
})
