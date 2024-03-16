import { cwd } from 'node:process'
import path from 'node:path'
import fs from 'node:fs'
import type { Buffer } from 'node:buffer'
import * as z from 'zod'
import { and, eq, inArray, max, sql } from 'drizzle-orm'
import { db } from '~/server/db'
import type { ImageCreate } from '~/server/db/schema'
import { images } from '~/server/db/schema'
import { HttpErrorCode, createHttpError } from '~/server/exceptions'

const formDataSchema = z.array(z.object({
  name: z.string(),
  filename: z.string(),
  type: z.string(),
  data: z.any(),
})).nonempty()

export default defineEventHandler(async (event) => {
  const projectUrlFriendly = event.context.params!.urlFriendly as string
  const formData = await readMultipartFormData(event)
  if (!formData)
    throw createHttpError(HttpErrorCode.BadRequest)

  const data = formDataSchema.safeParse(formData)
  if (!data.success)
    throw createHttpError(HttpErrorCode.BadRequest)

  const folder = path.join(cwd(), `public/images/projects/${projectUrlFriendly}`)

  return await db.transaction(async (tx) => {
    try {
      const { order: startOrderNullable } = (await tx.select({ order: sql<number | null>`${max(images.order)} + 1` })
        .from(images).where(eq(images.projectUrlFriendly, projectUrlFriendly)))[0]
      const startOrder = startOrderNullable === null ? 1 : startOrderNullable

      const filenames = data.data.map(file => file.filename)

      const overlappingFilenamesFromDb = await tx.select({ filename: images.filename }).from(images).where(and(
        eq(images.projectUrlFriendly, projectUrlFriendly),
        inArray(images.filename, filenames),
      ))
      const overlappingFilenames = new Set(overlappingFilenamesFromDb.map(image => image.filename))

      const createUniqueFilename = (filename: string) => {
        const [name, ext] = filename.split('.')
        return `${name}_${new Date().toISOString()}.${ext}`
      }

      const filesInfo: Array<ImageCreate & { path: string, data: Buffer }> = data.data.map((file, idx) => {
        const filename = overlappingFilenames.has(file.filename) ? createUniqueFilename(file.filename) : file.filename
        return {
          projectUrlFriendly,
          filename,
          order: startOrder + idx,
          path: path.join(folder, filename),
          data: file.data,
        }
      })

      const createdFilesDb = await tx.insert(images).values(filesInfo).returning()

      if (!fs.existsSync(folder))
        fs.mkdirSync(folder)

      filesInfo.forEach((file) => {
        fs.writeFileSync(file.path, file.data)
      })

      return createdFilesDb
    }
    catch (e) {
      tx.rollback()
      console.error(e)
      throw createHttpError(HttpErrorCode.InternalServerError)
    }
  })
})
