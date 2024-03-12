/* eslint-disable no-console */
import path from 'node:path'
import fs from 'node:fs'
import { cwd } from 'node:process'
import { eq, inArray } from 'drizzle-orm'
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
    try {
      const deletedImagesDb = await tx.delete(images).where(inArray(images.filename, filenames)).returning()

      filenames.forEach(filename => fs.unlinkSync(path.join(folder, filename)))

      return deletedImagesDb
    }
    catch (e) {
      tx.rollback()
      console.log(e)
      return createHttpError(HttpErrorCode.InternalServerError)
    }
  })
})
