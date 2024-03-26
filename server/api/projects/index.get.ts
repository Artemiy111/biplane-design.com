import { db } from '~/server/db'
import { projectDbMapper } from '~/server/infra/projectDb.repo'

export default defineEventHandler(async () => {
  return (await db.query.projects.findMany({
    with: {
      images: { orderBy: images => images.order },
    },
  })).map(projectDbMapper.toDto)
})
