import { eq } from 'drizzle-orm'
import { db } from '~/server/db'
import { projects } from '~/server/db/schema'

export default defineEventHandler(async (event) => {
  const projectUrlFriendly = event.context.params!.urlFriendly as string
  await db.delete(projects).where(eq(projects.urlFriendly, projectUrlFriendly)).returning()
})
