import type { ProjectId } from '~~/server/db/schema'
import type { UpdateProjectDto, CreateProjectDto } from '~~/server/use-cases/types'
import { useGroupsModel } from './groups'
import { api } from '~~/src/shared/api'

export const useProjectsModel = defineStore('projects', () => {
  const groupsModel = useGroupsModel()
  const { groups } = storeToRefs(groupsModel)
  const projects = computed(() => groups.value.flatMap(g => g.categories.flatMap(c => c.projects)))

  const getOneByUri = (uri: string) => projects.value.find(p => p.uri === uri) ?? null

  const create = async (dto: CreateProjectDto) => {
    const _data = await api.projects.create(dto)
    groupsModel.load()
  }

  const update = async (id: ProjectId, dto: UpdateProjectDto) => {
    const _data = await api.projects.update(id, dto)
    groupsModel.load()
  }

  const updateOrder = async (id: ProjectId, order: number) => {
    await api.projects.updateOrder(id, order)
    groupsModel.load()
  }

  const deleteOne = async (id: ProjectId) => {
    await api.projects.delete(id)
    groupsModel.load()
  }

  return {
    projects,
    getOneByUri,
    create,
    update,
    updateOrder,
    delete: deleteOne
  }
})

export const useProjects = () => {
  const projectsModel = useProjectsModel()
  return computed(() => projectsModel.projects)
}