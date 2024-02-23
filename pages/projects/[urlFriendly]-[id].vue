<script setup lang="ts">
import { useElementSize } from '@vueuse/core'
import type { ComponentPublicInstance } from 'vue'
import { Carousel, type CarouselApi } from '@/components/ui/carousel'

const route = useRoute()
const projectId = route.params.id! as string
const { data: project, error: _error } = await useFetch(`/api/projects/${projectId}`)

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
    <section class="flex justify-between px-8 py-4">
      <h1 class="text-3xl font-bold">
        {{ project.title }}
      </h1>
      <span class="text-3xl">{{ project.status }}</span>
    </section>
    <Separator />
    <div
      class="grid items-start grid-cols-[300px,1fr] 2xl:grid-cols-[250px,1fr] xl:grid-cols-[200px,1fr] overflow-hidden h-fit divide-x-2 divide-primary-foreground"
    >
      <Carousel
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
              class="w-full aspect-video object-contain"
            />
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </div>
  </main>
</template>
