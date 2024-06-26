import type { CategoryDbUpdate, CategoryId, CategoryLayout, GroupDbUpdate, GroupId, ImageDbUpdate, ImageFit, ProjectDbCreate, ProjectDbUpdate, ProjectId, ProjectStatus } from '../db/schema'

//
export interface IUseCase {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  execute: (...params: any[]) => void
}

//

export interface GroupDto {
  id: GroupId
  title: string
  uri: string
  order: number
  categories: CategoryDto[]
}

export type CreateGroupDto = Omit<GroupDto, 'id' | 'order' | 'categories'>
export type UpdateGroupDto = GroupDbUpdate

export type ChangeGroupOrder = (id: GroupId, order: number) => Promise<void>
//

export interface CategoryDto {
  groupId: GroupId
  id: CategoryId
  title: string
  uri: string
  order: number
  layout: CategoryLayout
  projects: ProjectDto[]
}

export type CreateCategoryDto = Omit<CategoryDto, 'id' | 'order' | 'projects'>
export type UpdateCategoryDto = CategoryDbUpdate

//

export interface ProjectDto {
  categoryId: CategoryId
  id: ProjectId
  title: string
  uri: string
  order: number
  images: ImageDto[]
  location: string | null
  yearStart: number | null
  yearEnd: number | null
  status: ProjectStatus
  isMinimal: boolean
}

export type CreateProjectDto = Omit<ProjectDbCreate, 'order'>
export type UpdateProjectDto = ProjectDbUpdate

//

export interface ImageDto {
  projectId: ProjectId
  id: string
  url: string
  alt: string
  fit: ImageFit
  order: number
}

export interface ImageFile {
  filename: string
  projectUri: string
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
export interface UserDto {
  id: UserId
  username: string
}

export interface LoginUserDto {
  email: string
  password: string
}

export interface CreateUserDto {
  username: string
  password: string
}

export interface UpdateUserDto {
  password: string
}
