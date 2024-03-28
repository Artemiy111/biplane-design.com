import { err, ok } from '../shared/result'
import type { CreateUserDto, IUserRepo } from './../use-cases/types'

export class UserRepo implements IUserRepo {
  async getUser() {
    await Promise.resolve()
    return ok({
      id: 100,
      email: 'art@mail.ru',
    })
  }

  async createUser(_dto: CreateUserDto) {
    await Promise.resolve()
    return err(new Error('not impl'))
  }
}
