import { db } from '~/server/db'
import { themes } from '~/server/db/schema'

export default defineEventHandler(async () => {
  const res = await db.select().from(themes)
  console.log(res)
  return res
})
