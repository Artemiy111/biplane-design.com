import type { GroupDto } from '~~/server/use-cases/types'

export const useGroupsModel = defineStore('groups', () => {
  const groups = ref<GroupDto[]>([])
  const categories = computed(() => groups.value.flatMap(g => g.categories))

  const load = async () => {
    groups.value = await $fetch<GroupDto[]>('/api/groups')
    return groups.value
  }


  return {
    groups,
    categories,
    load
  }
})

export const useGroups = () => {
  const groupsModel = useGroupsModel()
  return computed(() => groupsModel.groups)
}
