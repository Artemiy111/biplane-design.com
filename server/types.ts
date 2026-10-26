import type { z } from 'zod'

import type { imageSchemas, projectSchemas } from '~~/src/shared/config/validation'

import type { CategoryDb, GroupDb, ImageDb, ProjectDb } from './db/schema'

export type ImageDto = ImageDb & {
  url: string
}

export type ProjectDto = ProjectDb & {
  images: ImageDto[]
}

export type CategoryDto = CategoryDb & {
  projects: ProjectDto[]
}

export type GroupDto = GroupDb & {
  categories: CategoryDto[]
}

export type CreateProjectDto = z.infer<typeof projectSchemas.createSchema>
export type UpdateProjectDto = z.infer<typeof projectSchemas.updateSchema>

export type CreateImageDto = z.infer<typeof imageSchemas.createSchema>
export type UpdateImageDto = z.infer<typeof imageSchemas.updateSchema>
