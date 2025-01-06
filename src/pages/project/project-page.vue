<script setup lang="ts">
import { useBreakpoints, useElementSize, watchOnce } from '@vueuse/core'

import { useApi } from '~~/src/shared/api'
import { cn } from '~~/src/shared/lib/utils'
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '~~/src/shared/ui/kit/carousel'
import { screenBreakpoints } from '~~/tailwind.config'

const props = defineProps<{
  slug: string
}>()

const { data: project } = await useApi().projects.getOneBySlug.useQuery({ slug: props.slug }, { watch: [() => props.slug] })

const api = ref<CarouselApi>()
const apiTumb = ref<CarouselApi>()
const carouselRef = useTemplateRef('carouselRef')
const { height: carouselHeight } = useElementSize(() => carouselRef.value?.carouselRef)
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
const xl = breakpoints.smallerOrEqual('xl')
</script>

<template>
  <main
    v-if="project"
    class="container flex flex-col"
  >
    <section class="my-8 flex justify-between">
      <h1 class="text-heading">
        {{ project.title }}
      </h1>
    </section>
    <section
      class="grid h-fit grid-cols-[300px,1fr] items-start gap-4 overflow-hidden 2xl:grid-cols-[250px,1fr] lg:grid-cols-[150px,1fr] md:grid-cols-1 xl:grid-cols-1"
    >
      <Carousel
        class="xl:order-2"
        :opts="{
          loop: false,
          align: 'start',
          dragFree: true,
        }"
        :orientation="xl ? 'horizontal' : 'vertical'"
        @init-api="apiTumb = $event"
      >
        <!-- eslint-disable vue/prefer-true-attribute-shorthand -->
        <CarouselContent
          class="m-0 gap-2 xl:flex-row"
          data-allow-mismatch
          :style="{ maxHeight: `${carouselHeight}px` }"
        >
          <CarouselItem
            v-for="(img, index) in project.images"
            :key="img.id"
            :class="cn('flex w-fit cursor-grab items-center justify-center p-0 xl:basis-auto', index === current && 'outline outline-8 -outline-offset-8 outline-black')"
            @click="current = index"
          >
            <NuxtImg
              :alt="img.alt"
              :class="cn('aspect-video w-full xl:max-w-60', img.fit)"
              format="avif,webp,png,jpg"
              :src="img.url"
            />
          </CarouselItem>
        </CarouselContent>
      </Carousel>
      <Carousel
        ref="carouselRef"
        class="md:hidden aspect-video w-full xl:order-1"
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

    <section class="grid grid-cols-[repeat(2,max-content)] gap-4 pt-12 md:pt-0 md:pb-8">
      <span class="font-semibold">Статус</span>
      <span>{{ project.status[0]!.toUpperCase() + project.status.slice(1) }}</span>
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
      class="hidden md:flex w-full flex-col gap-4"
    >
      <NuxtImg
        v-for="img in project.images"
        :key="img.id"
        :alt="img.alt"
        :class="cn('max-h-[70vh] w-full', img.fit)"
        format="avif,webp,png,jpg"
        :src="img.url"
      />
    </div>
  </main>
</template>
