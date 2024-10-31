import { useGroupsModel } from './groups'

export const useProjectsModel = defineStore('projects', () => {
  const groupsModel = useGroupsModel()
  const { groups } = storeToRefs(groupsModel)
  const projects = computed(() => groups.value.flatMap(g => g.categories.flatMap(c => c.projects)))

  const getOneByUri = (uri: string) => projects.value.find(p => p.uri === uri) ?? null

  // const useOneByUri = (uri: Ref<string>) => computed(() => projects.value.find(p => p.uri === uri.value) ?? null)

  return {
    projects,
    getOneByUri
  }
})

