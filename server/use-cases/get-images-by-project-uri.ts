import type { IImageRepo, IUseCase } from './types'

export class GetImagesByProjectUriUseCase implements IUseCase {
  constructor(private repo: IImageRepo) {}

  async execute(uri: string) {
    return this.repo.getAllByProjectUri(uri)
  }
}
