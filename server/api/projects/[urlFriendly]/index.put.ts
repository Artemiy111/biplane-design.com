import { eq } from 'drizzle-orm'
import { db } from '~/server/db'
import { projectInsertSchema, projects } from '~/server/db/schema'
import { HttpErrorCode, createHttpError } from '~/server/exceptions'

export default defineEventHandler(async (event) => {
  const projectUrlFriendly = event.context.params!.urlFriendly as string
  const validated = await readValidatedBody(event, projectInsertSchema.safeParse)
  if (!validated.success)
    return createHttpError(HttpErrorCode.BadRequest)
  const body = validated.data

  await db.update(projects).set(body).where(eq(projects.urlFriendly, projectUrlFriendly))
})
