<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import type { LocationQueryValue } from 'vue-router'
import * as z from 'zod'
import { Carousel } from '~/components/ui/carousel'
import type { CategoryRec, GroupRec } from '~/server/db/schema'

const querySchema = z.object({
  group: z.string().min(3),
  category: z.string().min(3),
})

const route = useRoute()
const router = useRouter()
const { md } = useScreenSize()
const { data: groups, error: _error } = await useFetch<GroupRec[]>('/api/groups')

const currentGroup = ref<GroupRec | null>(groups.value?.[0] || null)
const currentCategory = ref<CategoryRec | null>(currentGroup.value?.categories[0] || null)
const projectsWithImages = computed(() => currentCategory.value?.projects.filter(p => p.images.length) || null)

watch(() => route.query, () => {
  const query = querySchema.safeParse(route.query)
  if (!query.success)
    return

  const queryGroup = groups.value?.find(g => g.urlFriendly === query.data.group) || null
  const queryCategory = queryGroup?.categories.find(c => c.urlFriendly === query.data.category) || null

  if (!queryGroup || !queryCategory)
    return

  currentGroup.value = queryGroup
  currentCategory.value = queryCategory
}, { immediate: true })

watch(() => [currentGroup.value, currentCategory.value], () => {
  router.push({ query: { ...route.query, group: currentGroup.value?.urlFriendly, category: currentCategory.value?.urlFriendly } })
})

function toUrl(projectUrlFriendly: string, filename: string) {
  return `/images/projects/${projectUrlFriendly}/${filename}`
}

const categoriesCarouselRef = ref<InstanceType<typeof Carousel> | null>(null)
const haveHiddenCategories = ref(false)
const { width } = useWindowSize()
function isMinusZero(num: number) {
  return Object.is(-0, num)
}
onMounted(() => {
  if (!categoriesCarouselRef.value)
    return
  const progress = categoriesCarouselRef.value.carouselApi!.scrollProgress()
  haveHiddenCategories.value = isMinusZero(progress)
})
watch(width, () => {
  if (!categoriesCarouselRef.value)
    return
  const progress = categoriesCarouselRef.value.carouselApi!.scrollProgress()
  haveHiddenCategories.value = isMinusZero(progress)
})

function changeTheme(group: GroupRec) {
  if (group !== currentGroup.value) {
    currentGroup.value = group
    currentCategory.value = currentGroup.value.categories?.[0] || null
  }
  currentGroup.value = group
}

function changeCategory(category: CategoryRec) {
  currentCategory.value = category
}
</script>

<template>
  <main class="container flex h-full flex-grow flex-col">
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
      v-if="currentGroup?.categories.length" class="mx-8 my-4 sm:mx-2 sm:my-2 sm:gap-2"
      :class="[haveHiddenCategories ? 'border-r-4 border-primary-foreground' : '']"
    >
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
      <NuxtLink v-for="p in projectsWithImages" :key="p.id" :to="`/projects/${p.urlFriendly}`" class="flex flex-col transition-colors hover:bg-primary-foreground">
        <Carousel class="aspect-video w-full">
          <CarouselContent>
            <CarouselItem v-for="img in p.images" :key="img.filename">
              <!-- <NuxtImg format="avif,webp,png,jpg" :src="`/images/projects/${p.urlFriendly}/${img.filename}`" :alt="img.title || 'image'" class="aspect-video w-full object-cover" /> -->
              <NuxtImg format="avif,webp,png,jpg" :src="toUrl(img.projectUrlFriendly, img.filename)" :alt="img.title || 'image'" class="aspect-video w-full object-cover" />
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
