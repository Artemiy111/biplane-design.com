<script setup lang="ts">
import { useBreakpoints, useElementSize, watchOnce } from '@vueuse/core'
import { LoaderCircle } from 'lucide-vue-next'
import { cn } from '~~/src/shared/lib/utils'
import PageHeading from '~~/src/shared/ui/blocks/page-heading/page-heading.vue'
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '~~/src/shared/ui/kit/carousel'
import { breakpoints  } from '~~/src/shared/config/breakpoints'
import { useProjectQuery } from '~~/src/shared/model/queries'

const props = defineProps<{
  slug: string
}>()

const slug = computed(() => props.slug)

const bps = useBreakpoints(breakpoints, { strategy: 'max-width' })
const xl = bps.smallerOrEqual('xl')

const {project, status} = useProjectQuery(slug)
const api = ref<CarouselApi>()
const apiTumb = ref<CarouselApi>()
const tumbOrientation = computed(() => xl.value ? 'horizontal' : 'vertical')
const carouselRef = useTemplateRef('carouselRef')
const { height: carouselHeight } = useElementSize(() => carouselRef.value?.carouselRef)
const totalCount = ref(0)
const current = ref(0)

const title = computed(() => `Проекты | ${project.value?.title}`)
const description = computed(() => `${project.value?.title}. Расположение: ${project.value?.location}`)
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

</script>

<template>
  <main
    v-if="project"
    class="container flex flex-col"
  >
    <PageHeading>{{ project.title }}</PageHeading>
    <section
      class="grid h-fit grid-cols-[300px_1fr] items-start gap-4 overflow-hidden max-2xl:grid-cols-[250px_1fr] max-xl:grid-cols-1"
    >
      <Carousel
        class="max-xl:order-2"
        :opts="{
          loop: false,
          align: 'start',
          dragFree: true,
        }"
        :orientation="tumbOrientation"
        @init-api="apiTumb = $event"
      >
        <!-- eslint-disable vue/prefer-true-attribute-shorthand -->
        <CarouselContent
          class="m-0 gap-2 max-xl:flex-row"
          data-allow-mismatch
          :style="{ maxHeight: `${carouselHeight}px` }"
        >
          <CarouselItem
            v-for="(img, index) in project.images"
            :key="img.id"
            :class="cn('flex w-fit cursor-grab items-center justify-center p-0 max-xl:basis-auto', index === current && 'outline-8 -outline-offset-8 outline-black')"
            @click="current = index"
          >
            <NuxtImg
              :alt="img.alt"
              :class="cn('aspect-video w-full max-xl:max-w-60 max-lg:max-w-50', img.fit)"
              format="avif,webp,png,jpg"
              :src="img.url"
            />
          </CarouselItem>
        </CarouselContent>
      </Carousel>
      <Carousel
        ref="carouselRef"
        class="max-md:hidden aspect-video w-full max-xl:order-1"
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

    <section class="grid grid-cols-[repeat(2,max-content)] gap-4 pt-12 max-md:pt-0 max-md:pb-8">
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
      class="hidden max-md:flex w-full flex-col gap-4"
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
  <main v-else-if="status === 'pending'" class="grid h-full items-center justify-center">
    <LoaderCircle
      class="animate-spin"
      :size="60"
      :stroke-width="1.5"
    />
  </main>
  <main v-else-if="status === 'error'" class="grid h-full items-center justify-center">
    <span class="bg-red-100 p-8 text-subheading text-destructive">Проект не найден</span> 
  </main>
</template>
