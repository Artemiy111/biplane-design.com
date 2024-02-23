import process from 'node:process'
import path from 'node:path'
import fs from 'node:fs'
import { Buffer } from 'node:buffer'
import { db } from '~/server/db'
import { images } from '~/server/db/schema'
import { HttpErrorCode, createHttpError } from '~/server/exceptions'

function createFolderIfNotExists(folderPath: string): string | null {
  try {
    if (!fs.existsSync(folderPath))
      fs.mkdirSync(folderPath)
  }
  catch (err) {
    if (err instanceof Error)
      return `Error creating folder: ${err.message}`
    else
      return `An unknown error occurred while creating the folder`
  }
  return null
}

function createFile(filepath: string, content: Buffer): string | null {
  try {
    fs.writeFileSync(filepath, content)
  }
  catch (e) {
    if (e instanceof Error)
      return `Error creating file: ${e.message}`
    else
      return `An unknown error occurred while creating the file`
  }
  return null
}

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event)
  if (!formData)
    return createHttpError(HttpErrorCode.BadRequest)

  const project = JSON.parse(Buffer.from(formData[0].data).toString()) as { id: number, urlFriendly: string }
  formData.shift()

  const folder = path.join(process.cwd(), `public/images/projects/${project.urlFriendly}`)
  const folderCreationError = createFolderIfNotExists(folder)
  if (folderCreationError !== null)
    return createHttpError(HttpErrorCode.InternalServerError)

  formData.forEach(async (file) => {
    const filepath = path.join(folder, `${file.filename!}`)
    const fileCreationError = createFile(filepath, file.data)
    if (fileCreationError !== null)
      return createHttpError(HttpErrorCode.InternalServerError)

    return await db.insert(images).values({ projectId: project.id, filename: file.filename! })
  })
})
