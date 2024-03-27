import path from 'node:path'
import fs from 'node:fs/promises'
import type { IProjectFsRepo } from '../use-cases/types'
import { err, ok } from '../shared/result'

export class ProjectFsRepo implements IProjectFsRepo {
  constructor(private projectsDir: string) {}

  getProjectDir(uri: string) { return path.join(this.projectsDir, uri) }

  async isProjectDirExist(uri: string) {
    const dir = this.getProjectDir(uri)
    const exists = await fs.exists(dir)
    return exists
  }

  async createProjectDir(uri: string) {
    const dir = this.getProjectDir(uri)
    if (!(await this.isProjectDirExist(uri)))
      return err(new Error(`Dir of project \`${uri}\` already exists`))

    try {
      fs.mkdir(dir)
      return ok(undefined)
    }
    catch (_e) {
      return err(new Error(`Cannot create dir for project \`${uri}\``))
    }
  }

  async renameProjectDir(uri: string, newUri: string) {
    const dir = this.getProjectDir(uri)
    const newDir = this.getProjectDir(newUri)

    try {
      await fs.rename(dir, newDir)
      return ok(undefined)
    }
    catch (_e) {
      return err(new Error(`Cannot rename project dir \`${dir}\``))
    }
  }

  async deleteProjectDir(uri: string) {
    const dir = this.getProjectDir(uri)
    try {
      fs.unlink(dir)
      return ok(undefined)
    }
    catch (_e) {
      return err(new Error(`Cannot delete project dir \`${dir}\``))
    }
  }
}
