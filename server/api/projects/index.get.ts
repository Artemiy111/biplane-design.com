import { db } from '~/server/db'

export default defineEventHandler(() => {
  return db.query.projects.findMany({ with: { images: { orderBy: images => images.order }, category: { with: { group: true } } } })
})
