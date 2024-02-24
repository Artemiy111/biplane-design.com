<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { Carousel } from '~/components/ui/carousel'
import type { CategoryRec, GroupRec } from '~/server/db/schema'

const { md } = useScreenSize()
const { data: groups, error: _error } = await useFetch<GroupRec[]>('/api/groups')

const currentGroup = ref<GroupRec | null>(groups.value?.[0] || null)
const currentCategory = ref<CategoryRec | null>(currentGroup.value?.categories[0] || null)
const projectsWithImages = computed(() => currentCategory.value?.projects.filter(p => p.images.length) || null)

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
  <main class="flex flex-col flex-grow container h-full">
    <section class="grid items-center grid-cols-2 divide-x sm:text-base lg:text-xl md:text-lg 2xl:text-2xl text-3xl">
      <h2
        v-for="group in groups" :key="group.id"
        class="font-bold w-full px-8 py-4 sm:px-4 sm:py-2 hover:bg-secondary cursor-pointer transition-colors"
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
      v-if="currentGroup?.categories.length" class="mx-8 sm:mx-2 sm:gap-2 sm:my-2 my-4 "
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
              :class="[c === currentCategory ? 'bg-primary-foreground' : '']"
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
    <section v-if="projectsWithImages?.length" class="grid lg:grid-cols-1 grid-cols-2 gap-x-[2px] gap-y-[2px] ">
      <NuxtLink v-for="p in projectsWithImages" :key="p.id" :to="`/projects/${p.urlFriendly}`" class="flex flex-col hover:bg-primary-foreground transition-colors">
        <Carousel class="w-full aspect-video">
          <CarouselContent>
            <CarouselItem v-for="img in p.images" :key="img.id">
              <NuxtImg format="avif,webp,png,jpg" :src="`/images/projects/${p.urlFriendly}/${img.filename}`" :alt="img.title || 'image'" class="aspect-video w-full object-cover" />
            </CarouselItem>
          </CarouselContent>
        </Carousel>
        <div class="flex gap-8 mx-8 my-4 items-center justify-between">
          <h4>{{ p.title }}</h4>
          <span class="text-slate-400">{{ p.yearStart }}</span>
        </div>
      </NuxtLink>
    </section>
    <section v-else class="grid flex-grow h-full justify-center items-center">
      <span class="text-lg md:text-base p-8 bg-primary-foreground font-bold">Проектов пока нет</span>
    </section>
  </main>
</template>
