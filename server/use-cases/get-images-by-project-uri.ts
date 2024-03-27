import type { IImageRepo, IUseCase } from './types'

export class GetImagesByProjectByUriUseCase implements IUseCase {
  constructor(private repo: IImageRepo) {}

  async execute(uri: string) {
    return this.repo.getImagesByProjectUri(uri)
  }
}
