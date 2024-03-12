import fs from 'node:fs'
import { cwd } from 'node:process'
import path from 'node:path'
import { and, eq, gt, gte, lt, lte, sql } from 'drizzle-orm'
import * as v from 'valibot'
import { db } from '~/server/db'
import { images } from '~/server/db/schema'
import { HttpErrorCode, createHttpError } from '~/server/exceptions'

const BodySchema = v.object({
  filename: v.optional(v.string()),
  order: v.optional(v.number()),
  title: v.optional(v.string()),
})
// TODO изменить название файла в файловой системе

export default defineEventHandler(async (event) => {
  const projectUrlFriendly = event.context.params!.urlFriendly as string
  const filename = event.context.params!.filename as string
  const body = await readValidatedBody(event, body => v.parse(BodySchema, body))

  await db.transaction(async (tx) => {
    try {
      const updateImage = tx.update(images).set(body).where(and(
        eq(images.projectUrlFriendly, projectUrlFriendly),
        eq(images.filename, filename),
      )).returning().prepare('update_image')

      if (body.order === undefined)
        return await updateImage.execute()

      const image = (await tx.select().from(images).where(and(
        eq(images.projectUrlFriendly, projectUrlFriendly),
        eq(images.filename, filename),
      )))[0]
      if (!image)
        throw createHttpError(HttpErrorCode.BadRequest)

      if (body.order === image.order) { return await updateImage.execute() }
      else if (body.order > image.order) {
        await tx.update(images).set({ order: sql`${image.order} - 1` }).where(and(
          gt(images.order, image.order),
          lte(images.order, body.order),
        ))
      }
      else if (body.order < image.order) {
        await tx.update(images).set({ order: sql`${image.order} + 1` }).where(and(
          gte(images.order, body.order),
          lt(images.order, image.order),
        ))
      }
      await updateImage.execute()

      if (body.filename) {
        const folder = path.join(cwd(), `public/images/projects/${projectUrlFriendly}`)
        const currentPath = path.join(folder, image.filename)
        const newPath = path.join(folder, body.filename)
        fs.renameSync(currentPath, newPath)
      }
    }
    catch (e) {
      tx.rollback()
      throw createHttpError(HttpErrorCode.InternalServerError)
    }
  })
})
