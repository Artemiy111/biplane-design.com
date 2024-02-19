<script setup lang="ts">
const categories = ['Лучшие', 'Здания', 'Офисы', 'Общественное', 'Рестораны', 'Квартиры']
const images = ['preview1.jpg', 'preview2.jpg', 'preview3.jpg']
</script>

<template>
  <main class="flex flex-col">
    <section class="grid items-center grid-cols-2 divide-x ">
      <h2 class="text-3xl font-bold px-8 py-4 hover:bg-primary-foreground cursor-pointer transition-colors">
        Архитектура
      </h2>
      <h2 class="text-3xl font-bold px-8 py-4 hover:bg-primary-foreground cursor-pointer transition-colors">
        Графика
      </h2>
    </section>
    <Separator />
    <section class="grid grid-cols-[repeat(6,min-content)] items-center gap-4 mx-8 my-4 justify-between">
      <Button v-for="c in categories" :key="c" variant="ghost" class="w-fit">
        {{ c }}
      </Button>
    </section>
    <Separator />
    <section class="grid grid-cols-2 gap-x-[2px] gap-y-[1px]">
      <NuxtLink v-for="link in images" :key="link" to="/projects/home" class="flex flex-col hover:bg-primary-foreground transition-colors">
        <Carousel>
          <CarouselContent>
            <CarouselItem v-for="img in images" :key="img">
              <NuxtImg :src="`/images/${img}`" class="aspect-video w-full object-cover" />
            </CarouselItem>
          </CarouselContent>
        </Carousel>
        <div class="flex gap-8 mx-8 my-4 items-center justify-between">
          <h4>{{ 'Алтайский кедр' }}</h4>
          <span class="text-slate-400">{{ '2018' }}</span>
        </div>
      </NuxtLink>
    </section>
  </main>
</template>
