import type { z } from 'zod'

import type { authSchemas, categorySchemas, groupSchemas, imageSchemas, projectSchemas } from '~~/src/shared/config/validation'

import type { CategoryId, CategoryLayout, GroupDb, GroupId, ImageFit, ProjectId, ProjectStatus } from './db/schema'

export type GroupDto = {
  id: GroupId
  title: string
  slug: string
  order: number
  categories: CategoryDto[]
}

export type CreateGroupDto = z.infer<typeof groupSchemas.createSchema>
export type UpdateGroupDto = z.infer<typeof groupSchemas.updateSchema>

//

export type CategoryDto = {
  groupId: GroupId
  group: GroupDb
  id: CategoryId
  title: string
  slug: string
  order: number
  layout: CategoryLayout
  projects: ProjectDto[]
}

export type CreateCategoryDto = z.infer<typeof categorySchemas.createSchema>
export type UpdateCategoryDto = z.infer<typeof categorySchemas.updateSchema>

//

export type ProjectDto = {
  categoryId: CategoryId
  id: ProjectId
  title: string
  slug: string
  order: number
  images: ImageDto[]
  location: string | null
  yearStart: number | null
  yearEnd: number | null
  status: ProjectStatus
  isMinimal: boolean
  isVisible: boolean
}

export type CreateProjectDto = z.infer<typeof projectSchemas.createSchema>
export type UpdateProjectDto = z.infer<typeof projectSchemas.updateSchema>

//

export type ImageDto = {
  projectId: ProjectId
  id: string
  url: string
  alt: string
  fit: ImageFit
  order: number
}

export type ImageFile = {
  filename: string
  projectSlug: string
  file: File
}
export type CreateImageDto = {
  projectId: ProjectId
  fit: ImageFit
  file: File
}

export type UpdateImageDto = z.infer<typeof imageSchemas.updateSchema>
//

export type UserId = number
export type UserDto = {
  id: UserId
  username: string
}

export type LoginUserDto = z.infer<typeof authSchemas.loginSchema>

export type CreateUserDto = z.infer<typeof authSchemas.registerSchema>

export type UpdateUserDto = z.infer<typeof authSchemas.changePasswordSchema>
