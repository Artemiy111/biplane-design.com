import fs from 'node:fs'
import { cwd } from 'node:process'
import path from 'node:path'
import { and, eq, gt, gte, lt, lte, sql } from 'drizzle-orm'
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
    const project = (await tx.select().from(projects).where(eq(projects.urlFriendly, projectUrlFriendly)))[0]
    if (!project)
      throw createHttpError(HttpErrorCode.BadRequest)

    if (typeof body.order === 'number') {
      const maxOrder = (await tx.select().from(projects).where(eq(projects.categoryId, body.categoryId))).length || null

      if (body.order <= 0 || (maxOrder !== null && body.order > maxOrder))
        throw createHttpError(HttpErrorCode.BadRequest)

      if (body.order > project.order) {
        await tx.update(projects).set({ order: sql`(${projects.order} - 1) * 1000` }).where(and(
          gt(projects.order, project.order),
          lte(projects.order, project.order),
        ))
      }
      else if (body.order < project.order) {
        await tx.update(projects).set({ order: sql`(${projects.order} + 1) * 1000` }).where(and(
          gte(projects.order, body.order),
          lt(projects.order, project.order),
        ))
      }

      await tx.update(projects).set({ order: body.order }).where(eq(projects.urlFriendly, projectUrlFriendly))
      await tx.update(projects).set({ order: sql`${projects.order} / 1000` }).where(gte(projects.order, 1000))
    }

    if (body.urlFriendly) {
      const dir = path.join(cwd(), 'public/images/projects')
      fs.renameSync(path.join(dir, projectUrlFriendly), path.join(dir, body.urlFriendly))
    }

    await tx.update(projects).set(body).where(eq(projects.urlFriendly, projectUrlFriendly))
  }).catch((e) => {
    console.error(e)
    return createHttpError(HttpErrorCode.InternalServerError)
  })
})
