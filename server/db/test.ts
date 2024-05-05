import { sql } from 'drizzle-orm'
import { images } from './schema'
import { db } from '.'

const res = await db.select({ index: sql`row_number() over (order by ${images.order})`.mapWith(Number) }).from(images)
