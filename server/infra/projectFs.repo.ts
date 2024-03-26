import { cwd } from 'node:process'
import path from 'node:path'
import fs from 'node:fs/promises'
import type { IProjectFsRepo } from '../use-cases/types'
import { err, ok } from '../shared/result'
import type { Result } from '../shared/result'

const _PROJECTS_DIR = path.join(cwd(), `public/images/projects`)

export class ProjectFsRepo implements IProjectFsRepo {
  constructor(private projectsDir: string) {}

  getProjectDir(uri: string) { return path.join(this.projectsDir, uri) }

  async createProjectDir(uri: string) {
    const dir = this.getProjectDir(uri)
    try {
      fs.mkdir(dir)
    }
    catch (_e) {
      return err(new Error(`Cannot create project dir \`${dir}\``))
    }
    return ok(undefined)
  }

  async renameProjectDir(uri: string, newUri: string) {
    const dir = this.getProjectDir(uri)
    const newDir = this.getProjectDir(newUri)

    try {
      await fs.rename(dir, newDir)
    }
    catch (_e) {
      return err(new Error(`Cannot rename project dir \`${dir}\``))
    }
    return ok(undefined)
  }

  async deleteProjectDir(uri: string) {
    const dir = this.getProjectDir(uri)
    try {
      fs.unlink(dir)
    }
    catch (_e) {
      return err(new Error(`Cannot delete project dir \`${dir}\``))
    }
    return ok(undefined)
  }
}
