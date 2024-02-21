<script setup lang="ts">
import type { CategoryRec, ThemeRec } from '~/server/db/schema'

const { data: themes, error: _error } = await useFetch<ThemeRec[]>('/api/themes')

const currentTheme = ref<ThemeRec | null>(themes.value?.[0] || null)
function changeTheme(theme: ThemeRec) {
  currentTheme.value = theme
}
const currentCategory = ref<CategoryRec | null>(currentTheme.value?.categories[0] || null)
function changeCategory(category: CategoryRec) {
  currentCategory.value = category
}
</script>

<template>
  <main class="flex flex-col">
    <section class="grid items-center grid-cols-2 divide-x ">
      <h2
        v-for="theme in themes" :key="theme.id"
        class="text-3xl font-bold px-8 py-4 hover:bg-secondary cursor-pointer transition-colors"
        :class="[theme === currentTheme ? 'bg-primary-foreground' : '']"
        tabindex="0"
        @keypress.enter.space="changeTheme(theme)"
        @click="changeTheme(theme)"
      >
        {{ theme.title }}
      </h2>
    </section>
    <Separator />
    <section class="grid grid-cols-[repeat(6,min-content)] items-center gap-4 mx-8 my-4 justify-between">
      <Button
        v-for="c in currentTheme?.categories" :key="c.id" variant="ghost" class="w-fit"
        :class="[c === currentCategory ? 'bg-secondary' : '']"
        @click="changeCategory(c)"
      >
        {{ c.title }}
      </Button>
    </section>
    <Separator />
    <section class="grid lg:grid-cols-1 grid-cols-2 gap-x-[2px] gap-y-[2px] ">
      <NuxtLink v-for="p in currentCategory?.projects" :key="p.id" :to="`/projects/${p.urlFriendly}-${p.id}`" class="flex flex-col hover:bg-primary-foreground transition-colors">
        <Carousel>
          <CarouselContent>
            <CarouselItem v-for="img in p.images" :key="img.id">
              <NuxtImg :src="`/images/projects/${p.id}/${img.title}`" :alt="img.title || 'image'" class="aspect-video w-full object-cover" />
            </CarouselItem>
          </CarouselContent>
        </Carousel>
        <div class="flex gap-8 mx-8 my-4 items-center justify-between">
          <h4>{{ p.title }}</h4>
          <span class="text-slate-400">{{ p.yearStart }}</span>
        </div>
      </NuxtLink>
    </section>
  </main>
</template>
