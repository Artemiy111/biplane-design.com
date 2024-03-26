import { err, ok } from '../shared/result'
import type { CreateProjectDto, IProjectDbRepo, IProjectFsRepo, IProjectRepo, ProjectId, UpdateProjectDto } from '../use-cases/types'

// Что делать если изменилось только в бд, но не в файловой системе?

export class ProjectRepo implements IProjectRepo {
  constructor(private dbRepo: IProjectDbRepo, private fsRepo: IProjectFsRepo) {}

  async getProject(id: ProjectId) {
    return this.dbRepo.getProject(id)
  }

  async getProjects() {
    return this.dbRepo.getProjects()
  }

  async createProject(dto: CreateProjectDto) {
    const createdInDb = await this.dbRepo.createProject(dto)
    if (!createdInDb.ok)
      return err(createdInDb.error)

    const createdInFs = await this.fsRepo.createProjectDir(dto.uri)
    if (!createdInFs.ok)
      return err(createdInFs.error)

    return createdInDb
  }

  async updateProject(dto: UpdateProjectDto) {
    const project = await this.dbRepo.getProject(dto.id)
    if (!project.ok)
      return err(project.error)

    const updatedInDb = await this.dbRepo.updateProject(dto)
    if (!updatedInDb.ok)
      return err(updatedInDb.error)

    const updatedInFs = await this.fsRepo.renameProjectDir(project.value.uri, dto.uri)
    if (!updatedInFs.ok)
      return err(updatedInFs.error)

    return updatedInDb
  }

  async deleteProject(id: ProjectId) {
    const project = await this.dbRepo.getProject(id)
    if (!project.ok)
      return err(project.error)

    const deletedInDb = await this.dbRepo.deleteProject(project.value.id)
    if (!deletedInDb.ok)
      return err(deletedInDb.error)

    const deletedInFs = await this.fsRepo.deleteProjectDir(project.value.uri)
    if (!deletedInFs.ok)
      return err(deletedInFs.error)

    return ok(undefined)
  }
}
