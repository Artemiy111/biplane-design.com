<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { gsap } from 'gsap'
import SplitType from 'split-type'

import { cn } from '~~/src/shared/lib/utils'
import { useHeaderSize } from '~~/src/shared/model/use-header-size'
import { buttonVariants } from '~~/src/shared/ui/kit/button'

const title = 'Biplane-Design | Главная'
const description = 'Студия дизайна'
useServerSeoMeta({ title, ogTitle: title, description, ogDescription: description })
useSeoMeta({ title, ogTitle: title, description, ogDescription: description })

const { height: _windowHeight } = useWindowSize()
const windowHeight = computed(() => Number.isFinite(_windowHeight.value) ? _windowHeight.value : 1080)
const { height: headerHeight } = useHeaderSize()
const mainScreenHeight = computed(() => windowHeight.value - headerHeight.value)

const headingRef = ref<HTMLHeadingElement | null>(null)

onMounted(() => {
  if (!headingRef.value) return
  const headingText = new SplitType(headingRef.value, { types: 'words' })
  gsap.from(headingText.words, { y: 80, duration: 0.8, opacity: 0, stagger: 0.2 })
  const descriptionText = new SplitType('.gsap-description', { types: 'words' })
  gsap.from(descriptionText.words, { y: 20, opacity: 0, duration: 0.2, stagger: 0.1 })
})
</script>

<template>
  <main class="container relative justify-center flex flex-col flex-grow h-full">
    <ClientOnly>
      <NuxtImg
        class="w-full object-cover"
        src="/main.jpg"
        :style="{ height: `${mainScreenHeight}px` }"
      />
    </ClientOnly>
    <section class="absolute mx-4 flex gap-4 flex-col flex-grow pb-[200px]">
      <h1
        ref="headingRef"
        class="text-[150px] xl:text-[120px] lg:text-[100px] md:text-[80px] sm:text-[60px] font-bold leading-none text-yellow-400"
      >
        Biplane<br>Design
      </h1>
      <span
        class="gsap-description font-medium pl-2 leading-[130%] md:text-xl sm:text-lg xs:text-base text-white text-3xl"
      ><span>Первоклассные решения</span>&nbsp;<span class="whitespace-nowrap">в архитектуре и дизайне</span>
      </span>
      <NuxtLink
        :class="cn(buttonVariants({ variant: 'outline' }), 'w-fit ml-2 text-white hover:text-white bg-transparent hover:bg-black/30')"
        to="/projects"
      >
        Смотреть проекты</NuxtLink>
    </section>
  </main>
</template>
