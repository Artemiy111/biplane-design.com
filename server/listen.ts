/* eslint-disable no-console */
import { cwd } from 'node:process'
import chokidar from 'chokidar'

import { and, eq } from 'drizzle-orm'
import { images, projects } from './db/schema'
import { db } from '~/server/db'

const dir = `${cwd()}/public/images/projects`

function extractImageInfo(path: string) {
  const params = path.split('/')
  if (params.length !== 2)
    return null
  const projectUrlFriendly = params[0]
  const filename = params[1]
  const fileArgs = filename.split('.')
  if (fileArgs.length !== 2)
    return null

  return {
    projectUrlFriendly,
    filename,
  }
}

chokidar.watch(dir, { cwd: dir, ignoreInitial: false, atomic: true, depth: 1 })
  .on('add', async (path) => {
    const info = extractImageInfo(path)
    if (!info)
      return

    try {
      const project = await db.select().from(projects).where(eq(projects.urlFriendly, info.projectUrlFriendly))
      if (!project.length) {
        console.log(`${info.projectUrlFriendly} / не существует в БД. Пропускаю добавление изображения к БД`)
        return
      }
      const image = await db.select().from(images).where(and(
        eq(images.projectUrlFriendly, info.projectUrlFriendly),
        eq(images.filename, info.filename),
      ))
      if (image.length) {
        console.log(`${info.projectUrlFriendly} / ${info.filename} =`)
        return
      }

      await db.insert(images).values({ projectUrlFriendly: info.projectUrlFriendly, filename: info.filename })
      console.log(`${info.projectUrlFriendly} / ${info.filename} +`)
    }
    catch (e) {
      console.error(`Не удалось добавить изображение ${info.filename} к проекту ${info.projectUrlFriendly}`, e)
    }
  })
  .on('unlink', async (path) => {
    const info = extractImageInfo(path)
    if (!info)
      return

    try {
      const project = await db.select().from(projects).where(eq(projects.urlFriendly, info.projectUrlFriendly))
      if (!project.length) {
        console.log(`${info.projectUrlFriendly} / не существует в БД. Пропускаю удаление изображения из БД`)
        return
      }

      const deletedImages = await db.delete(images).where(and(
        eq(images.projectUrlFriendly, info.projectUrlFriendly),
        eq(images.filename, info.filename),
      )).returning()

      if (deletedImages.length)
        console.log(`${info.projectUrlFriendly} / ${info.filename} -`)
    }
    catch (e) {
      console.error(`Не удалось удалить изображение ${info.filename} из проекта ${info.projectUrlFriendly}`, e)
    }
  })
  .on('unlinkDir', async (projectUrlFriendly) => {
    try {
      const project = await db.select().from(projects).where(eq(projects.urlFriendly, projectUrlFriendly))
      if (!project.length) {
        console.log(`${projectUrlFriendly} / не существует. Пропускаю удаление изображений из БД`)
        return
      }

      const deletedImages = await db.delete(images).where(eq(images.projectUrlFriendly, projectUrlFriendly)).returning()
      deletedImages.forEach(image =>
        console.log(`${projectUrlFriendly} / ${image.filename} -`),
      )
    }
    catch (e) {
      console.error(`Не удалось удалить проект ${projectUrlFriendly} из БД`)
    }
  })
