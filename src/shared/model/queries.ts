import { useApi } from '../api'

export const useUser = defineQuery({ key: ['user'], query: () => useApi().user.whoami.query() })
export const useGroups = defineQuery({ key: ['groups'], query: () => useApi().groups.getAll.query() })

export const useProjects = defineQuery({ key: ['projects'], query: () => useApi().projects.getAll.query() })

export const useProject = (uri: Ref<string>) => {
  return useQuery({ key: () => ['project', uri.value], query: () => useApi().projects.getOneByUri.query({ uri: uri.value }) })
}
