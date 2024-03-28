import type { IProjectRepo, IUseCase } from './types'

export class GetProjectByUriUseCase implements IUseCase {
  constructor(private repo: IProjectRepo) {}

  async execute(uri: string) {
    return this.repo.getByUri(uri)
  }
}
