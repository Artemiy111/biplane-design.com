import { db } from '~/server/db'

export default defineEventHandler(async (event) => {
  const projectUrlFriendly = event.context.params!.projectId

  return await db.query.projects.findFirst({ with: { category: true, images: true }, where: (projects, { eq }) => eq(projects.urlFriendly, projectUrlFriendly) })
})
