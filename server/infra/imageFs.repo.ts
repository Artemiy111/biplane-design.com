import fs from 'node:fs/promises'
import path from 'node:path'
import type { Buffer } from 'node:buffer'
import { err, ok } from '../shared/result'
import type { IImageFsRepo, IProjectFsRepo } from './../use-cases/types'

const extNames = ['.avif', '.webp', '.png', '.jpg', '.jpeg']
const extNamesSet = new Set(extNames)

export class ImageFsRepo implements IImageFsRepo {
  constructor(private projectFsRepo: IProjectFsRepo) {}

  private getImageFilepath(projectUri: string, filename: string) {
    const dir = this.projectFsRepo.getProjectDir(projectUri)
    return path.join(dir, filename)
  }

  async isImageFileExist(projectUri: string, filename: string) {
    const filepath = this.getImageFilepath(projectUri, filename)
    return await fs.exists(filepath)
  }

  async getImageFile(projectUri: string, filename: string) {
    const filepath = this.getImageFilepath(projectUri, filename)
    if (!(await this.isImageFileExist(projectUri, filename)))
      return err(new Error(`Image \`${filename}\` of project \`${projectUri}\` does not exist `))
    try {
      const buffer = await fs.readFile(filepath)
      const file = new File([buffer], filename)
      return ok(file)
    }
    catch (_e) {
      return err(new Error(`Could not get file \`${filename}\` of project \`${projectUri}\``))
    }
  }

  async getImageFiles(projectUri: string) {
    const dir = this.projectFsRepo.getProjectDir(projectUri)
    if (!(await this.projectFsRepo.isProjectDirExist(projectUri)))
      return err(new Error(`Could not get images of project \`${projectUri}\`. Project dir does not exist`))

    try {
      const fileAndDirNames = await fs.readdir(dir)
      const fileAndDirPaths = fileAndDirNames.map(name => this.getImageFilepath(projectUri, name))
      const imageFilepathsToFilter = await Promise.all(fileAndDirPaths.map(async (filepath) => {
        const isFile = (await fs.stat(filepath)).isFile()
        if (!isFile)
          return false

        const pathData = path.parse(filepath)
        if (!extNamesSet.has(pathData.ext))
          return false
        return true
      }))
      const imageFilepaths = fileAndDirPaths.filter((_, i) => imageFilepathsToFilter[i])
      const buffers = await Promise.all(imageFilepaths.map(async filename => fs.readFile(filename)))
      const files = buffers.map((buffer, i) => new File([buffer], path.basename(imageFilepaths[i])))

      return ok(files)
    }
    catch (_e) {
      return err(new Error(`Could not get images of project \`${projectUri}\``))
    }
  }

  async createImageFile(projectUri: string, filename: string, data: Buffer) {
    const filepath = this.getImageFilepath(projectUri, filename)

    try {
      if (!(await this.projectFsRepo.isProjectDirExist(projectUri)))
        await this.projectFsRepo.createProjectDir(projectUri)

      if ((await this.isImageFileExist(projectUri, filename)))
        return err(new Error(`Image \`${filename}\` of project \`${projectUri}\` already exists`))

      await fs.writeFile(filepath, data)
      return ok(undefined)
    }
    catch (_e) {
      return err(new Error(`Could not create image \`${filename}\` for project \`${projectUri}\``))
    }
  }

  async renameImageFile(projectUri: string, filename: string, newFilename: string) {
    if (!(await this.isImageFileExist(projectUri, filename)))
      return err(new Error(`Image \`${filename}\` of project \`${projectUri}\` does not exist`))

    try {
      const filepath = this.getImageFilepath(projectUri, filename)
      const newFilepath = this.getImageFilepath(projectUri, filename)
      await fs.rename(filepath, newFilepath)
      return ok(undefined)
    }
    catch (_e) {
      return err(new Error(`Could not rename image \`${filename}\` to \`${newFilename}\` of project ${projectUri} `))
    }
  }

  async deleteImageFile(projectUri: string, filename: string) {
    if (!(this.isImageFileExist(projectUri, filename)))
      return err(new Error(`Cannot delete image \`${filename}\` if project \`${projectUri}\``))

    try {
      const filepath = this.getImageFilepath(projectUri, filename)
      await fs.unlink(filepath)
      return ok(undefined)
    }
    catch (_e) {
      return err(new Error(`Could not delete image \`${filename}\` of project \`${projectUri}\``))
    }
  }
}
