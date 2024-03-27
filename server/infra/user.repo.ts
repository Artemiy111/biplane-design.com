import { err, ok } from '../shared/result'
import type { Result } from '../shared/result'
import type { CreateUserDto, IUserRepo } from './../use-cases/types'

export class UserRepo implements IUserRepo {
  async getUser() {
    await Promise.resolve()
    return ok(null)
  }

  async createUser(_dto: CreateUserDto) {
    await Promise.resolve()
    return err(new Error('oops'))
  }
}
