<script setup lang="ts">
import * as z from 'zod'
import type { LocationQuery } from 'vue-router'
import { Carousel } from '~/components/ui/carousel'
import type { CategoryDto, GroupDto } from '~/server/use-cases/types'
import { LoaderCircle } from 'lucide-vue-next'

useSeoMeta({
  title: 'Проекты',
  ogTitle: 'Проекты',
  description: 'Представлены различные категории проектов',
  ogDescription: 'Представлены различные категории проектов',
})

const querySchema = z.object({
  group: z.string().min(3),
  category: z.string().min(3)
})

const route = useRoute()
const router = useRouter()
const { md } = useScreenSize()
const { data: groups, pending, error: _error } = await useLazyFetch<GroupDto[]>('/api/groups')

const currentGroup = ref<GroupDto | null>(groups.value?.[0] || null)
const currentCategory = ref<CategoryDto | null>(currentGroup.value?.categories[0] || null)
const projectsWithImages = computed(() => currentCategory.value?.projects.filter(p => p.images.length) || null)

function handleRouteQuery(query: LocationQuery) {
  const validatedQuery = querySchema.safeParse(query)
  if (!validatedQuery.success)
    return

  const queryGroup = groups.value?.find(g => g.uri === validatedQuery.data.group) || null
  const queryCategory = queryGroup?.categories.find(c => c.uri === validatedQuery.data.category) || null

  if (!queryGroup || !queryCategory)
    return

  currentGroup.value = queryGroup
  currentCategory.value = queryCategory
}

handleRouteQuery(route.query)
router.afterEach(guard => handleRouteQuery(guard.query))

watch(() => [currentGroup.value, currentCategory.value], () => {
  router.push({ query: { ...route.query, group: currentGroup.value?.uri, category: currentCategory.value?.uri } })
})

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

function changeTheme(group: GroupDto) {
  if (group !== currentGroup.value) {
    currentGroup.value = group
    currentCategory.value = currentGroup.value.categories?.[0] || null
  }
  currentGroup.value = group
}

function changeCategory(category: CategoryDto) {
  currentCategory.value = category
}
</script>

<template>
  <main v-if="pending" class="container flex h-full flex-grow flex-col items-center justify-center">
    <LoaderCircle :size="60" :stroke-width="1.5" class="animate-spin" />
  </main>
  <main v-else class="container flex h-full flex-grow flex-col">
    <section class="grid grid-cols-2 items-center divide-x text-3xl 2xl:text-2xl lg:text-xl md:text-lg sm:text-base">
      <h2
        v-for="group in groups" :key="group.id"
        class="w-full cursor-pointer px-8 py-4 font-bold transition-colors hover:bg-secondary sm:px-4 sm:py-2"
        :class="[group === currentGroup ? 'bg-primary-foreground' : '']"
        tabindex="0"
        @keypress.enter.space="changeTheme(group)"
        @click="changeTheme(group)"
      >
        {{ group.title }}
      </h2>
    </section>
    <Separator />
    <section
      v-if="currentGroup?.categories.length" class="relative mx-8 my-4 sm:mx-2 sm:my-2 sm:gap-2"
    >
      <div
        :class="[haveHiddenCategories ? 'opacity-100' : 'opacity-0']"
        class="pointer-events-none absolute right-0 top-0 z-50 h-full w-24 border-primary-foreground bg-gradient-to-r from-transparent to-white transition"
      />
      <Carousel
        ref="categoriesCarouselRef" class="w-full" :opts="{
          dragFree: true,
        }"
      >
        <CarouselContent class="">
          <CarouselItem
            v-for="c in currentGroup.categories" :key="c.id" class="w-fit shrink-0 basis-auto"
          >
            <Button
              :size="md ? 'sm' : 'default'"
              :class="[c === currentCategory ? 'bg-primary-foreground font-bold' : '']"
              variant="ghost"
              @click="changeCategory(c)"
            >
              {{ c.title }}
            </Button>
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </section>
    <Separator v-if="currentGroup?.categories.length" />
    <section v-if="projectsWithImages?.length" class="grid grid-cols-2 gap-x-[2px] gap-y-[2px] lg:grid-cols-1">
      <NuxtLink v-for="p in projectsWithImages" :key="p.id" :to="`/projects/${p.uri}`" class="flex flex-col transition-colors hover:bg-primary-foreground">
        <Carousel class="aspect-video w-full">
          <CarouselContent>
            <CarouselItem v-for="img in p.images" :key="img.filename">
              <NuxtImg format="avif,webp,png,jpg" :src="img.url" :alt="img.alt" class="aspect-video w-full object-cover" />
            </CarouselItem>
          </CarouselContent>
        </Carousel>
        <div class="flex items-center justify-between gap-8 px-8 py-4 sm:px-4 sm:py-2">
          <h4>{{ p.title }}</h4>
          <span class="text-slate-400">{{ p.yearStart }}</span>
        </div>
      </NuxtLink>
    </section>
    <section v-else class="grid h-full flex-grow items-center justify-center">
      <span class="bg-primary-foreground p-8 text-lg md:text-base">Проектов пока нет</span>
    </section>
  </main>
</template>
