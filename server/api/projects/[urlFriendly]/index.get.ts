import { eq } from 'drizzle-orm'
import { db } from '~/server/db'

export default defineEventHandler(async (event) => {
  const projectUrlFriendly = event.context.params!.urlFriendly as string

  const project = await db.query.projects.findFirst({ with: {
    category: true,
    images: { orderBy: images => images.order },
  }, where: projects => eq(projects.urlFriendly, projectUrlFriendly) })
  return project
})
