<script setup lang="ts">
import type { LocationQuery } from 'vue-router'

import { LoaderCircle } from 'lucide-vue-next'
import * as z from 'zod'

import type { CategoryDto } from '~~/server/types'

import { useApi } from '~~/src/shared/api'
import { cn } from '~~/src/shared/lib/utils'
import { HeadingTabs } from '~~/src/shared/ui/blocks/heading-tabs'
import { Carousel, CarouselContent, CarouselItem } from '~~/src/shared/ui/kit/carousel'
import { useGroups } from '~~/src/shared/model/queries'

const title = 'Проекты'
const description = 'Представлены различные категории проектов'
useServerSeoMeta({ title, ogTitle: title, description, ogDescription: description })
useSeoMeta({ title, ogTitle: title, description, ogDescription: description })

const querySchema = z.object({
  category: z.string().min(3),
})
const route = useRoute()
const router = useRouter()

const groups = ref(await useApi().groups.getAll.query())
const categories = computed(() => groups.value?.flatMap(g => g.categories) || [])

const currentCategory = ref<CategoryDto | null>(getCurrentCategory(route.query))
const currentGroup = computed(() => groups.value?.find(g => g.id === currentCategory.value?.groupId) || null)

const currentCategoryProjects = computed(() => currentCategory.value?.projects.filter(p => p.images.length) || null)

const tabs = computed(() => groups.value?.map(g => ({ title: g.title, value: g.slug })) || [])
const tab = computed({
  get: () =>   currentGroup.value!.slug,
  set: (v) => {
    const newGroup = groups.value.find(g => g.slug === v)!
    console.log('newGroup', newGroup.categories[0]!)
    navigateTo(`/projects?category=${newGroup.categories[0]!.slug}`)
  }
})

function getCategoryFromRouteQuery(query: LocationQuery): CategoryDto | null {
  const validatedQuery = querySchema.safeParse(query)
  if (!validatedQuery.success) return null

  const queryCategory = categories.value.find(c => c.slug === validatedQuery.data.category) || null

  if (!queryCategory) return null

  return queryCategory
}

function getCurrentCategory(query: LocationQuery) {
  return getCategoryFromRouteQuery(query) || categories.value[0]!
}

router.afterEach(guard =>  {
  console.log(route.name, guard.name)
  if (guard.name !== route.name) return
  (currentCategory.value = getCurrentCategory(guard.query))
})

const categoriesCarouselRef = useTemplateRef('categoriesCarouselRef')
const haveHiddenCategories = ref(false)

function setHiddenCategories() {
  if (!categoriesCarouselRef.value) return false
  const progress = categoriesCarouselRef.value.carouselApi!.scrollProgress()
  haveHiddenCategories.value
    = progress < 0 || Object.is(-0, progress) || (progress > 0 && progress < 1)
}

onMounted(() => {
  setHiddenCategories()
  categoriesCarouselRef.value?.carouselApi?.on('resize', setHiddenCategories)
  categoriesCarouselRef.value?.carouselApi?.on('scroll', setHiddenCategories)
})
</script>

<template>
  <main
    class="container flex h-full grow flex-col"
  >
    <div
      v-if="groups === null"
      class="flex size-full grow flex-col items-center justify-center"
    >
      <LoaderCircle
        class="animate-spin"
        :size="60"
        :stroke-width="1.5"
      />
    </div>
    <template v-else>
      <HeadingTabs
        v-model:tab="tab"
        :tabs="tabs"
      />
      <section
        v-if="currentGroup?.categories.length"
        class="relative mt-4"
      >
        <div
          class="pointer-events-none absolute right-0 top-0 z-50 h-full w-24 border-primary-foreground bg-gradient-to-r from-transparent to-white transition"
          :class="[haveHiddenCategories ? 'opacity-100' : 'opacity-0']"
        />
        <Carousel
          ref="categoriesCarouselRef"
          class="w-full"
          :opts="{
            dragFree: true,
          }"
        >
          <CarouselContent class="m-0 w-full gap-6">
            <CarouselItem
              v-for="c in currentGroup.categories"
              :key="c.id"
              class="basis-auto p-0"
            >
              <NuxtLink
                :class="cn('cursor-pointer', c.id === currentCategory?.id && 'font-semibold')"
                role="link"
                tabindex="0"
                :to="`/projects?category=${c.slug}`"
                variant="ghost"
              >
                {{ c.title }}
              </NuxtLink>
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </section>
      <section
        v-if="currentCategoryProjects?.length"
        :class="cn(
          'mt-8 grid grid-cols-2 gap-x-10 gap-y-12 lg:grid-cols-1',
          currentCategory?.layout === 'mini' && 'grid-cols-3 lg:grid-cols-2 xs:grid-cols-1',
        )"
      >
        <div
          v-for="p in currentCategoryProjects"
          :key="p.id"
          class="flex flex-col transition-colors"
        >
          <NuxtLink :to="`/projects/${p.slug}`">
            <NuxtImg
              :alt="p.images[0]!.alt"
              :class="cn('aspect-video w-full bg-background text-background', p.images[0]!.fit)"
              format="avif,webp,png,jpg"
              :height="500"
              :lazy="true"
              :src="p.images[0]!.url"
              :width="500"
            />
          </NuxtLink>
          <div class="mt-4 flex items-center justify-between gap-8">
            <h4>{{ p.title }}</h4>
            <span class="text-gray-400">{{ p.yearStart }}</span>
          </div>
        </div>
      </section>
      <section
        v-else
        class="grid h-full grow items-center justify-center"
      >
        <span class="bg-primary-foreground p-8 text-subheading">Проектов пока нет</span>
      </section>
    </template>
  </main>
</template>
