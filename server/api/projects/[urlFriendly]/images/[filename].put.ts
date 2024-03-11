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

  const updateImage = db.update(images).set(body).where(and(
    eq(images.projectUrlFriendly, projectUrlFriendly),
    eq(images.filename, filename),
  )).returning().prepare('update_image')

  if (typeof body.order === 'undefined')
    return await updateImage.execute()

  await db.transaction(async (tx) => {
    const image = (await tx.select().from(images).where(and(
      eq(images.projectUrlFriendly, projectUrlFriendly),
      eq(images.filename, filename),
    )))[0]
    if (!image)
      throw createHttpError(HttpErrorCode.BadRequest)

    if (body.order! === image.order) { return await updateImage.execute() }
    else if (body.order! > image.order) {
      await tx.update(images).set({ order: sql`${image.order} - 1` }).where(and(
        gt(images.order, image.order),
        lte(images.order, body.order!),
      ))
    }
    else if (body.order! < image.order) {
      await tx.update(images).set({ order: sql`${image.order} + 1` }).where(and(
        gte(images.order, body.order!),
        lt(images.order, image.order),
      ))
    }
    return await updateImage.execute()
  })
})
