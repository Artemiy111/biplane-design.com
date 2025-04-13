<script setup lang="ts">
import { animate, stagger } from 'motion'
import SplitType from 'split-type'

import { cn } from '~~/src/shared/lib/utils'
import { buttonVariants } from '~~/src/shared/ui/kit/button'

const title = 'Biplane-Design | Главная'
const description = 'Студия дизайна'
useSeoMeta({ title, ogTitle: title, description, ogDescription: description })

onMounted(() => {
  const heroTitle = new SplitType('[data-hero-title]', { types: 'words' })
  animate(heroTitle.words || [], { y: [80, 0], opacity: [0, 1] }, { duration: 1, delay: stagger(0.2) })

  const heroDescription = new SplitType('[data-hero-description]', { types: 'words' })
  animate(heroDescription.words || [], { y: [20, 0], opacity: [0, 1] }, { duration: 1, delay: stagger(0.1) })
})
</script>

<template>
  <main class="relative flex h-full grow flex-col justify-center">
    <NuxtImg
      class="h-full-except-header w-full object-cover"
      src="/main.jpg"
    />
    <section class="absolute mx-container-pad gap-4 pb-[200px] ">
      <h1
        class="relative text-[140px] font-bold leading-none text-yellow-400 lg:text-[100px] md:text-[80px] sm:text-[60px]  xl:text-[120px]"
        data-hero-title
      >
        Biplane<br>Design
      </h1>
      <p
        class="mt-4 pl-2 text-subheading text-white"
        data-hero-description
      >
        <span>Первоклассные решения</span>&nbsp;<span class="whitespace-nowrap">в архитектуре и дизайне</span>
      </p>
      <NuxtLink
        :class="cn(buttonVariants({ variant: 'outline' }), 'ml-2 mt-8 w-fit bg-transparent text-white hover:bg-black/30 hover:text-white')"
        to="/projects"
      >
        Смотреть проекты</NuxtLink>
    </section>
  </main>
</template>
