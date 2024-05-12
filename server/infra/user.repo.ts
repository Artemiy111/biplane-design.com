import { err, ok } from '~/server/shared/result'
import type { CreateUserDto, IUserRepo, LoginUserDto, UserDto } from '~/server/use-cases/types'
import { supabase } from '~/server/db/supabase'

export class UserRepo implements IUserRepo {
  async getUser(loginDto: LoginUserDto) {
    // const { data: userData, error } = await supabase.auth.signInWithPassword({ email: loginDto.email, password: loginDto.password })
    // if (error) return err(new Error('Not authorized'))
    return ok({ id: '1', email: 'art@art.art' })
  }

  async createUser(createDto: CreateUserDto) {
    const { data: userData, error } = await supabase.auth.signUp({ email: createDto.email, password: createDto.password })
    if (error) return err(new Error('Could not create user'))

    return ok(userData.user as UserDto)
  }
}
