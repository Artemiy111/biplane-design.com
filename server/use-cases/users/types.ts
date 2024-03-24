export type UserId = number

export interface UserDto {
  id: UserId
  email: string
}

export type GetUser = () => Promise<UserDto>
