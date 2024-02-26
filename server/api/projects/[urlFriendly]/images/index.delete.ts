import process from 'node:process'
import path from 'node:path'
import fs from 'node:fs'
import { Buffer } from 'node:buffer'
import { eq } from 'drizzle-orm'
import { del } from '@vercel/blob'
import { db } from '~/server/db'
import { images } from '~/server/db/schema'
import { HttpErrorCode, createHttpError } from '~/server/exceptions'
import { imagesDeleteSchema } from '~/server/validators'

function deleteFile(filepath: string): string | null {
  try {
    fs.unlinkSync(filepath)
  }
  catch (e) {
    if (e instanceof Error)
      return `Ошибка при удалении файла: ${e.message} `
    else return 'Неизвестная ошибка при удалении файла'
  }
  return null
}

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, imagesDeleteSchema.safeParse)
  if (!body.success)
    return createHttpError(HttpErrorCode.BadRequest)
  const project = body.data.project
  const filenames = body.data.filenames

  // const folder = path.join(process.cwd(), `public/images/projects/${project.urlFriendly}`)
  const folder = `${project.urlFriendly}/`

  await db.transaction(async () => {
    filenames.forEach(async (filename) => {
      return await db.delete(images).where(eq(images.filename, filename))
    })
    // !FIXME транзакция неправильная
    filenames.forEach((filename) => {
      const deleteFileError = deleteFile(path.join(folder, filename))
      if (deleteFileError !== null)
        return createHttpError(HttpErrorCode.InternalServerError)
    })

    // filenames.forEach((filename) => {
    //   del(folder + filename, {

    //   })
    // })
  })
})
