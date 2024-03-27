import { db } from '~/server/db'
import { projects } from '~/server/db/schema'
import { HttpErrorCode, createHttpError } from '~/server/exceptions'
import { projectCreateSchema } from '~/server/validators'

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, projectCreateSchema.safeParse)
  if (!body.success)
    return createHttpError(HttpErrorCode.BadRequest)
  const project = body.data

  return await db.transaction(async (tx) => {
    const order = (await tx.select().from(projects)).length + 1

    const result = await db.insert(projects).values({
      categoryId: project.categoryId,
      title: project.title,
      urlFriendly: project.urlFriendly,
      status: project.status,
      yearStart: project.yearStart,
      yearEnd: project.yearEnd,
      location: project.location,
      order,
    }).returning()
    return result
  })
})
