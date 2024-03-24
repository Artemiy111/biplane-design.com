import { and, eq, getTableColumns, sql } from 'drizzle-orm'
import { db } from '~/server/db'
import { projects } from '~/server/db/schema'

export default defineEventHandler(async (event) => {
  const projectUrlFriendly = event.context.params!.urlFriendly as string

  return await db.transaction(async (tx) => {
    const deleted = db.delete(projects).where(eq(projects.urlFriendly, projectUrlFriendly)).returning()

    const remainProjects = await tx.select(({ ...getTableColumns(projects), newOrder: sql<number>`row_number() over (order by ${projects.order})`.mapWith(Number).as('new_order') })).from(projects)
    await Promise.all(
      remainProjects.map((proj) => {
        return tx.update(projects).set({ order: proj.newOrder * 1000 }).where(
          eq(projects.urlFriendly, proj.urlFriendly),
        )
      }),
    )

    await Promise.all(
      remainProjects.map((proj) => {
        return tx.update(projects).set({ order: proj.newOrder }).where(
          eq(projects.urlFriendly, proj.urlFriendly),
        )
      }),
    )
    return deleted
  })
})
