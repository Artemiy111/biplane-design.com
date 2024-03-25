import { cwd } from 'node:process'
import path from 'node:path'
import fs from 'node:fs/promises'
import type { IProjectFsRepo } from '../use-cases/types'

const PROJECTS_DIR = path.join(cwd(), `public/images/projects/`)

export function createProjectFsRepo(projectsDir: string): IProjectFsRepo {
  const getProjectDir = (uri: string) => path.join(projectsDir, uri)

  const createProjectDir = async (uri: string) => {
    const dir = getProjectDir(uri)
    await fs.mkdir(dir).catch(() => {
      throw new Error(`Cannot create project dir \`${dir}\``)
    })
  }

  const renameProjectDir = async (uri: string, newUri: string) => {
    const dir = getProjectDir(uri)
    const newDir = getProjectDir(newUri)

    await fs.rename(dir, newDir).catch(() => {
      throw new Error(`Cannot rename project dir \`${dir}\``)
    })
  }

  const deleteProjectDir = async (uri: string) => {
    const dir = getProjectDir(uri)
    fs.unlink(dir).catch(() => {
      throw new Error(`Cannot delete project dir \`${dir}\``)
    })
  }

  return {
    getProjectDir,
    createProjectDir,
    renameProjectDir,
    deleteProjectDir,
  }
}
