<script setup lang="ts">
import { useBreakpoints, useElementSize, watchOnce } from '@vueuse/core'

import { useApi } from '~~/src/shared/api'
import { cn } from '~~/src/shared/lib/utils'
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '~~/src/shared/ui/kit/carousel'
import { screenBreakpoints } from '~~/tailwind.config'

const props = defineProps<{
  slug: string
}>()

const { data: project } = useApi().projects.getOneBySlug.useQuery({ slug: props.slug }, { watch: [() => props.slug] })

const api = ref<CarouselApi>()
const apiTumb = ref<CarouselApi>()
const carouselRef = ref<HTMLElement | null>(null)
const { height: carouselHeight } = useElementSize(carouselRef)
const totalCount = ref(0)
const current = ref(0)

const title = computed(() => `Проекты | ${project.value?.title}`)
const description = computed(() => `${project.value?.title}. Расположение: ${project.value?.location}`)
useServerSeoMeta({ title, ogTitle: title, description, ogDescription: description })
useSeoMeta({ title, ogTitle: title, description, ogDescription: description })

watchOnce(api, (api) => {
  if (!api) return

  totalCount.value = api.scrollSnapList().length
  current.value = api.selectedScrollSnap()

  api.on('select', (api) => {
    current.value = api.selectedScrollSnap()
  })
})
watch(current, () => scrollToImage(current.value))

function scrollToImage(index: number): void {
  apiTumb.value?.scrollTo(index)
  api.value?.scrollTo(index)
}

const breakpoints = useBreakpoints(screenBreakpoints, { strategy: 'max-width' })
const md = breakpoints.smallerOrEqual('md')
</script>

<template>
  <main
    v-if="project"
    class="container flex flex-col"
  >
    <section class="flex justify-between px-8 py-4 text-xl lg:text-lg sm:py-2 sm:px-4 sm:text-base">
      <h1 class="font-semibold">
        {{ project.title }}
      </h1>
    </section>
    <section
      class="grid h-fit grid-cols-[300px,1fr] items-start gap-4 overflow-hidden 2xl:grid-cols-[250px,1fr] xl:grid-cols-[200px,1fr] lg:grid-cols-[150px,1fr] md:grid-cols-1"
    >
      <Carousel
        v-if="!md"
        :opts="{
          loop: false,
          align: 'start',
          dragFree: true,
        }"
        orientation="vertical"
        @init-api="apiTumb = $event"
      >
        <CarouselContent
          class="m-0 h-100% gap-[4px]"
          :style="{ maxHeight: `${carouselHeight}px` }"
        >
          <CarouselItem
            v-for="(img, index) in project.images"
            :key="img.id"
            class="cursor-grab p-0"

            :class="[index === current ? 'outline outline-8 outline-black -outline-offset-8' : '']"
            @click="current = index"
          >
            <NuxtImg
              :alt="img.alt"
              :class="cn('aspect-video w-full', img.fit)"
              format="avif,webp,png,jpg"
              :src="img.url"
            />
          </CarouselItem>
        </CarouselContent>
      </Carousel>
      <Carousel
        :ref="(c) => {
          const c_ = c as InstanceType<typeof Carousel>
          carouselRef = (c_?.carouselRef as HTMLElement) ?? null
        }"
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
              :alt="img.alt"
              :class="cn('aspect-video w-full', img.fit)"
              format="avif,webp,png,jpg"
              :src="img.url"
            />
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </section>

    <section class="grid grid-cols-[repeat(2,max-content)] gap-x-4 gap-y-4 px-8 py-12 sm:px-4">
      <span class="font-semibold">Статус</span>
      <span>{{ project.status }}</span>
      <template v-if="project.location">
        <span class="font-semibold">Расположение</span>
        <span>{{ project.location }}</span>
      </template>
      <template v-if="project.yearStart">
        <span class="font-semibold">Год начала</span>
        <span>{{ project.yearStart }}</span>
      </template>
      <template v-if="project.yearEnd">
        <span class="font-semibold">Год завершения</span>
        <span>{{ project.yearEnd }}</span>
      </template>
    </section>
    <div
      v-if="md"
      class="flex w-full flex-col gap-4"
    >
      <NuxtImg
        v-for="img in project.images"
        :key="img.id"
        :alt="img.alt"
        :class="cn('w-full max-h-[70vh]', img.fit)"
        format="avif,webp,png,jpg"
        :src="img.url"
      />
    </div>
  </main>
</template>
