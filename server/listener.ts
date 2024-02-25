/* eslint-disable no-console */
import fs from 'node:fs'
import path from 'node:path'
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

chokidar.watch(dir, { cwd: dir, ignoreInitial: true, atomic: true, depth: 1 })
  .on('add', async (path) => {
    const info = extractImageInfo(path)
    if (!info)
      return

    try {
      const project = await db.query.projects.findFirst({ where: p => eq(p.urlFriendly, info.projectUrlFriendly) })
      if (!project) {
        console.log(`Проект ${info.projectUrlFriendly} не существует. Пропускаю добавление изображения к БД`)
        return
      }

      await db.insert(images).values({ projectUrlFriendly: info.projectUrlFriendly, filename: info.filename })
      console.log(`Добавлено ${info.filename} к ${info.projectUrlFriendly}`)
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
      await db.delete(images).where(and(
        eq(images.projectUrlFriendly, info.projectUrlFriendly),
        eq(images.filename, info.filename),
      ))
      console.log(`Удалено ${info.filename} из ${info.projectUrlFriendly}`)
    }
    catch (e) {
      console.error(`Не удалось добавить изображение ${info.filename} к проекту ${info.projectUrlFriendly}`, e)
    }
  })
  .on('unlinkDir', async (projectUrlFriendly) => {
    console.log(projectUrlFriendly)
    try {
      const project = await db.select().from(projects).where(eq(projects.urlFriendly, projectUrlFriendly))
      if (!project.length) {
        console.log(`Проект ${projectUrlFriendly} не существует. Пропускаю удаление изображений из БД`)
        return
      }
      await db.delete(images).where(eq(images.projectUrlFriendly, projectUrlFriendly))
    }
    catch (e) {
      console.error(`Не удалось удалить проект ${projectUrlFriendly}`)
    }
  })
