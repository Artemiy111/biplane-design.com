import type { GroupId } from '~~/server/db/schema'
import type { GroupDto } from '~~/server/use-cases/types'

import { useApi } from '~~/src/shared/api'

export const useGroupsModel = defineStore('groups', () => {
  const api = useApi()
  const groups = ref<GroupDto[]>([])
  const categories = computed(() => groups.value.flatMap(g => g.categories))

  const load = async () => {
    groups.value = await api.groups.getAll.query()
    return groups.value
  }

  const getById = (id: GroupId) => groups.value.find(g => g.id === id)

  return {
    groups,
    categories,
    load,
    getById,
  }
})

export const useGroups = () => {
  const groupsModel = useGroupsModel()
  return computed(() => groupsModel.groups)
}

export const useCategories = () => {
  const groupsModel = useGroupsModel()
  return computed(() => groupsModel.categories)
}
