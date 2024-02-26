import process from 'node:process'
import path from 'node:path'
import fs from 'node:fs'
import { Buffer } from 'node:buffer'
import * as z from 'zod'
import { list, put } from '@vercel/blob'
import '@total-typescript/ts-reset'
import { db } from '~/server/db'
import { images } from '~/server/db/schema'
import { HttpErrorCode, createHttpError } from '~/server/exceptions'

function createFolderIfNotExists(folderPath: string): Error | undefined {
  try {
    if (!fs.existsSync(folderPath))
      fs.mkdirSync(folderPath)
  }
  catch (e) {
    return e as Error
  }
}

function createFile(filepath: string, content: Buffer): Error | undefined {
  try {
    fs.writeFileSync(filepath, content)
  }
  catch (e) {
    return e as Error
  }
}

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event)
  if (!formData)
    return createHttpError(HttpErrorCode.BadRequest)

  const fromJson = JSON.parse(Buffer.from(formData[0].data).toString())
  const projectSchema = z.object({
    id: z.number(),
    urlFriendly: z.string().min(3),
  })

  const data = projectSchema.safeParse(fromJson)
  if (!data.success)
    return createHttpError(HttpErrorCode.BadRequest)
  const project = data.data
  formData.shift()

  if (!formData.length)
    return createHttpError(HttpErrorCode.BadRequest)

  const folder = path.join(process.cwd(), `public/images/projects/${project.urlFriendly}`)
  const folderCreationError = createFolderIfNotExists(folder)
  if (folderCreationError)
    return createHttpError(HttpErrorCode.InternalServerError)

  // formData.forEach(async (file) => {
  //   const filepath = path.join(folder, `${file.filename!}`)
  //   const fileCreationError = createFile(filepath, file.data)
  //   if (fileCreationError !== null)
  //     return createHttpError(HttpErrorCode.InternalServerError)

  // const folder = project.urlFriendly
  const files = formData.map(file => ({
    projectId: project.id,
    projectUrlFriendly: project.urlFriendly,
    filename: file.filename!,
    path: path.join(folder, file.filename!),
    data: file.data,
  }))
  const createdFiles = files.map(file => createFile(file.path, file.data) === undefined ? file : undefined).filter(file => file) as typeof files
  // const res = await Promise.allSettled(files.map(file => put(file.path, file.data, { access: 'public', token: useRuntimeConfig().public.blobReadWriteToken })))
  // const createdFiles = files.filter((file, idx) => res[idx].status === 'fulfilled')
  return await db.insert(images).values(createdFiles).returning()
})
