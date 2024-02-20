<script setup lang="ts">
import type { CarouselApi } from '@/components/ui/carousel'

const images = ['preview1.jpg', 'preview2.jpg', 'preview3.jpg']
const route = useRoute()
const api = ref<CarouselApi | null>(null)
const apiTumb = ref<CarouselApi | null>(null)
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

function selectImage(index: number) {
  apiTumb.value?.scrollTo(index)
  api.value?.scrollTo(index)
}

/* watch(apiTumb, () => {
  if (!apiTumb.value)
    return

  apiTumb.value.on('select', (apiTumb) => {
    current.value = apiTumb.selectedScrollSnap()
  })
} , { once: true }) */

// watch(current, (current) => {
// apiTumb.value?.scrollTo(current)
// api.value?.scrollTo(current)
// })
</script>

<template>
  <main class="flex flex-col container">
    <section class="flex justify-between px-8 py-4">
      <h1 class="text-3xl font-bold">
        {{ route.params.projectName }}
      </h1>
      <span class="text-3xl">{{ 'строительство' }}</span>
    </section>
    <Separator />
    <div class="grid grid-cols-[300px,1fr] divide-x-2 divide-primary-foreground">
      <Carousel

        orientation="vertical"
        :opts="{
          axis: 'x',
          loop: true,
        }"
        @init-api="setApi($event, 'tumb')"
      >
        <CarouselContent class="mt-0 h-fit divide-y-2">
          <CarouselItem
            v-for="(img, index) in images"
            :key="img"
            class="cursor-grab p-0"

            :class="[index === current ? 'saturate-200' : '']"
            @click="selectImage(index)"
          >
            <NuxtImg
              :src="`/images/${img}`" class="aspect-video w-full object-cover"
            />
          </CarouselItem>
        </CarouselContent>
      </Carousel>
      <Carousel
        :opts="{
          loop: true,
        }"
        @init-api="setApi($event, 'main')"
      >
        <CarouselContent class="flex h-max items-center">
          <CarouselItem v-for="img in images" :key="img" class="flex justify-center items-center">
            <NuxtImg :src="`/images/${img}`" class="w-full aspect-video object-contain" />
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </div>
  </main>
</template>
