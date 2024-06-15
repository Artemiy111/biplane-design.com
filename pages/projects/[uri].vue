<script setup lang="ts">
import { useElementSize } from '@vueuse/core'
import type { ComponentPublicInstance } from 'vue'
import { Carousel, type CarouselApi } from '@/components/ui/carousel'
import type { GroupDto, ProjectDto } from '~/server/use-cases/types'
import { cn } from '~/lib/utils'

const projectUri = useRoute().params.uri! as string
const { data: cachedGroups } = useNuxtData<GroupDto[]>('groups')
const { data: project, error: _error } = await useLazyFetch<ProjectDto | null>(`/api/projects/?uri=${projectUri}`, {
  default() {
    const cached = cachedGroups.value?.flatMap(g => g.categories.flatMap(c => c.projects)).find(p => p.uri === projectUri) || null
    return cached
  },
})

const api = ref<CarouselApi | null>(null)
const apiTumb = ref<CarouselApi | null>(null)
const mainCarouselRef = ref<ComponentPublicInstance | null>(null)
const { height: mainCarouselHeight } = useElementSize(mainCarouselRef)
const totalCount = ref(0)
const current = ref(0)

useSeoMeta({
  title: () => `Проекты | ${project.value?.title}`,
  ogTitle: () => `Проекты | ${project.value?.title}`,
  description: () => `${project.value?.title}. Расположение: ${project.value?.location}`,
  ogDescription: () => `${project.value?.title}. Расположение: ${project.value?.location}`,
})

watch(api, (api) => {
  if (!api)
    return

  totalCount.value = api.scrollSnapList().length
  current.value = api.selectedScrollSnap()

  api.on('select', (api) => {
    current.value = api.selectedScrollSnap()
  })
}, { once: true })
watch(current, () => scrollToImage(current.value))

function scrollToImage(index: number) {
  apiTumb.value?.scrollTo(index)
  api.value?.scrollTo(index)
}
</script>

<template>
  <main
    v-if="project"
    class="container flex flex-col"
  >
    <section class="flex justify-between px-8 py-4 text-3xl 2xl:text-2xl lg:text-xl md:text-lg sm:py-2 sm:px-4 sm:text-base">
      <h1 class="font-bold">
        {{ project.title }}
      </h1>
    </section>
    <Separator />
    <section
      class="grid h-fit grid-cols-[300px,1fr] items-start divide-x-2 divide-primary-foreground overflow-hidden 2xl:grid-cols-[250px,1fr] xl:grid-cols-[200px,1fr] lg:grid-cols-[150px,1fr] md:grid-cols-1"
    >
      <Carousel
        class="md:hidden"
        orientation="vertical"
        :opts="{
          loop: false,
          align: 'start',
          dragFree: true,
        }"
        @init-api="apiTumb = $event"
      >
        <CarouselContent
          class="mt-0 divide-y-2"
          :style="{ maxHeight: `${mainCarouselHeight}px` }"
        >
          <CarouselItem
            v-for="(img, index) in project.images"
            :key="img.id"
            class="cursor-grab p-0"

            :class="[index === current ? 'outline outline-[16px] xl:outline-8 xl:-outline-offset-8 outline-secondary -outline-offset-[16px]' : '']"
            @click="current = index"
          >
            <NuxtImg
              :src="img.url"
              :alt="img.alt"
              format="avif,webp,png,jpg"
              :class="cn('aspect-video w-full', img.fit)"
            />
          </CarouselItem>
        </CarouselContent>
      </Carousel>
      <Carousel
        ref="mainCarouselRef"
        class="aspect-video w-full md:hidden"
        :opts="{
          loop: false,
        }"
        @init-api="api = $event"
      >
        <CarouselContent class="flex items-center">
          <CarouselItem
            v-for="img in project.images"
            :key="img.id"
            class="flex items-center justify-center"
          >
            <NuxtImg
              :src="img.url"
              :alt="img.alt"
              format="avif,webp,png,jpg"
              :class="img.fit"
              class="aspect-video w-full"
            />
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </section>
    <Separator />
    <NuxtImg
      :key="project.images[0].id"
      :src="project.images[0].url"
      :alt="project.images[0].alt"
      format="avif,webp,png,jpg"
      class="aspect-video w-full hidden md:block"
    />
    <section class="grid grid-cols-[repeat(2,max-content)] gap-x-16 gap-y-2 px-8 py-8 sm:px-4">
      <span>Статус</span>
      <span>{{ project.status }}</span>
      <template v-if="project.location">
        <span>Расположение</span>
        <span>{{ project.location }}</span>
      </template>
      <template v-if="project.yearStart">
        <span>Год начала</span>
        <span>{{ project.yearStart }}</span>
      </template>
      <template v-if="project.yearEnd">
        <span>Год завершения</span>
        <span>{{ project.yearEnd }}</span>
      </template>
    </section>
    <div class="md:flex w-full flex-col gap-4 hidden">
      <NuxtImg
        v-for="img in project.images.slice(1, -1)"
        :key="img.id"
        :src="img.url"
        :alt="img.alt"
        format="avif,webp,png,jpg"
        class="aspect-video w-full max-h-[70vh]"
      />
    </div>
  </main>
</template>
