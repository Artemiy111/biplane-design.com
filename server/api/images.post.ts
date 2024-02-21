import process from 'node:process'
import path from 'node:path'
import fs from 'node:fs'
import { Buffer } from 'node:buffer'
import { db } from '~/server/db'
import { images } from '~/server/db/schema'

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event)
  if (!formData)
    return

  const project = JSON.parse(Buffer.from(formData[0].data).toString()) as { id: number, urlFriendly: string }
  formData.shift()

  formData.forEach(async (file) => {
    const folder = path.join(process.cwd(), `public/images/projects/${project.urlFriendly}`)
    const filepath = path.join(folder, `${file.filename!}`)
    try {
      fs.mkdirSync(folder)
    }
    catch (_e) {
    }
    fs.writeFileSync(filepath, file.data)

    await db.insert(images).values({ projectId: project.id, filename: file.filename! })
  })
})
