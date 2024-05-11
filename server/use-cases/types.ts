import type { Buffer } from 'node:buffer'
import type { Result } from '../shared/result'
import { ImageDb } from '../db/schema'

//
export interface IUseCase {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  execute: (...params: any[]) => void
}

export interface IProjectSyncRepo {
  getDirsNotExistingInDb: () => string[]
  getDbProjectsExistingInFs: () => ProjectDto[]
}

export interface IImageSyncRepo {
  getFilesNotExistingInDb: () => ImageFile[]
  getDbImagesNotExistingInFs: () => ImageDto[]
}

//

export interface IGroupRepo {
  getOne: (id: GroupId) => Promise<Result<GroupDto, Error>>
  getAll: () => Promise<Result<GroupDto[], Error>>
  create: (dto: CreateGroupDto) => Promise<Result<GroupDto, Error>>
  update: (dto: UpdateGroupDto) => Promise<Result<GroupDto, Error>>
  delete: (id: GroupId) => Promise<Result<void, Error>>
}

export interface IGroupDbRepo {
  getOne: (id: GroupId) => Promise<Result<GroupDto, Error>>
  getAll: () => Promise<Result<GroupDto[], Error>>
  create: (dto: CreateGroupDto) => Promise<Result<GroupDto, Error>>
  update: (dto: UpdateGroupDto) => Promise<Result<GroupDto, Error>>
  delete: (id: GroupId) => Promise<Result<void, Error>>
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
export type CreateCategoryDto = Omit<CategoryDto, 'id' | 'order' | 'projects'>
export type UpdateCategoryDto = Omit<CategoryDto, 'projects'>

export interface ICategoryDbRepo {
  getOne: (id: CategoryId) => Promise<Result<CategoryDto, Error>>
  getAll: () => Promise<Result<CategoryDto[], Error>>
  create: (dto: CreateCategoryDto) => Promise<Result<CategoryDto, Error>>
  update: (dto: UpdateCategoryDto) => Promise<Result<CategoryDto, Error>>
  delete: (id: CategoryId) => Promise<Result<void, Error>>
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

export type ProjectDbDto = Omit<ProjectDto, 'images'> & { images: ImageDbDto[] }

export type CreateProjectDto = Omit<ProjectDto, 'id' | 'order' | 'images'>
export type UpdateProjectDto = Omit<ProjectDto, 'images'>

export interface IProjectRepo {
  getOne: (id: ProjectId) => Promise<Result<ProjectDto, Error>>
  getByUri: (uri: string) => Promise<Result<ProjectDto, Error>>
  getAll: () => Promise<Result<ProjectDto[], Error>>
  create: (dto: CreateProjectDto) => Promise<Result<ProjectDto, Error>>
  update: (dto: UpdateProjectDto) => Promise<Result<ProjectDto, Error>>
  delete: (id: ProjectId) => Promise<Result<void, Error>>
}

export interface IProjectDbRepo {
  getOne: (id: ProjectId) => Promise<Result<ProjectDbDto, Error>>
  getByUri: (uri: string) => Promise<Result<ProjectDbDto, Error>>
  getAll: () => Promise<Result<ProjectDbDto[], Error>>
  create: (dto: CreateProjectDto) => Promise<Result<ProjectDbDto, Error>>
  update: (dto: UpdateProjectDto) => Promise<Result<ProjectDbDto, Error>>
  delete: (id: ProjectId) => Promise<Result<void, Error>>
}

export interface IProjectBucketRepo {
  getDir: (uri: string) => string
  isDirExist: (uri: string) => Promise<Result<boolean, Error>>
  createDir: (uri: string) => Promise<Result<void, Error>>
  renameDir: (uri: string, newUri: string) => Promise<Result<void, Error>>
  deleteDir: (uri: string) => Promise<Result<void, Error>>
}

//

export type ImageId = number
export interface ImageDto {
  projectId: ProjectId
  id: ImageId
  filename: string
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
  data: Buffer
}
export type UpdateImageDto = Omit<ImageDto, 'url'>

export interface IImageRepo {
  getOne: (id: ProjectId) => Promise<Result<ImageDto, Error>>
  getAllByProjectId: (id: ProjectId) => Promise<Result<ImageDto[], Error>>
  create: (dto: CreateImageDto) => Promise<Result<ImageDto, Error>>
  update: (dto: UpdateImageDto) => Promise<Result<ImageDto, Error>>
  delete: (id: ImageId) => Promise<Result<void, Error>>
}

export interface IImageDbRepo {
  getOne: (id: ImageId) => Promise<Result<ImageDbDto, Error>>
  getAll: () => Promise<Result<ImageDbDto[], Error>>
  getAllByProjectId: (id: ProjectId) => Promise<Result<ImageDbDto[], Error>>
  create: (dto: CreateImageDto) => Promise<Result<ImageDbDto, Error>>
  update: (dto: UpdateImageDto) => Promise<Result<ImageDbDto, Error>>
  delete: (id: ImageId) => Promise<Result<void, Error>>
}

export interface IImageFsRepo {
  isImageFileExist: (projectUri: string, filename: string) => Promise<Result<boolean, Error>>
  getImageFile: (projectUri: string, filename: string) => Promise<Result<File, Error>>
  createImageFile: (projectUri: string, filename: string, data: Buffer) => Promise<Result<void, Error>>
  renameImageFile: (projectUri: string, filename: string, newFilename: string) => Promise<Result<void, Error>>
  deleteImageFile: (projectUri: string, filename: string) => Promise<Result<void, Error>>
}


export interface IImageBucketRepo {
  isImageFileExist: (projectUri: string, filename: string) => Promise<Result<boolean, Error>>
  getImageUrl: (projectUri: string, filename: string) => Promise<Result<string, Error>>
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
  getUser: () => Promise<Result<UserDto, Error>>
  createUser: (dto: CreateUserDto) => Promise<Result<UserDto, Error>>
}
