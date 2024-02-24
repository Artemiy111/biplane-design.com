<script setup lang="ts">
import { useElementSize } from '@vueuse/core'
import type { ComponentPublicInstance } from 'vue'
import { Carousel, type CarouselApi } from '@/components/ui/carousel'

const route = useRoute()
const projectUrlFriendly = route.params.urlFriendly! as string
const { data: project, error: _error } = await useFetch(`/api/projects/${projectUrlFriendly}`)

const api = ref<CarouselApi | null>(null)
const apiTumb = ref<CarouselApi | null>(null)
const mainCarouselRef = ref<ComponentPublicInstance | null>(null)
const { height: mainCarouselHeight } = useElementSize(mainCarouselRef)
const totalCount = ref(0)
const current = ref(0)

function setApi(val: CarouselApi, type: 'main' | 'tumb') {
  if (type === 'main')
    api.value = val
  else if (type === 'tumb')
    apiTumb.value = val
}

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
  <main v-if="project" class="flex flex-col container">
    <section class="flex justify-between px-8 py-4 sm:py-2 sm:text-base lg:text-xl md:text-lg 2xl:text-2xl text-3xl">
      <h1 class="font-bold">
        {{ project.title }}
      </h1>
      <span class="">{{ project.status }}</span>
    </section>
    <Separator />
    <section
      class="grid items-start grid-cols-[300px,1fr] md:grid-cols-1 2xl:grid-cols-[250px,1fr] xl:grid-cols-[200px,1fr] lg:grid-cols-[150px,1fr] overflow-hidden h-fit divide-x-2 divide-primary-foreground"
    >
      <Carousel
        class="md:hidden"
        orientation="vertical"
        :opts="{
          loop: true,
          align: 'start',
          dragFree: true,
        }"
        @init-api="setApi($event, 'tumb')"
      >
        <CarouselContent
          class=" divide-y-2 mt-0"
          :style="{ maxHeight: `${mainCarouselHeight}px` }"
        >
          <CarouselItem
            v-for="(img, index) in project.images"
            :key="img.filename"
            class="cursor-grab p-0"

            :class="[index === current ? 'outline outline-[16px] xl:outline-8 xl:-outline-offset-8 outline-secondary -outline-offset-[16px]' : '']"
            @click="current = index"
          >
            <NuxtImg
              :src="`/images/projects/${project.urlFriendly}/${img.filename}`"
              format="avif,webp,png,jpg"
              class="aspect-video w-full object-cover"
            />
          </CarouselItem>
        </CarouselContent>
      </Carousel>
      <Carousel
        ref="mainCarouselRef"
        class="w-full aspect-video"
        :opts="{
          loop: true,
        }"
        @init-api="setApi($event, 'main')"
      >
        <CarouselContent class="flex items-center">
          <CarouselItem
            v-for="img in project.images"
            :key="img.filename"
            class="flex justify-center items-center"
          >
            <NuxtImg
              :src="`/images/projects/${project.urlFriendly}/${img.filename}`"
              format="avif,webp,png,jpg"
              class="w-full aspect-video object-contain"
            />
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </section>
    <Separator />
    <section class="px-8 py-8 gap-x-16 gap-y-2 grid grid-cols-[repeat(2,max-content)]">
      <span>Расположение</span>
      <span>{{ project.location }}</span>
      <template v-if="project.yearStart">
        <span>Год начала</span>
        <span>{{ project.yearStart }}</span>
      </template>
      <template v-if="project.yearEnd">
        <span>Год завершения</span>
        <span>{{ project.yearEnd }}</span>
      </template>
    </section>
  </main>
</template>
