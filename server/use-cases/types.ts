import type { Buffer } from 'node:buffer'
import type { Result } from '../shared/result'
import type { ProjectStatus } from '../db/schema'

//
export interface IUseCase {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  execute: (...params: any[]) => void
}

//

export type GroupId = number
export interface GroupDto {
  id: GroupId
  title: string
  uri: string
  order: number
  categories: CategoryDto[]
}
export type GroupDbDto = Omit<GroupDto, 'categories'> & {
  categories: CategoryDbDto[]
}

export type CreateGroupDto = Omit<GroupDto, 'id' | 'order' | 'categories'>
export type UpdateGroupDto = Omit<GroupDto, 'categories'>

export type ChangeGroupOrder = (id: GroupId, order: number) => Promise<void>
//

export type CategoryId = number
export interface CategoryDto {
  groupId: GroupId
  id: CategoryId
  title: string
  uri: string
  order: number
  projects: ProjectDto[]
}
export type CategoryDbDto = Omit<CategoryDto, 'projects'> & {
  projects: ProjectDbDto[]
}

export type CreateCategoryDto = Omit<CategoryDto, 'id' | 'order' | 'projects'>
export type UpdateCategoryDto = Omit<CategoryDto, 'projects' | 'groupId'>

//

export type ProjectId = number
export interface ProjectDto {
  categoryId: CategoryId
  id: ProjectId
  title: string
  uri: string
  order: number
  images: ImageDto[]
  location: string
  yearStart: number | null
  yearEnd: number | null
  status: ProjectStatus
  isMinimal: boolean
}

export type ProjectDbDto = Omit<ProjectDto, 'images'> & { images: ImageDbDto[] }

export type CreateProjectDto = Omit<ProjectDto, 'id' | 'order' | 'images' | 'isMinimal'>
export type UpdateProjectDto = Omit<ProjectDto, 'images'>

//

export type ImageId = string
export interface ImageDto {
  projectId: ProjectId
  id: ImageId
  url: string
  alt: string
  order: number
}
export type ImageDbDto = Omit<ImageDto, 'url'>

export interface ImageFile {
  filename: string
  projectUri: string
  file: File
}
export type CreateImageDto = Omit<ImageDto, 'id' | 'url' | 'order'> & {
  filename: string
  data: Buffer
  type: string
}
export type UpdateImageDto = {
  filename: string
  alt: string
  order: number
}

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

export interface IUserRepo {
  getUser: (loginDto: LoginUserDto) => Promise<Result<UserDto, Error>>
  createUser: (dto: CreateUserDto) => Promise<Result<UserDto, Error>>
}
