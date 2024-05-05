import path from 'node:path'
import fs from 'node:fs'
import { cwd } from 'node:process'
import { and, eq, getTableColumns, inArray, sql } from 'drizzle-orm'
import * as z from 'zod'
import { db } from '~/server/db'
import { images } from '~/server/db/schema'
import { HttpErrorCode, createHttpError } from '~/server/exceptions'

const imagesDeleteSchema = z.object({
  filenames: z.array(z.string()).min(1).nonempty(),
})

export default defineEventHandler(async (event) => {
  const projectUrlFriendly = event.context.params!.urlFriendly as string
  const body = await readValidatedBody(event, imagesDeleteSchema.safeParse)
  if (!body.success)
    return createHttpError(HttpErrorCode.BadRequest)
  const { filenames } = body.data

  const folder = path.join(cwd(), `public/images/projects/${projectUrlFriendly}`)

  await db.transaction(async (tx) => {
    const deletedImagesDb = await tx.delete(images).where(and(
      eq(images.projectUrlFriendly, projectUrlFriendly),
      inArray(images.filename, filenames),
    )).returning()

    const remainImages = await tx.select(({ ...getTableColumns(images), newOrder: sql<number>`row_number() over (order by ${images.order})`.mapWith(Number).as('new_order') })).from(images)
    await Promise.all(
      remainImages.map((img) => {
        return tx.update(images).set({ order: img.newOrder * 1000 }).where(and(
          eq(images.projectUrlFriendly, img.projectUrlFriendly),
          eq(images.filename, img.filename),
        ))
      }),
    )

    await Promise.all(
      remainImages.map((img) => {
        return tx.update(images).set({ order: img.newOrder }).where(and(
          eq(images.projectUrlFriendly, img.projectUrlFriendly),
          eq(images.filename, img.filename),
        ))
      }),
    )

    filenames.forEach(filename => fs.unlinkSync(path.join(folder, filename)))
    return deletedImagesDb
  }).catch((e) => {
    console.log(e)
    throw createHttpError(HttpErrorCode.InternalServerError)
  })
})
