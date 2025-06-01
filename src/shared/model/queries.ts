import type { UnwrapRef } from 'vue'

import { useApi } from '../api'

export const useUserQuery = defineQuery({ key: ['user'], query: () => useApi().user.whoami.query() })

export const useGroupsQuery = defineQuery(() => {
  const { data: _groups, state, ...rest } = useQuery({ key: ['groups'], query: () => useApi().groups.getAll.query(), initialData: () => [] })
  const groups = computed(() => _groups.value || [])
  const categories = computed(() => groups.value.flatMap(g => g.categories))
  const projects = computed(() => categories.value.flatMap(c => c.projects))
  return { groups, categories, projects, ...rest }
})

export const useProjectQuery = (slug: Ref<string>) => {
  const { data: project, state, ...rest } = useQuery(
    {
      key: () => ['projects', slug.value], query: () => useApi().projects.getOneBySlug.query({ slug: slug.value }),
      placeholderData: () => {
        const qc = useQueryCache()
        const projects = qc.getQueryData(['groups']) as UnwrapRef<ReturnType<typeof useGroupsQuery>['projects']> | undefined
        if (!projects) return undefined
        const project = projects.find(p => p.slug === slug.value)
        return project
      },
    })
  return { project: project || null, ...rest }
}
