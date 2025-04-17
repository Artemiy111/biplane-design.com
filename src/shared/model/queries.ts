import { useApi } from '../api'

export const useUserQuery = defineQuery({ key: ['user'], query: () => useApi().user.whoami.query() })


export const useGroupsQuery = defineQuery(() => {
  const { data: _groups, state, ...rest } = useQuery({ key: ['groups'], query: () => useApi().groups.getAll.query(), initialData: () => [] })
  const groups = computed(() => _groups.value || [])
  const categories = computed(() => groups.value.flatMap(g => g.categories))

  return { groups, categories, ...rest }
})

export const useProjectsQuery = defineQuery({ key: ['projects'], query: () => useApi().projects.getAll.query() })

export const useProjectQuery = (slug: Ref<string>) => {
  return useQuery({ key: () => ['project', slug.value], query: () => useApi().projects.getOneBySlug.query({ slug: slug.value }) })
}
