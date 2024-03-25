//

export interface IGroupDbRepo {
  getGroup: GetGroup
  getGroups: GetGroups
  createGroup: CreateGroup
  updateGroup: UpdateGroup
  deleteGroup: DeleteGroup
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

export type GetGroup = (id: GroupId) => Promise<GroupDto | null>
export type GetGroups = () => Promise<GroupDto[]>
export type CreateGroup = (dto: CreateGroupDto) => Promise<GroupDto>
export type UpdateGroup = (dto: UpdateGroupDto) => Promise<GroupDto>
export type DeleteGroup = (id: GroupId) => Promise<void>
export type GetGroupNextOrder = () => Promise<number>

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

export type GetUser = () => Promise<UserDto | null>

export interface IProjectFsRepo {
  getProjectDir: GetProjectDir
  createProjectDir: CreateProjectDir
  renameProjectDir: RenameProjectDir
  deleteProjectDir: DeleteProjectDir
}

export type GetProjectDir = (uri: string) => string
export type CreateProjectDir = (uri: string) => Promise<void>
export type RenameProjectDir = (uri: string, newUri: string) => Promise<void>
export type DeleteProjectDir = (uri: string) => Promise<void>

export interface IImageFsRepo {
  getProjectDir: GetProjectDir
  createProjectDir: CreateProjectDir
  renameProjectDir: RenameProjectDir
  deleteProjectDir: DeleteProjectDir
}

export type GetImageFile = (uri: string) => string
export type CreateImageFile = (uri: string) => Promise<void>
export type RenameImageFile = (uri: string, newUri: string) => Promise<void>
export type DeleteImageFile = (uri: string) => Promise<void>
