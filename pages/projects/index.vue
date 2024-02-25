<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { type ListBlobResult, type ListBlobResultBlob, list } from '@vercel/blob'
import { Carousel } from '~/components/ui/carousel'
import type { CategoryRec, GroupRec } from '~/server/db/schema'

const { md } = useScreenSize()
const { data: groups, error: _error } = await useFetch<GroupRec[]>('/api/groups')

const currentGroup = ref<GroupRec | null>(groups.value?.[0] || null)
const currentCategory = ref<CategoryRec | null>(currentGroup.value?.categories[0] || null)
const projectsWithImages = computed(() => currentCategory.value?.projects.filter(p => p.images.length) || null)
const images = ref<Record<string, ListBlobResultBlob[] >>({})

onMounted(async () => {
  groups.value?.forEach(g => g.categories.forEach(c =>

    c.projects.forEach((p) => {
      if (!p.images.length)
        return

      images.value[p.urlFriendly] = []

      $fetch(`/api/projects/${p.urlFriendly}/images`).then((r) => {
        r.blobs.forEach(img => images.value[p.urlFriendly].push(img))
      },

      )
    }),

  ))
})

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
            <CarouselItem v-for="img in images[p.urlFriendly]" :key="img.url">
              <!-- <NuxtImg format="avif,webp,png,jpg" :src="`/images/projects/${p.urlFriendly}/${img.filename}`" :alt="img.title || 'image'" class="aspect-video w-full object-cover" /> -->
              <NuxtImg format="avif,webp,png,jpg" :src="img.url" :alt="img.pathname || 'image'" class="aspect-video w-full object-cover" />
            </CarouselItem>
          </CarouselContent>
        </Carousel>
        <div class="mx-8 my-4 flex items-center justify-between gap-8">
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
