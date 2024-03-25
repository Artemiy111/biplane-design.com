/* eslint-disable no-console */
import fs from 'node:fs'
import path from 'node:path'
import { cwd } from 'node:process'
import { and, eq } from 'drizzle-orm'
import type { ImageDb } from './db/schema'
import { images, projects } from './db/schema'
import { client, db } from '~/server/db'

const dbProjects = await db.query.projects.findMany({ with: { images: true } })

const dir = `${cwd()}/public/images/projects`

const isImageExt = (ext: string) =>
  ext === 'avif' || ext === 'webp' || ext === 'png' || ext === 'jpg' || ext === 'jpg'

function findNonExistingImages(dbImages: ImageDb[]): ImageDb[] {}

// Проект есть в БД но нет в папке      -> информируем
// Проекта нет в БД, но есть в папке    -> уведомляем
// Проект есть в БД
// - фото есть в БД, но нет в папке     -> удаляем из БД
// - фото есть в папке, но нет в БД     -> добавляем в БД

dbProjects.forEach(async project => {
  try {
    const paths = fs.readdirSync(`${dir}/${project.urlFriendly}`)
    const files = paths.filter(p => fs.statSync(path.join(dir, project.urlFriendly, p)).isFile())

    const imagesFilenames = files.filter(f => {
      const ext = f.split('.')[1]
      if (!ext) return false
      if (isImageExt(ext)) return true
      return false
    })

    project.images.forEach(async image => {
      if (!imagesFilenames.find(img => img === image.filename)) {
        console.log(
          `${project.urlFriendly} / ${image.filename} Не существует в директории. Удаляю из БД`,
        )

        await db
          .delete(images)
          .where(
            and(
              eq(images.projectUrlFriendly, image.projectUrlFriendly),
              eq(images.filename, image.filename),
            ),
          )
          .catch(_e =>
            console.log(`${project.urlFriendly} / ${image.filename} Не удалось удалить из БД`),
          )
      }
    })
  } catch (e) {
    console.error(`${project.urlFriendly} / Не существует`)
  }
})
