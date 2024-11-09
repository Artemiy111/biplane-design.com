import type { ImageId } from '~~/server/db/schema'
import type { ProjectDto, UpdateImageDto, UpdateProjectDto } from '~~/server/use-cases/types'

import { useApi } from '../api'
import { useProjectsModel } from './projects'

export const useProjectModel = defineStore('project', () => {
  const api = useApi()
  const projectsModel = useProjectsModel()
  const project = ref<ProjectDto | null>(null)

  const load = async (uri: string) => {
    if (project.value === null) project.value = projectsModel.getOneByUri(uri)
    project.value = await api.projects.getOneByUri.query({ uri })
    return project.value
  }

  const deleteImage = async (id: ImageId) => {
    if (!project.value) return
    const snapshot = project.value.images
    project.value.images = project.value.images.filter(img => img.id !== id)
    try {
      await api.images.deleteOne.mutate({ id })
    }
    catch (_e) {
      project.value.images = snapshot
      throw _e
    }
  }

  const updateImage = async (id: ImageId, dto: UpdateImageDto) => {
    if (!project.value) return
    const snapshot = project.value.images

    const imageIdx = project.value.images.findIndex(img => img.id === id)
    const [image] = project.value.images.splice(imageIdx, 1)
    if (!image) return

    project.value.images.splice(dto.order - 1, 0, { ...image, ...dto })
    project.value.images.forEach((img, idx) => img.order = idx + 1)
    try {
      await api.images.updateOne.mutate({ id, ...dto })
    }
    catch (_e) {
      project.value.images = snapshot
      throw _e
    }
  }

  const uploadImages = async (images: File[]) => {
    if (!project.value) return
    const promises = images.map(async (image) => {
      return await api.images.createOne.mutate({ file: image, projectId: project.value!.id })
    })
    return promises
  }

  return {
    project,
    load,
    deleteImage,
    updateImage,
    uploadImages,
  }
})
