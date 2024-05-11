import path from 'node:path'
import fs from 'node:fs/promises'
import type { IProjectBucketRepo } from '../use-cases/types'
import { err, ok } from '../shared/result'

export class ProjectFsRepo implements IProjectBucketRepo {
  constructor(private projectsDir: string) { }

  getDir(uri: string) { return path.join(this.projectsDir, uri) }

  async isDirExist(uri: string) {
    const dir = this.getDir(uri)
    const exists = await fs.exists(dir)
    return ok(exists)
  }

  async createDir(uri: string) {
    const dir = this.getDir(uri)
    if (!(await this.isDirExist(uri)))
      return err(new Error(`Dir of project \`${uri}\` already exists`))

    try {
      fs.mkdir(dir)
      return ok(undefined)
    }
    catch (_e) {
      return err(new Error(`Cannot create dir for project \`${uri}\``))
    }
  }

  async renameDir(uri: string, newUri: string) {
    if (uri === newUri)
      return ok(undefined)

    const dir = this.getDir(uri)
    const newDir = this.getDir(newUri)

    try {
      await fs.rename(dir, newDir)
      return ok(undefined)
    }
    catch (_e) {
      return err(new Error(`Cannot rename project dir \`${dir}\``))
    }
  }

  async deleteDir(uri: string) {
    const dir = this.getDir(uri)
    try {
      fs.unlink(dir)
      return ok(undefined)
    }
    catch (_e) {
      return err(new Error(`Cannot delete project dir \`${dir}\``))
    }
  }
}
