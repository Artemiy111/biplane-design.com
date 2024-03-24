import { db } from '~/server/db'

export default defineEventHandler(async () => {
  const groups = await db.query.groups.findMany({
    with: {
      categories: {
        with: {
          projects: {
            with: {
              images: { orderBy: images => images.order },
            },
            orderBy: projects => projects.order,
          },
        },
        orderBy: categories => categories.order,
      },
    },
    orderBy: groups => groups.order,
  })
  return groups
})
