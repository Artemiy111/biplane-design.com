import { db } from '~/server/db'

export default defineEventHandler(() => {
  return db.query.projects.findMany({ with: { images: true, category: { with: { group: true } } } })
})
