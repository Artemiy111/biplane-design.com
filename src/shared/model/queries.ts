import { useApi } from '../api'

export const useUser = defineQuery({ key: ['user'], query: () => useApi().user.whoami.query() })

export const useGroups = defineQuery({ key: ['groups'], query: () => useApi().groups.getAll.query() })

export const useProjects = defineQuery({ key: ['projects'], query: () => useApi().projects.getAll.query() })

export const useProject = (slug: Ref<string>) => {
  return useQuery({ key: () => ['project', slug.value], query: () => useApi().projects.getOneBySlug.query({ slug: slug.value }) })
}
