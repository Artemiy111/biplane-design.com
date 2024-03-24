type GroupId = number

export interface CategoryDto {

}

export interface GroupDto {
  id: GroupId
  title: string
  uri: string
  order: number
  categories: CategoryDto[]
}

export type CreateGroupDto = Omit<GroupDto, 'id' | 'categories'>

export type UpdateGroupDto = Omit<GroupDto, 'categories'>

export type GetGroups = () => Promise<GroupDto[]>
