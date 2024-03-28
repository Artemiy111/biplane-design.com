import { err, ok } from '../shared/result'
import type { CreateProjectDto, IProjectDbRepo, IProjectFsRepo, IProjectRepo, ProjectId, UpdateProjectDto } from '../use-cases/types'

// Что делать если изменилось только в бд, но не в файловой системе?

export class ProjectRepo implements IProjectRepo {
  constructor(private dbRepo: IProjectDbRepo, private fsRepo: IProjectFsRepo) {}

  async getOne(id: ProjectId) {
    return this.dbRepo.getOne(id)
  }

  async getByUri(uri: string) {
    return this.dbRepo.getByUri(uri)
  }

  async getAll() {
    return this.dbRepo.getAll()
  }

  async create(dto: CreateProjectDto) {
    const createdInDb = await this.dbRepo.create(dto)
    if (!createdInDb.ok)
      return err(createdInDb.error)

    const createdInFs = await this.fsRepo.createDir(dto.uri)
    if (!createdInFs.ok)
      return err(createdInFs.error)

    return createdInDb
  }

  async update(dto: UpdateProjectDto) {
    const project = await this.dbRepo.getOne(dto.id)
    if (!project.ok)
      return err(project.error)

    const updatedInDb = await this.dbRepo.update(dto)
    if (!updatedInDb.ok)
      return err(updatedInDb.error)

    const updatedInFs = await this.fsRepo.renameDir(project.value.uri, dto.uri)
    if (!updatedInFs.ok)
      return err(updatedInFs.error)

    return updatedInDb
  }

  async delete(id: ProjectId) {
    const project = await this.dbRepo.getOne(id)
    if (!project.ok)
      return err(project.error)

    const deletedInDb = await this.dbRepo.delete(project.value.id)
    if (!deletedInDb.ok)
      return err(deletedInDb.error)

    const deletedInFs = await this.fsRepo.deleteDir(project.value.uri)
    if (!deletedInFs.ok)
      return err(deletedInFs.error)

    return ok(undefined)
  }
}
