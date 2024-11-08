import { z } from 'zod'

import { authRepo, imageRepo } from '~~/server/di'

export default defineEventHandler(async (event) => {
  authRepo.assertAuthenticated(event)

  const formData = Object.fromEntries((await readFormData(event)).entries())
  const data = createSchema.parse(formData)
  return await imageRepo.create(data)
})
