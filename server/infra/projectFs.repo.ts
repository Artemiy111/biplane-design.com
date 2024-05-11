import path from 'node:path'
import fs from 'node:fs/promises'
import type { IProjectBucketRepo } from '../use-cases/types'
import { err, ok } from '../shared/result'

export class ProjectFsRepo implements IProjectBucketRepo {
  constructor(private projectsDir: string) { }

  getKey(uri: string) { return path.join(this.projectsDir, uri) }

  async isDirExists(uri: string) {
    const dir = this.getKey(uri)
    const exists = await fs.exists(dir)
    return ok(exists)
  }

  async createDir(uri: string) {
    const dir = this.getKey(uri)
    if (!(await this.isDirExists(uri)))
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

    const dir = this.getKey(uri)
    const newDir = this.getKey(newUri)

    try {
      await fs.rename(dir, newDir)
      return ok(undefined)
    }
    catch (_e) {
      return err(new Error(`Cannot rename project dir \`${dir}\``))
    }
  }

  async deleteDir(uri: string) {
    const dir = this.getKey(uri)
    try {
      fs.unlink(dir)
      return ok(undefined)
    }
    catch (_e) {
      return err(new Error(`Cannot delete project dir \`${dir}\``))
    }
  }
}
