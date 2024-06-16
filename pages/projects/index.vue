<script setup lang="ts">
import * as z from 'zod'
import type { LocationQuery } from 'vue-router'
import { LoaderCircle } from 'lucide-vue-next'
import { Carousel } from '~/components/ui/carousel'
import type { CategoryDto, GroupDto } from '~/server/use-cases/types'
import { cn } from '~/lib/utils'

useServerSeoMeta({
  title: 'Проекты',
  ogTitle: 'Проекты',
  description: 'Представлены различные категории проектов',
  ogDescription: 'Представлены различные категории проектов',
})

const querySchema = z.object({
  category: z.string().min(3),
})

const route = useRoute()
const router = useRouter()
const { md } = useScreenSize()
const { data: cachedGroups } = useNuxtData<GroupDto[]>('groups')
const { data: groups, error: _error } = await useLazyFetch<GroupDto[] | null>('/api/groups', {
  key: 'groups',
  default() {
    return cachedGroups.value
  },
})
const categories = computed(() => groups.value?.flatMap(g => g.categories) || [])

const currentCategory = ref<CategoryDto | null>(getCurrentCategory(route.query))
const currentGroup = computed(() => groups.value?.find(g => g.id === currentCategory.value?.groupId) || null)

const currentCategoryProjects = computed(() => currentCategory.value?.projects.filter(p => p.images.length) || null)

watch(groups, () => {
  if (groups.value && !currentCategory.value)
    navigateTo({ path: route.path, query: { category: groups.value?.[0]?.categories[0]?.uri } })
})

function getCategoryFromFromRouteQuery(query: LocationQuery): CategoryDto | null {
  const validatedQuery = querySchema.safeParse(query)
  if (!validatedQuery.success)
    return null

  const queryCategory = categories.value.find(c => c.uri === validatedQuery.data.category) || null

  if (!queryCategory)
    return null

  return queryCategory
}

function getCurrentCategory(query: LocationQuery) {
  return getCategoryFromFromRouteQuery(query) || categories.value[0] || null
}

router.afterEach(guard => currentCategory.value = getCurrentCategory(guard.query))

const categoriesCarouselRef = ref<InstanceType<typeof Carousel> | null>(null)
const haveHiddenCategories = ref(false)

function setHiddenCategories() {
  if (!categoriesCarouselRef.value)
    return false
  const progress = categoriesCarouselRef.value.carouselApi!.scrollProgress()
  haveHiddenCategories.value = progress < 0 || Object.is(-0, progress) || (progress > 0 && progress < 1)
}

onMounted(() => {
  setHiddenCategories()
  categoriesCarouselRef.value?.carouselApi?.on('resize', setHiddenCategories)
  categoriesCarouselRef.value?.carouselApi?.on('scroll', setHiddenCategories)
})

function changeGroup(group: GroupDto) {
  if (group.id !== currentCategory.value?.groupId) {
    currentCategory.value = group.categories[0] || null
  }
}

const { size } = useScreenSize()

const dummyProjects = computed(() => {
  if (!currentCategory.value) return 0
  const count = currentCategory.value.projects.length
  if (currentCategory.value.layout === 'mini') {
    if (size.value === 'xs') return 0
    if (size.value === 'sm' || size.value === 'md' || size.value === 'lg') return count % 2
    else return count % 3
  }
  else {
    if (size.value === 'default' || size.value === '2xl' || size.value === 'xl') return count % 2
    else return 0
  }
})
</script>

<template>
  <main
    v-if="groups === null"
    class="container flex h-full flex-grow flex-col items-center justify-center"
  >
    <LoaderCircle
      :size="60"
      :stroke-width="1.5"
      class="animate-spin"
    />
  </main>
  <main
    v-else
    class="container flex h-full flex-grow flex-col"
  >
    <section class="grid grid-cols-2 items-center divide-x text-xl lg:text-lg sm:text-base">
      <h2
        v-for="group in groups"
        :key="group.id"
        :class="cn('w-full cursor-pointer px-8 py-4 transition-colors hover:bg-secondary md:py-3 sm:px-4 sm:py-2',
                   group.id === currentGroup?.id && 'bg-primary-foreground font-semibold')"
        tabindex="0"
        @keypress.enter.space="changeGroup(group)"
        @click="changeGroup(group)"
      >
        {{ group.title }}
      </h2>
    </section>
    <Separator />
    <section
      v-if="currentGroup?.categories.length"
      class="relative mx-8 my-4 sm:mx-2 sm:my-2 sm:gap-2 md:my-3"
    >
      <div
        :class="[haveHiddenCategories ? 'opacity-100' : 'opacity-0']"
        class="pointer-events-none absolute right-0 top-0 z-50 h-full w-24 border-primary-foreground bg-gradient-to-r from-transparent to-white transition"
      />
      <Carousel
        ref="categoriesCarouselRef"
        class="w-full"
        :opts="{
          dragFree: true,
        }"
      >
        <CarouselContent class="">
          <CarouselItem
            v-for="c in currentGroup.categories"
            :key="c.id"
            class="w-fit shrink-0 basis-auto"
          >
            <Button
              :size="md ? 'sm' : 'default'"
              :class="cn(c.id === currentCategory?.id && 'bg-primary-foreground font-semibold')"
              variant="ghost"
              @click="navigateTo({ path: route.path, query: { category: c.uri } })"
            >
              {{ c.title }}
            </Button>
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </section>
    <Separator
      v-if="currentGroup?.categories.length"
    />
    <section
      v-if="currentCategoryProjects?.length"
      :class="cn('grid grid-cols-2 gap-x-[1px] bg-border gap-y-[1px] lg:grid-cols-1',
                 currentCategory?.layout === 'mini' && 'grid-cols-3 lg:grid-cols-2 xs:grid-cols-1')"
    >
      <template
        v-for="p in currentCategoryProjects "
        :key="p.id"
      >
        <Carousel
          v-if="p.isMinimal"
          :opts="{ active: false }"
          class="w-full"
        >
          <CarouselContent>
            <CarouselItem
              v-for="img in p.images.slice(0, 1)"
              :key="img.id"
            >
              <img
                loading="lazy"
                format="avif,webp,png,jpg"
                :width="500"
                :height="500"
                :src="img.url"
                :alt="img.alt"
                :class="cn('aspect-video w-full bg-white', img.fit)"
              >
            </CarouselItem>
          </CarouselContent>
        </Carousel>
        <NuxtLink
          v-else
          :to="`/projects/${p.uri}`"
          class="flex flex-col transition-colors bg-white hover:bg-primary-foreground"
        >

          <NuxtImg
            loading="lazy"
            format="avif,webp,png,jpg"
            :width="500"
            :height="500"
            :src="p.images[0].url"
            :alt="p.images[0].alt"
            :class="cn('aspect-video w-full bg-white', p.images[0].fit)"
          />
          <div
            class="flex items-center justify-between gap-8 px-8 py-4 sm:px-4 sm:py-2"
          >
            <h4>{{ p.title }}</h4>
            <span class="text-slate-400">{{ p.yearStart }}</span>
          </div>
        </NuxtLink>
      </template>
      <div
        v-for="n in dummyProjects"
        :key="n"
        class="bg-white"
      />
    </section>
    <section
      v-else
      class="grid h-full flex-grow items-center justify-center"
    >
      <span class="bg-primary-foreground p-8 text-lg md:text-base">Проектов пока нет</span>
    </section>
  </main>
</template>
