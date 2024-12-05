import type { CategoryDbUpdate, CategoryId, CategoryLayout, GroupDbUpdate, GroupId, ImageDbUpdate, ImageFit, ProjectDbCreate, ProjectDbUpdate, ProjectId, ProjectStatus } from './db/schema'

export type GroupDto = {
  id: GroupId
  title: string
  slug: string
  order: number
  categories: CategoryDto[]
}

export type CreateGroupDto = Omit<GroupDto, 'id' | 'order' | 'categories'>
export type UpdateGroupDto = GroupDbUpdate

export type ChangeGroupOrder = (id: GroupId, order: number) => Promise<void>
//

export type CategoryDto = {
  groupId: GroupId
  id: CategoryId
  title: string
  slug: string
  order: number
  layout: CategoryLayout
  projects: ProjectDto[]
}

export type CreateCategoryDto = Omit<CategoryDto, 'id' | 'order' | 'projects'>
export type UpdateCategoryDto = CategoryDbUpdate

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

export type CreateProjectDto = Omit<ProjectDbCreate, 'order'>
export type UpdateProjectDto = ProjectDbUpdate

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
export type UpdateImageDto = ImageDbUpdate
//

export type UserId = number
export type UserDto = {
  id: UserId
  username: string
}

export type LoginUserDto = {
  email: string
  password: string
}

export type CreateUserDto = {
  username: string
  password: string
}

export type UpdateUserDto = {
  password: string
}
