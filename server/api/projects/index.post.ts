import { db } from '~/server/db'
import { projects } from '~/server/db/schema'
import { HttpErrorCode, createHttpError } from '~/server/exceptions'
import { projectCreateSchema } from '~/server/validators'

export default defineEventHandler(async (event) => {
  const data = await readValidatedBody(event, projectCreateSchema.safeParse)

  if (!data.success)
    return createHttpError(HttpErrorCode.BadRequest)
  const project = data.data

  const result = await db.insert(projects).values({
    categoryId: project.categoryId,
    title: project.title,
    urlFriendly: project.urlFriendly,
    status: project.status,
    yearStart: project.yearStart,
    yearEnd: project.yearEnd,
    location: project.location,
  }).returning()

  return result
})
