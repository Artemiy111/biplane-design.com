import { cwd } from 'node:process'
import path from 'node:path'
import fs from 'node:fs'
import { Buffer } from 'node:buffer'
import * as z from 'zod'
import { eq, max, sql } from 'drizzle-orm'
import { db } from '~/server/db'
import type { ImageCreate } from '~/server/db/schema'
import { images } from '~/server/db/schema'
import { HttpErrorCode, createHttpError } from '~/server/exceptions'

export default defineEventHandler(async (event) => {
  const projectUrlFriendly = event.context.params!.urlFriendly as string
  const formData = await readMultipartFormData(event)
  if (!formData)
    return createHttpError(HttpErrorCode.BadRequest)

  const fromJson = JSON.parse(Buffer.from(formData[0].data).toString())
  const projectSchema = z.object({
    files: z.array(z.object({
      data: z.instanceof(Buffer),
      name: z.string().optional(),
      filename: z.string(),
      type: z.string().optional(),
    })).nonempty(),
  })

  const data = projectSchema.safeParse(fromJson)
  if (!data.success)
    return createHttpError(HttpErrorCode.BadRequest)

  const folder = path.join(cwd(), `public/images/projects/${projectUrlFriendly}`)

  await db.transaction(async (tx) => {
    try {
      const { order: startOrder = 1 } = (await tx.select({ order: sql<number | null>`${max(images.order)} + 1`.mapWith(Number) })
        .from(images).where(eq(images.projectUrlFriendly, projectUrlFriendly)))[0]

      const filesInfo: Array<ImageCreate & { path: string, data: Buffer }> = data.data.files.map((file, idx) => ({
        projectUrlFriendly,
        filename: file.filename,
        order: startOrder + idx,
        path: path.join(folder, file.filename),
        data: file.data,
      }))

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
      return createHttpError(HttpErrorCode.InternalServerError)
    }
  })
})
