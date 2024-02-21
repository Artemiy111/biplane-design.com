<script setup lang="ts">
import type { CarouselApi } from '@/components/ui/carousel'
import type { ProjectRec } from '~/server/db/schema'

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

const projectId = route.params.id! as string
const { data: project, error: _error } = await useFetch<ProjectRec>(`/api/projects/${projectId}`)

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
            v-for="(img, index) in project.images"
            :key="img.filename"
            class="cursor-grab p-0"

            :class="[index === current ? 'saturate-200' : '']"
            @click="selectImage(index)"
          >
            <NuxtImg
              :src="`/images/projects/${project.urlFriendly}/${img.filename}`" class="aspect-video w-full object-cover"
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
          <CarouselItem v-for="img in project.images" :key="img.filename" class="flex justify-center items-center">
            <NuxtImg :src="`/images/projects/${project.urlFriendly}/${img.filename}`" class="w-full aspect-video object-contain" />
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </div>
  </main>
</template>
