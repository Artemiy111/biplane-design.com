import type { ProjectRepo } from '../infra/project.repo'
import type { IUseCase } from './types'

export class GetProjectByUriUseCase implements IUseCase {
  constructor(private repo: ProjectRepo) { }

  async execute(uri: string) {
    return this.repo.getOneByUri(uri)
  }
}
