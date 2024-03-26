import type { Result, ResultOk } from '../shared/result'

//
export interface IUseCase {
  execute: Function
}

export interface IGroupRepo {
  getGroup: GetGroup
  getGroups: GetGroups
  createGroup: CreateGroup
  updateGroup: UpdateGroup
  deleteGroup: DeleteGroup
}

export interface IGroupDbRepo {
  getGroup: GetGroup
  getGroups: GetGroups
  createGroup: CreateGroup
  updateGroup: UpdateGroup
  deleteGroup: DeleteGroup
  getGroupNextOrder: GetGroupNextOrder
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

export type GetGroup = (id: GroupId) => Promise<Result<GroupDto | null, Error>>
export type GetGroups = () => Promise<Result<GroupDto[], Error>>
export type CreateGroup = (dto: CreateGroupDto) => Promise<Result<GroupDto, Error>>
export type UpdateGroup = (dto: UpdateGroupDto) => Promise<Result<GroupDto, Error>>
export type DeleteGroup = (id: GroupId) => Promise<Result<void, Error>>
export type GetGroupNextOrder = () => Promise<Result<number, Error>>

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

export type GetCategory = (id: CategoryId) => Promise<CategoryDto | null>
export type GetCategories = () => Promise<CategoryDto[]>
export type CreateCategory = (dto: CreateCategoryDto) => Promise<CategoryDto>
export type UpdateCategory = (dto: UpdateCategoryDto) => Promise<CategoryDto>
export type DeleteCategory = (id: CategoryId) => Promise<void>

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

export type GetProject = (id: ProjectId) => Promise<ProjectDto | null>
export type GetProjects = () => Promise<ProjectDto[]>
export type CreateProject = (dto: CreateProjectDto) => Promise<ProjectDto>
export type UpdateProject = (dto: UpdateProjectDto) => Promise<ProjectDto>
export type DeleteProject = (id: ProjectId) => Promise<void>

export type ChangeProjectOrder = (id: ProjectId, order: number) => Promise<void>

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

export type GetImage = (id: ProjectId) => Promise<ImageDto | null>
export type GetImages = () => Promise<ImageDto[]>
export type GetImagesByProjectUri = (uri: string) => Promise<ImageDto[]>
export type CreateImage = (dto: CreateImageDto) => Promise<ImageDto>
export type UpdateImage = (dto: UpdateImageDto) => Promise<ImageDto>
export type DeleteImage = (id: ImageId) => Promise<void>

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

export interface IProjectFsRepo {
  getProjectDir: GetProjectDir
  createProjectDir: CreateProjectDir
  renameProjectDir: RenameProjectDir
  deleteProjectDir: DeleteProjectDir
}

export type GetProjectDir = (uri: string) => ResultOk<string>
export type CreateProjectDir = (uri: string) => Promise<Result<void, Error>>
export type RenameProjectDir = (uri: string, newUri: string) => Promise<Result<void, Error>>
export type DeleteProjectDir = (uri: string) => Promise<Result<void, Error>>

export interface IImageFsRepo {
  getImageFile: GetImageFile
  createImageFile: CreateImageFile
  renameImageFile: CreateImageFile
  deleteImageFile: DeleteImageFile
}

export type GetImageFile = (projectDir: string, filename: string) => Promise<Result<File, Error>>
export type CreateImageFile = (projectDir: string, filename: string, data: File) => Promise<Result<void, Error>>
export type RenameImageFile = (projectDir: string, filename: string, newFilename: string) => Promise<Result<void, Error>>
export type DeleteImageFile = (projectDir: string, filename: string) => Promise<Result<void, Error>>
