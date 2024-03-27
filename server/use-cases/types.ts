import type { Buffer } from 'node:buffer'
import type { Result, ResultOk } from '../shared/result'

//
export interface IUseCase {
  execute: Function
}

//

export interface IGroupRepo {
  getGroup: (id: GroupId) => Promise<Result<GroupDto, Error>>
  getGroups: () => Promise<Result<GroupDto[], Error>>
  createGroup: (dto: CreateGroupDto) => Promise<Result<GroupDto, Error>>
  updateGroup: (dto: UpdateGroupDto) => Promise<Result<GroupDto, Error>>
  deleteGroup: (id: GroupId) => Promise<Result<void, Error>>
}

export interface IGroupDbRepo {
  getGroup: (id: GroupId) => Promise<Result<GroupDto, Error>>
  getGroups: () => Promise<Result<GroupDto[], Error>>
  createGroup: (dto: CreateGroupDto) => Promise<Result<GroupDto, Error>>
  updateGroup: (dto: UpdateGroupDto) => Promise<Result<GroupDto, Error>>
  deleteGroup: (id: GroupId) => Promise<Result<void, Error>>
}

export type GroupId = number
export interface GroupDto {
  id: GroupId
  title: string
  uri: string
  order: number
  categories: CategoryDto[]
}
export type CreateGroupDto = Omit<GroupDto, 'id' | 'order' | 'categories'>
export type UpdateGroupDto = Omit<GroupDto, 'categories'>

// export type GetGroupNextOrder = () => Promise<Result<number, Error>>

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
export type CreateCategoryDto = Omit<CategoryDto, 'id' | 'projects'>
export type UpdateCategoryDto = Omit<CategoryDto, 'projects'>

export interface ICategoryDbRepo {
  getCategory: (id: CategoryId) => Promise<Result<CategoryDto, Error>>
  getCategories: () => Promise<Result<CategoryDto[], Error>>
  createCategory: (dto: CreateCategoryDto) => Promise<Result<CategoryDto, Error>>
  updateCategory: (dto: UpdateCategoryDto) => Promise<Result<CategoryDto, Error>>
  deleteCategory: (id: CategoryId) => Promise<Result<void, Error>>
}

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
  status: string
}
export type CreateProjectDto = Omit<ProjectDto, 'id' | 'images'>
export type UpdateProjectDto = Omit<ProjectDto, 'images'>

export interface IProjectRepo {
  getProject: (id: ProjectId) => Promise<Result<ProjectDto, Error>>
  getProjectByUri: (uri: string) => Promise<Result<ProjectDto, Error>>
  getProjects: () => Promise<Result<ProjectDto[], Error>>
  createProject: (dto: CreateProjectDto) => Promise<Result<ProjectDto, Error>>
  updateProject: (dto: UpdateProjectDto) => Promise<Result<ProjectDto, Error>>
  deleteProject: (id: ProjectId) => Promise<Result<void, Error>>
}

export interface IProjectDbRepo {
  getProject: (id: ProjectId) => Promise<Result<ProjectDto, Error>>
  getProjectByUri: (uri: string) => Promise<Result<ProjectDto, Error>>
  getProjects: () => Promise<Result<ProjectDto[], Error>>
  createProject: (dto: CreateProjectDto) => Promise<Result<ProjectDto, Error>>
  updateProject: (dto: UpdateProjectDto) => Promise<Result<ProjectDto, Error>>
  deleteProject: (id: ProjectId) => Promise<Result<void, Error>>
}

export interface IProjectFsRepo {
  getProjectDir: (uri: string) => string
  isProjectDirExist: (uri: string) => Promise<boolean>
  createProjectDir: (uri: string) => Promise<Result<void, Error>>
  renameProjectDir: (uri: string, newUri: string) => Promise<Result<void, Error>>
  deleteProjectDir: (uri: string) => Promise<Result<void, Error>>
}

//

export type ImageId = number
export interface ImageDto {
  id: ImageId
  filename: string
  projectUri: string
  url: string
  alt: string
  order: number
}
export type CreateImageDto = Omit<ImageDto, 'id'>
export type UpdateImageDto = Omit<ImageDto, ''>

export interface IImageRepo {
  getImage: (id: ProjectId) => Promise<Result<ImageDto, Error>>
  getImagesByProjectUri: (uri: string) => Promise<Result<ImageDto[], Error>>
  createImage: (dto: CreateImageDto) => Promise<Result<ImageDto, Error>>
  updateImage: (dto: UpdateImageDto) => Promise<Result<ImageDto, Error>>
  deleteImage: (id: ImageId) => Promise<Result<void, Error>>
}

export interface IImageDbRepo {
  getImage: (id: ImageId) => Promise<Result<ImageDto, Error>>
  getImagesByProjectUri: (uri: string) => Promise<Result<ImageDto[], Error>>
  createImage: (dto: CreateImageDto) => Promise<Result<ImageDto, Error>>
  updateImage: (dto: UpdateImageDto) => Promise<Result<ImageDto, Error>>
  deleteImage: (id: ImageId) => Promise<Result<void, Error>>
}

export interface IImageFsRepo {
  isImageFileExist: (projectUri: string, filename: string) => Promise<boolean>
  getImageFile: (projectUri: string, filename: string) => Promise<Result<File, Error>>
  createImageFile: (projectUri: string, filename: string, data: Buffer) => Promise<Result<void, Error>>
  renameImageFile: (projectUri: string, filename: string, newFilename: string) => Promise<Result<void, Error>>
  deleteImageFile: (projectUri: string, filename: string) => Promise<Result<void, Error>>
}

//

export type UserId = number
export interface UserDto {
  id: UserId
  email: string
}

export interface CreateUserDto {
  email: string
  password: string
}

export interface IUserRepo {
  getUser: () => Promise<Result<UserDto | null, Error>>
  createUser: (dto: CreateUserDto) => Promise<Result<UserDto, Error>>
}
