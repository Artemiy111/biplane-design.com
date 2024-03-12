import fs from 'node:fs'
import { cwd } from 'node:process'
import path from 'node:path'
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

  await db.transaction(async (tx) => {
    await tx.update(projects).set(body).where(eq(projects.urlFriendly, projectUrlFriendly))

    if (body.urlFriendly) {
      const dir = path.join(cwd(), 'public/images/projects')
      try {
        fs.renameSync(path.join(dir, projectUrlFriendly), path.join(dir, body.urlFriendly))
      }
      catch (e) {
        tx.rollback()
        console.error(e)
        return createHttpError(HttpErrorCode.InternalServerError)
      }
    }
  })
})
