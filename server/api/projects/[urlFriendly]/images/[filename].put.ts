/* eslint-disable no-console */
import fs from 'node:fs'
import { cwd } from 'node:process'
import path from 'node:path'
import { and, eq, gt, gte, lt, lte, max, sql } from 'drizzle-orm'
import * as z from 'zod'
import { db } from '~/server/db'
import { images } from '~/server/db/schema'
import { HttpErrorCode, createHttpError } from '~/server/exceptions'

const bodySchema = z.object({
  filename: z.string(),
  order: z.number(),
  title: z.string()
})

export default defineEventHandler(async (event) => {
  const projectUrlFriendly = event.context.params!.urlFriendly as string
  const filename = decodeURI(event.context.params!.filename as string)
  const body = await readValidatedBody(event, bodySchema.parse)

  return await db.transaction(async (tx) => {
    try {
      const updateImage = tx.update(images).set(body).where(and(
        eq(images.projectUrlFriendly, projectUrlFriendly),
        eq(images.filename, filename),
      )).returning()

      const image = (await tx.select().from(images).where(and(
        eq(images.projectUrlFriendly, projectUrlFriendly),
        eq(images.filename, filename),
      )))[0]

      if (body.order) {
        const { maxOrder } = (await tx.select({ maxOrder: max(images.order) }).from(images)
          .where(eq(images.projectUrlFriendly, projectUrlFriendly)))[0]

        if (!image || body.order <= 0 || (maxOrder !== null && body.order > maxOrder))
          throw createHttpError(HttpErrorCode.BadRequest)

        if (body.order > image.order) {
          await tx.update(images).set({ order: sql`(${images.order} - 1) * 1000` }).where(and(
            gt(images.order, image.order),
            lte(images.order, body.order),
          ))
        }
        else if (body.order < image.order) {
          await tx.update(images).set({ order: sql`(${images.order} + 1) * 1000` }).where(and(
            gte(images.order, body.order),
            lt(images.order, image.order),
          ))
        }

        await tx.update(images).set({ order: body.order }).where(and(
          eq(images.projectUrlFriendly, projectUrlFriendly),
          eq(images.filename, filename),
        ))
        await tx.update(images).set({ order: sql`${images.order} / 1000` }).where(gte(images.order, 1000))
      }

      if (body.filename) {
        const folder = path.join(cwd(), `/public/images/projects/${projectUrlFriendly}`)
        const currentPath = path.join(folder, image.filename)
        const newPath = path.join(folder, body.filename)
        fs.renameSync(currentPath, newPath)
      }
      await updateImage.execute()
    }
    catch (e) {
      console.log(e)
      throw createHttpError(HttpErrorCode.InternalServerError)
    }
  })
})
