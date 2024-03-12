import { eq, max, sql } from 'drizzle-orm'
import { db } from './db'
import { images } from './db/schema'

const projectUrlFriendly = 'blablablasta--'
const res = await db.select({ order: sql<number | null>`${max(images.order)} + 1`.mapWith(Number) }).from(images).where(eq(images.projectUrlFriendly, projectUrlFriendly))
console.log(res)
