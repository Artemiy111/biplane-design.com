export const useGroupsModel = defineStore('groups', () => {
  const { data: groups, status, refresh } = useFetch('/api/groups', {
    key: 'groups',
  })

  return {
    groups,
    status,
    refresh,
  }
})

export const useGroups = () => {
  const groupsModel = useGroupsModel()
  return computed(() => groupsModel.groups ?? [])
}
