<script setup lang="ts">
import { gsap } from 'gsap'
import SplitType from 'split-type'

import { cn } from '~~/src/shared/lib/utils'
import { buttonVariants } from '~~/src/shared/ui/kit/button'

const title = 'Biplane-Design | Главная'
const description = 'Студия дизайна'
useServerSeoMeta({ title, ogTitle: title, description, ogDescription: description })
useSeoMeta({ title, ogTitle: title, description, ogDescription: description })

const headingRef = useTemplateRef('headingRef')

onMounted(() => {
  if (!headingRef.value) return
  const headingText = new SplitType(headingRef.value, { types: 'words' })
  gsap.from(headingText.words, { y: 80, duration: 0.8, opacity: 0, stagger: 0.2 })
  const descriptionText = new SplitType('.gsap-description', { types: 'words' })
  gsap.from(descriptionText.words, { y: 20, opacity: 0, duration: 0.2, stagger: 0.1 })
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
        ref="headingRef"
        class="text-[140px] font-bold leading-none text-yellow-400 lg:text-[100px] md:text-[80px] sm:text-[60px]  xl:text-[120px]"
      >
        Biplane<br>Design
      </h1>
      <p
        class="gsap-description mt-4 pl-2 text-subheading text-white"
      >
        <span>Первоклассные решения</span>&nbsp;<span class="whitespace-nowrap">в архитектуре и дизайне</span>
      </p>
      <NuxtLink
        :class="cn(buttonVariants({ variant: 'outline' }), 'mt-8 w-fit ml-2 text-white hover:text-white bg-transparent hover:bg-black/30')"
        to="/projects"
      >
        Смотреть проекты</NuxtLink>
    </section>
  </main>
</template>
