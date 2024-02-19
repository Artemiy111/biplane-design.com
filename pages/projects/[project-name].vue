<script setup lang="ts">
const images = ['preview1.jpg', 'preview2.jpg', 'preview3.jpg']
</script>

<template>
  <main class="flex flex-col container">
    <section class="flex justify-between px-8 py-4">
      <h1 class="text-3xl font-bold">
        {{ 'Беседка у пруда' }}
      </h1>
      <span class="text-3xl">{{ 'строительство' }}</span>
    </section>
    <Separator />
    <Carousel>
      <CarouselContent class="h-[90dvh]">
        <CarouselItem v-for="img in images" :key="img">
          <NuxtImg :src="`/images/${img}`" class="aspect-video w-full object-cover" />
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  </main>
</template>
